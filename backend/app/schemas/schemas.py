from typing import List, Dict, Any, Optional
from datetime import date
from pydantic import BaseModel

Feature = Dict[str, Any]

class TranscriptSegment(BaseModel):
    speaker: str
    text: str
    duration: float
    offset: float

class AIFeatures(BaseModel):
    impoverished_vocabulary: Feature
    word_finding_difficulties: Feature
    semantic_paraphasias: Feature
    syntactic_simplification: Feature
    discourse_impairment: Feature

class NLPFeatures(BaseModel):
    wpm_per_speaker: Feature
    mean_utterance_length_per_speaker: Feature
    avg_word_length: Feature
    adverb_ratio: Feature
    flesch_kincaid: Feature
    prp_ratio: Feature
    num_unique_words: Feature

class Transcript(AIFeatures, NLPFeatures):
    raw_segments: Optional[List[TranscriptSegment]] = None
    turns: Optional[Feature] = None

class Intervention(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date