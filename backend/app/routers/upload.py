from fastapi import APIRouter, File, UploadFile, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
import json
import os
import tempfile
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.authentication import get_user_id
from app.structures.models import TranscriptMetadata, TranscriptFeatures, TranscriptSegment, Profile as ProfileModel
from app.structures.schemas import Transcript
from app.services.audio_converter import AudioConverter
from app.services.speech_service import SpeechService
from app.services.conversation_analytics import ConversationAnalytics
from app.services.quality_gate import check_quality_gate
from app.core.config import SPEECH_KEY, SPEECH_REGION

router = APIRouter(prefix="/upload", tags=["upload"])

audio_converter = AudioConverter()
speech_service = SpeechService(SPEECH_KEY, SPEECH_REGION)
conversation_analytics = ConversationAnalytics()

@router.post("")
async def upload_audio(file: UploadFile = File(...), created_at: str = Header(..., alias="Created-At"), profile_id: int = Header(..., alias="Profile-Id"), user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        # Convert creation date to UTC as standard format for database
        created_at_datetime = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        if created_at_datetime.tzinfo is not None:
            created_at_datetime = created_at_datetime.astimezone(timezone.utc).replace(tzinfo=None)
        created_at = created_at_datetime

    except (ValueError, AttributeError):
        raise HTTPException(status_code=400, detail="Invalid creation date")
    
    # Check if profile exists
    result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Verify uploaded file is an audio file
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid audio format")

    try:
        # Store audio in a temporary directory to allow Azure Speech Service to process it
        with tempfile.TemporaryDirectory() as temp_directory:
            temp_input = os.path.join(temp_directory, "input.m4a")
            temp_wav = os.path.join(temp_directory, "output.wav")

            contents = await file.read()
            with open(temp_input, "wb") as temp_file:
                temp_file.write(contents)

            # Convert audio to WAV format
            audio_converter.convert_to_wav(temp_input, temp_wav)

            # Perform transcription and speaker diarisation
            segments = speech_service.diarise_audio(temp_wav)

            # Extract linguistic indicators from transcript
            analytics: Transcript = conversation_analytics.analyse(segments)

        # Check if the audio meets sufficient quality criteria
        quality_error = check_quality_gate(analytics)
        if quality_error:
            raise HTTPException(status_code=400, detail=quality_error)

        # Add the transcript to the database
        transcript_metadata = TranscriptMetadata(
            profile_id=profile.id,
            created_at=created_at,
            total_duration=analytics.total_duration or 0.0,
        )
        db.add(transcript_metadata)
        await db.flush()
        
        # Add the transcript features to the database
        transcript_features = TranscriptFeatures(
            transcript_metadata_id=transcript_metadata.id,
            words_per_minute=json.dumps(analytics.words_per_minute or {}),
            average_word_length=json.dumps(analytics.average_word_length or {}),
            adverb_ratio=json.dumps(analytics.adverb_ratio or {}),
            flesch_kincaid_grade=json.dumps(analytics.flesch_kincaid_grade or {}),
            personal_pronoun_ratio=json.dumps(analytics.personal_pronoun_ratio or {}),
            number_of_unique_words=json.dumps(analytics.number_of_unique_words or {}),
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
                duration=segment.duration,
                offset=segment.offset,
                speaker=segment.speaker,
                text=segment.text,
            )
            db.add(transcript_segment)
        await db.commit()
        
        return JSONResponse(content=analytics.model_dump())

    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot process audio")