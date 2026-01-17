from typing import TypedDict, List, Dict, Any, Optional
from datetime import date

Feature = Dict[str, Any]

# TODO: Change to pydantic models

class TranscriptSegment(TypedDict):
    speaker: str
    text: str
    duration: float
    offset: float

class AIFeatures(TypedDict):
    impoverished_vocabulary: Feature
    word_finding_difficulties: Feature
    semantic_paraphasias: Feature
    syntactic_simplification: Feature
    discourse_impairment: Feature

class NLPFeatures(TypedDict):
    wpm_per_speaker: Feature
    mean_utterance_length_per_speaker: Feature
    avg_word_length: Feature
    adverb_ratio: Feature
    flesch_kincaid: Feature
    prp_ratio: Feature
    num_unique_words: Feature

class CAResult(AIFeatures, NLPFeatures, TypedDict, total=False):
    raw_segments: List[TranscriptSegment]
    turns: Feature

class Intervention(TypedDict, total=False):
    id: int
    name: str
    description: Optional[str]
    start_date: date
    end_date: date