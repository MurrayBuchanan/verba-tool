from fastapi import APIRouter, File, UploadFile, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
import os
import json
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.authentication import get_user_id
from app.schemas.models import TranscriptMetadata, TranscriptFeatures, TranscriptSegment, User, Profile as ProfileModel
from app.schemas.schemas import Transcript
from app.services.audio_converter import AudioConverter
from app.services.speech_service import SpeechService
from app.services.conversation_analytics import ConversationAnalytics
from app.core.config import SPEECH_KEY, SPEECH_REGION

router = APIRouter(prefix="/upload", tags=["upload"])

audio_converter = AudioConverter()
speech_service = SpeechService(SPEECH_KEY, SPEECH_REGION)
conversation_analytics = ConversationAnalytics()

@router.post("")
async def upload_audio(file: UploadFile = File(...), created_at: str = Header(..., alias="Created-At"), profile_id: int = Header(..., alias="Profile-Id"), user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        created_at_datetime = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        if created_at_datetime.tzinfo is not None:
            created_at_datetime = created_at_datetime.astimezone(timezone.utc).replace(tzinfo=None)
        created_at = created_at_datetime
    except (ValueError, AttributeError):
        raise HTTPException(status_code=400, detail="Invalid creation date")

    profile = (await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))).scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

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
        analytics: Transcript = conversation_analytics.analyse(segments)

        # Calculate total duration with safe type conversion
        total_duration = sum(float(segment.duration or 0.0) for segment in segments)

        # Add the transcript metadata to the database
        transcript_metadata = TranscriptMetadata(
            profile_id=profile_id,
            created_at=created_at,
            total_duration=total_duration,
        )
        db.add(transcript_metadata)
        await db.flush()
        
        # Add the transcript features to the database
        transcript_features = TranscriptFeatures(
            transcript_metadata_id=transcript_metadata.id,
            wpm_per_speaker=json.dumps(analytics.wpm_per_speaker or {}),
            avg_word_length=json.dumps(analytics.avg_word_length or {}),
            adverb_ratio=json.dumps(analytics.adverb_ratio or {}),
            flesch_kincaid=json.dumps(analytics.flesch_kincaid or {}),
            prp_ratio=json.dumps(analytics.prp_ratio or {}),
            num_unique_words=json.dumps(analytics.num_unique_words or {}),
            impoverished_vocabulary=json.dumps(analytics.impoverished_vocabulary or {}),
            word_finding_difficulties=json.dumps(analytics.word_finding_difficulties or {}),
            semantic_paraphasias=json.dumps(analytics.semantic_paraphasias or {}),
            syntactic_simplification=json.dumps(analytics.syntactic_simplification or {}),
            discourse_impairment=json.dumps(analytics.discourse_impairment or {})
        )
        db.add(transcript_features)
        await db.flush()
        
        # Add the segments to the database
        for segment in segments:
            transcript_segment = TranscriptSegment(
                transcript_metadata_id=transcript_metadata.id,
                duration=float(segment.duration or 0.0),
                offset=float(segment.offset or 0.0),
                speaker=segment.speaker or "",
                text=segment.text or ""
            )
            db.add(transcript_segment)
        await db.commit()
        
        analytics = analytics.model_dump()
        analytics["id"] = transcript_metadata.id
        
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