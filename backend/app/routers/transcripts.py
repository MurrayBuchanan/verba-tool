from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, delete

from app.core.database import get_db
from app.core.authentication import get_user_id
from app.schemas.models import TranscriptMetadata, TranscriptFeatures, TranscriptSegment, Profile as ProfileModel

router = APIRouter(prefix="/transcripts", tags=["transcripts"])

# Helper to unmarshall the transcript features from the database to a dictionary
def get_feature(features, feature):
    value = getattr(features, feature, None)
    if value:
        return json.loads(value)
    else:
        return {}


@router.get("")
async def get_transcripts(user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db), profile_id: int = Query(...)) -> JSONResponse:
    try:
        # Authenticate profile
        profile = (await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))).scalar_one_or_none()
        if profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")

        # Get all transcripts metadata and features for a profile
        result = await db.execute(select(TranscriptMetadata, TranscriptFeatures).join(TranscriptFeatures, TranscriptMetadata.id == TranscriptFeatures.transcript_metadata_id).filter(TranscriptMetadata.profile_id == profile_id).order_by(desc(TranscriptMetadata.id)))
        rows = result.all()

        transcript_list = []
        for transcript, features in rows:
            transcript_list.append({
                "id": transcript.id,
                "profile_id": transcript.profile_id,
                "total_duration": transcript.total_duration,
                "created_at": transcript.created_at.isoformat(),
                "wpm_per_speaker": get_feature(features, "wpm_per_speaker"),
                "avg_word_length": get_feature(features, "avg_word_length"),
                "adverb_ratio": get_feature(features, "adverb_ratio"),
                "flesch_kincaid": get_feature(features, "flesch_kincaid"),
                "prp_ratio": get_feature(features, "prp_ratio"),
                "num_unique_words": get_feature(features, "num_unique_words"),
                "impoverished_vocabulary": get_feature(features, "impoverished_vocabulary"),
                "word_finding_difficulties": get_feature(features, "word_finding_difficulties"),
                "semantic_paraphasias": get_feature(features, "semantic_paraphasias"),
                "syntactic_simplification": get_feature(features, "syntactic_simplification"),
                "discourse_impairment": get_feature(features, "discourse_impairment"),
            })
        return JSONResponse(content={"transcripts": transcript_list})
    except Exception:
        raise HTTPException(status_code=500, detail="Error while fetching transcripts")

# Endpoint to get a specific transcript with segments
@router.get("/{transcript_id}")
async def get_transcript(transcript_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(TranscriptMetadata).join(ProfileModel, TranscriptMetadata.profile_id == ProfileModel.id).filter(TranscriptMetadata.id == transcript_id, ProfileModel.user_id == user_id))
        transcript = result.scalar_one_or_none()

        if transcript is None:
            raise HTTPException(status_code=404, detail="Transcript not found")
        
        # Get all segments for transcript in order of creation
        segments = await db.execute(select(TranscriptSegment).filter(TranscriptSegment.transcript_metadata_id == transcript.id).order_by(TranscriptSegment.offset))
        segments = segments.scalars().all()

        transcript_segments = []
        for segment in segments:
            transcript_segments.append({
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
            "segments": transcript_segments
        })
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Error while fetching transcript")

@router.delete("/{transcript_id}")
async def delete_transcript(transcript_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(TranscriptMetadata).join(ProfileModel, TranscriptMetadata.profile_id == ProfileModel.id).filter(TranscriptMetadata.id == transcript_id, ProfileModel.user_id == user_id))
        transcript = result.scalar_one_or_none()

        if transcript is None:
            raise HTTPException(status_code=404, detail="Transcript not found")
        
        # Delete all metadata, segments, and features for a transcript
        await db.execute(delete(TranscriptSegment).filter(TranscriptSegment.transcript_metadata_id == transcript.id))
        await db.execute(delete(TranscriptFeatures).filter(TranscriptFeatures.transcript_metadata_id == transcript.id))
        await db.execute(delete(TranscriptMetadata).filter(TranscriptMetadata.id == transcript.id))
        
        await db.commit()
        
        return JSONResponse(content={"message": "Transcript deleted"})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot delete transcript")