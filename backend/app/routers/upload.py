from fastapi import APIRouter, File, UploadFile, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
import os
import json
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.schemas.models import TranscriptMetadata, TranscriptFeatures, TranscriptSegment, User
from app.schemas.schemas import CAResult
from app.services.audio_converter import AudioConverter
from app.services.speech_service import SpeechService
from app.services.conversation_analytics import ConversationAnalytics
from app.core.config import SPEECH_KEY, SPEECH_REGION, API_TOKEN

router = APIRouter(prefix="/upload", tags=["upload"])

audio_converter = AudioConverter()
speech_service = SpeechService(SPEECH_KEY, SPEECH_REGION)
conversation_analytics = ConversationAnalytics()

# TODO: Complete OAuth2 implementation and use actual details

# Helper to get or create a user
async def get_or_create_user(db: AsyncSession, user_id: int) -> User:
    user = await db.get(User, user_id)
    if user is None:
        user = User(id=user_id, email=str(user_id))
        db.add(user)
        await db.flush()
    return user

# Helper to get the next transcript id for a user
async def get_next_transcript_id(db: AsyncSession, user_id: int) -> int:

    # Get the highest transcript id for the user
    query = select(func.max(TranscriptMetadata.transcript_id)).filter(TranscriptMetadata.user_id == user_id)
    result = await db.execute(query)
    
    highest_transcript_id = result.scalar_one_or_none()
    
    # Add 1 to the highest ID otherwise its the first transcript
    if highest_transcript_id is not None:
        return highest_transcript_id + 1
    else:
        return 1


@router.post("")
async def upload_audio(authorization: str = Header(..., alias="Authorization"), file: UploadFile = File(...), user_id: int = Header(..., alias="User-ID"), created_at: str = Header(..., alias="Created-At"), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    
    # Verify API token
    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        created_at_datetime = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        if created_at_datetime.tzinfo is not None:
            created_at_datetime = created_at_datetime.astimezone(timezone.utc).replace(tzinfo=None)
        created_at = created_at_datetime
    except (ValueError, AttributeError):
        raise HTTPException(status_code=400, detail="Invalid creation date")

    # Verify file is an audio file
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Must upload an audio file")

    # Create temporary files
    temp_input = "/tmp/input.m4a"
    temp_wav = "/tmp/output.wav"

    try:
        # Save uploaded file to temporary location
        contents = await file.read()
        with open(temp_input, "wb") as temp_file:
            temp_file.write(contents)

        # Convert audio to WAV format
        audio_converter.convert_to_wav(temp_input, temp_wav)

        # Perform speaker diarisation
        segments = speech_service.diarise_audio(temp_wav)

        # Perform conversation feature extraction
        analytics: CAResult = conversation_analytics.analyse(segments)

        # Get or create user
        await get_or_create_user(db, user_id)

        # Get next transcript id for the user
        transcript_id = await get_next_transcript_id(db, user_id)

        # Calculate total duration with safe type conversion
        total_duration = sum(float(segment.get("duration", 0.0) or 0.0) for segment in segments)

        # Add the transcript metadata to the database
        transcript_metadata = TranscriptMetadata(
            user_id=user_id,
            transcript_id=transcript_id,
            created_at=created_at,
            total_duration=total_duration,
        )
        db.add(transcript_metadata)
        await db.flush()
        
        # Add the transcript features to the database
        transcript_features = TranscriptFeatures(
            transcript_metadata_id=transcript_metadata.id,
            wpm_per_speaker=json.dumps(analytics.get("wpm_per_speaker", {}) or {}),
            mean_utterance_length=json.dumps(analytics.get("mean_utterance_length_per_speaker", {}) or {}),
            avg_word_length=json.dumps(analytics.get("avg_word_length", {}) or {}),
            adverb_ratio=json.dumps(analytics.get("adverb_ratio", {}) or {}),
            flesch_kincaid=json.dumps(analytics.get("flesch_kincaid", {}) or {}),
            prp_ratio=json.dumps(analytics.get("prp_ratio", {}) or {}),
            num_unique_words=json.dumps(analytics.get("num_unique_words", {}) or {}),
            impoverished_vocabulary=json.dumps(analytics.get("impoverished_vocabulary", {}) or {}),
            word_finding_difficulties=json.dumps(analytics.get("word_finding_difficulties", {}) or {}),
            semantic_paraphasias=json.dumps(analytics.get("semantic_paraphasias", {}) or {}),
            syntactic_simplification=json.dumps(analytics.get("syntactic_simplification", {}) or {}),
            discourse_impairment=json.dumps(analytics.get("discourse_impairment", {}) or {})
        )
        db.add(transcript_features)
        await db.flush()
        
        # Add the segments to the database
        for segment in segments:
            transcript_segment = TranscriptSegment(
                transcript_metadata_id=transcript_metadata.id,
                duration=float(segment.get("duration", 0.0) or 0.0),
                offset=float(segment.get("offset", 0.0) or 0.0),
                speaker=segment.get("speaker", ""),
                text=segment.get("text", "")
            )
            db.add(transcript_segment)
        await db.commit()
        
        analytics["transcript_id"] = transcript_id
        analytics["db_transcript_id"] = transcript_metadata.id
        
        return JSONResponse(content=analytics)

    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Error while processing audio")
    finally:
        # Clean up temporary files
        for path in (temp_input, temp_wav):
            try:
                if os.path.exists(path):
                    os.remove(path)
            except Exception:
                pass