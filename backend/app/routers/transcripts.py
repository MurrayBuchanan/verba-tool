from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.schemas.models import Transcript, TranscriptSegment
from app.core.config import API_TOKEN

router = APIRouter(prefix="/transcripts", tags=["transcripts"])

# Helper to unmarshall the transcript from the database to a dictionary
def get_metric(transcript, feature):
    value = getattr(transcript, feature, None)
    if value:
        return json.loads(value)
    else:
        return {}


# Endpoint to get all transcripts for a user
@router.get("/{user_id}")
async def get_transcripts(user_id: int, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:

    # Verify API token
    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        # Get all transcripts for the user by transcript_id descending 
        transcripts = await db.execute(select(Transcript).filter(Transcript.user_id == user_id).order_by(desc(Transcript.transcript_id)))
        transcripts = transcripts.scalars().all()
        
        # Convert transcripts to list of dictionaries
        transcript_list = []
        for transcript in transcripts:
            transcript_list.append({
                "transcript_id": transcript.transcript_id,
                "user_id": transcript.user_id,
                "total_duration": transcript.total_duration,
                "wpm_per_speaker": get_metric(transcript, "wpm_per_speaker"),
                "mean_utterance_length": get_metric(transcript, "mean_utterance_length"),
                "avg_word_length": get_metric(transcript, "avg_word_length"),
                "adverb_ratio": get_metric(transcript, "adverb_ratio"),
                "flesch_kincaid": get_metric(transcript, "flesch_kincaid"),
                "prp_ratio": get_metric(transcript, "prp_ratio"),
                "num_unique_words": get_metric(transcript, "num_unique_words"),
                "impoverished_vocabulary": get_metric(transcript, "impoverished_vocabulary"),
                "word_finding_difficulties": get_metric(transcript, "word_finding_difficulties"),
                "semantic_paraphasias": get_metric(transcript, "semantic_paraphasias"),
                "syntactic_simplification": get_metric(transcript, "syntactic_simplification"),
                "discourse_impairment": get_metric(transcript, "discourse_impairment"),
                "db_id": transcript.id
            })
        
        return JSONResponse(content={"transcripts": transcript_list})
    except Exception as error:
        raise HTTPException(status_code=500, detail="Error while fetching transcripts")

# Endpoint to get a specific transcript with segments
@router.get("/{user_id}/{transcript_id}")
async def get_transcript(user_id: int, transcript_id: int, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    
    # Verify API token
    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        # Get the transcript
        transcript = await db.execute(select(Transcript).filter(Transcript.user_id == user_id, Transcript.transcript_id == transcript_id))
        transcript = transcript.scalar_one_or_none()
        
        # Checks if transcript exists
        if transcript is None:
            raise HTTPException(status_code=404, detail="Transcript not found")
        
        # Get all segments for transcript in order of what came first
        segments = await db.execute(select(TranscriptSegment).filter(TranscriptSegment.transcript_feature_id == transcript.id).order_by(TranscriptSegment.offset))
        segments = segments.scalars().all()
        
        # Combines the individual segments into a list of segments
        transcript_segments = []
        for segment in segments:
            transcript_segments.append({
                "duration": segment.duration,
                "offset": segment.offset,
                "speaker": segment.speaker,
                "text": segment.text
            })
        
        return JSONResponse(content={
            "transcript_id": transcript.transcript_id,
            "user_id": transcript.user_id,
            "total_duration": transcript.total_duration,
            "segments": transcript_segments
        })
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error while fetching transcript")