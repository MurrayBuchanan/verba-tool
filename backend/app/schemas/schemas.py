from typing import List, Dict, Any, Optional
from datetime import date
from pydantic import BaseModel

Feature = Dict[str, Any]

class Profile(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None

class TranscriptSegment(BaseModel):
    speaker: str
    text: str
    duration: float
    offset: float

class NLPFeatures(BaseModel):
    wpm_per_speaker: Feature
    avg_word_length: Feature
    adverb_ratio: Feature
    flesch_kincaid: Feature
    prp_ratio: Feature
    num_unique_words: Feature

class AIFeatures(BaseModel):
    impoverished_vocabulary: Feature
    word_finding_difficulties: Feature
    semantic_paraphasias: Feature
    syntactic_simplification: Feature
    discourse_impairment: Feature

class Transcript(NLPFeatures, AIFeatures):
    total_duration: Optional[float] = None
    raw_segments: Optional[List[TranscriptSegment]] = None

class Intervention(BaseModel):
    id: Optional[int] = None
    profile_id: int
    name: str
    description: Optional[str] = None
    goals: Optional[str] = None
    success: bool = False
    start_date: date
    end_date: date