from fastapi import FastAPI, File, UploadFile, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import os
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, text

from .config import API_TOKEN, SPEECH_KEY, SPEECH_REGION
from .audio_converter import AudioConverter
from .speech_service import SpeechService
from .conversation_analytics import ConversationAnalytics
from .database import get_db, engine
from .models import Base, Transcript, TranscriptSegment, User

app = FastAPI()

# CORS to allow requests from Expo Go/Dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
@app.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

audio_converter = AudioConverter()
speech_service = SpeechService(SPEECH_KEY, SPEECH_REGION)
conversation_analytics = ConversationAnalytics()

# Endpoint to upload audio for diarization and analytics
@app.post("/upload-audio")
async def upload_audio(
    authorization: str = Header(..., alias="Authorization"),
    file: UploadFile = File(...),
    user_id: int = Header(..., alias="User-ID"),
    db: AsyncSession = Depends(get_db)
) -> JSONResponse:
    # Token-based authentication
    expected = f"Bearer {API_TOKEN}"
    if authorization != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Must upload an audio file")

    temp_input = "/tmp/input.m4a"
    temp_wav = "/tmp/output.wav"

    # Save uploaded file to temp location
    try:
        contents = await file.read()
        with open(temp_input, "wb") as temp_file:
            temp_file.write(contents)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save audio: {str(error)}",
        )

    try:
        # Convert, diarize, and analyse
        audio_converter.convert_to_wav(temp_input, temp_wav)
        segments = speech_service.diarize_audio(temp_wav)
        analytics: Dict[str, Any] = conversation_analytics.analyse(segments)
        
        # Check if user exists, create if not
        user_result = await db.execute(
            select(User).filter(User.id == user_id)
        )
        user = user_result.scalar_one_or_none()
        
        if user is None:
            user = User(id=user_id, username=f"user_{user_id}", email=f"user_{user_id}")
            db.add(user)
            await db.flush()
            try:
                await db.execute(
                    text("SELECT setval('users_id_seq', GREATEST(:user_id, (SELECT MAX(id) FROM users) OR 0))")
                    .bindparams(user_id=user_id)
                )
            except Exception:
                pass

        # Auto-generate next transcript_id
        result = await db.execute(
            select(Transcript.transcript_id)
            .filter(Transcript.user_id == user_id)
            .order_by(desc(Transcript.transcript_id))
            .limit(1)
        )
        transcript_id = (result.scalars().first() + 1) or 0

        # Calculate total duration
        total_duration = sum(float(seg.get("duration", 0.0)) for seg in segments)

        # Create the transcript
        transcript_record = Transcript(
            user_id=user_id,
            transcript_id=transcript_id,
            number_of_turns=analytics.get("turns", {}).get("total", 0),
            total_duration=total_duration,
            wpm_per_speaker=json.dumps(analytics.get("wpm_per_speaker", {})),
            mean_utterance_length=json.dumps(analytics.get("mean_utterance_length_per_speaker", {}))
        )
        db.add(transcript_record)
        await db.flush()
        
        # Create segments
        for seg in segments:
            segment_record = TranscriptSegment(
                transcript_feature_id=transcript_record.id,
                duration=float(seg.get("duration", 0.0) or 0.0),
                offset=float(seg.get("offset", 0.0) or 0.0),
                speaker=seg.get("speaker", ""),
                text=seg.get("text", "")
            )
            db.add(segment_record)
        await db.commit()
        
        analytics["transcript_id"] = transcript_id
        analytics["db_transcript_id"] = transcript_record.id
        
        return JSONResponse(content=analytics)
    except Exception as error:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Audio processing failed: {str(error)}")
    finally:
        # Clean up temp files
        for path in (temp_input, temp_wav):
            try:
                if os.path.exists(path):
                    os.remove(path)
            except Exception:
                pass