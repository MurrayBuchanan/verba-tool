from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, delete

from app.core.database import get_db
from app.core.authentication import get_user_id
from app.structures.models import TranscriptMetadata, TranscriptFeatures, TranscriptSegment, Profile as ProfileModel

router = APIRouter(prefix="/transcripts", tags=["transcripts"])

# Get all transcripts for a profile for chart
@router.get("")
async def get_transcripts(user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db), profile_id: int = Query(...)) -> JSONResponse:
    try:
        profile = (await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))).scalar_one_or_none()
        if profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")

        result = await db.execute(select(TranscriptMetadata, TranscriptFeatures).join(TranscriptFeatures, TranscriptMetadata.id == TranscriptFeatures.transcript_metadata_id).where(TranscriptMetadata.profile_id == profile_id).order_by(TranscriptMetadata.created_at.desc()))
        rows = result.all()

        db_transcripts = []
        for transcript, features in rows:
            db_transcripts.append({
                "id": transcript.id,
                "profile_id": transcript.profile_id,
                "total_duration": transcript.total_duration,
                "created_at": transcript.created_at.isoformat(),
                "words_per_minute": json.loads(features.words_per_minute),
                "average_word_length": json.loads(features.average_word_length),
                "adverb_ratio": json.loads(features.adverb_ratio),
                "flesch_kincaid_grade": json.loads(features.flesch_kincaid_grade),
                "personal_pronoun_ratio": json.loads(features.personal_pronoun_ratio),
                "number_of_unique_words": json.loads(features.number_of_unique_words),
                "impoverished_vocabulary": json.loads(features.impoverished_vocabulary),
                "word_finding_difficulties": json.loads(features.word_finding_difficulties),
                "semantic_paraphasias": json.loads(features.semantic_paraphasias),
                "syntactic_simplification": json.loads(features.syntactic_simplification),
                "discourse_impairment": json.loads(features.discourse_impairment),
            })

        return JSONResponse(content={"transcripts": db_transcripts})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot fetch transcripts")

# Get a specific transcript with segments for chat
@router.get("/{transcript_id}")
async def get_transcript(transcript_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(TranscriptMetadata).join(ProfileModel, TranscriptMetadata.profile_id == ProfileModel.id).where(TranscriptMetadata.id == transcript_id, ProfileModel.user_id == user_id))
        transcript = result.scalar_one_or_none()

        if transcript is None:
            raise HTTPException(status_code=404, detail="Transcript not found")
        
        segments = await db.execute(select(TranscriptSegment).where(TranscriptSegment.transcript_metadata_id == transcript.id).order_by(TranscriptSegment.offset))
        segments = segments.scalars().all()

        db_segments = []
        for segment in segments:
            db_segments.append({
                "duration": segment.duration,
                "offset": segment.offset,
                "speaker": segment.speaker,
                "text": segment.text
            })
        
        return JSONResponse(content={
            "id": transcript.id,
            "profile_id": transcript.profile_id,
            "created_at": transcript.created_at.isoformat(),
            "total_duration": transcript.total_duration,
            "segments": db_segments
        })
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot fetch transcript")

# Delete a transcript
@router.delete("/{transcript_id}")
async def delete_transcript(transcript_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(TranscriptMetadata).join(ProfileModel, TranscriptMetadata.profile_id == ProfileModel.id).where(TranscriptMetadata.id == transcript_id, ProfileModel.user_id == user_id))
        transcript = result.scalar_one_or_none()

        if transcript is None:
            raise HTTPException(status_code=404, detail="Transcript not found")
        
        # Delete transcript parts (dependencies too)
        await db.execute(delete(TranscriptSegment).where(TranscriptSegment.transcript_metadata_id == transcript.id))
        await db.execute(delete(TranscriptFeatures).where(TranscriptFeatures.transcript_metadata_id == transcript.id))
        await db.execute(delete(TranscriptMetadata).where(TranscriptMetadata.id == transcript.id))
        
        await db.commit()
        
        return JSONResponse(content={"message": "Transcript deleted"})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot delete transcript")