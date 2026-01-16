from typing import TypedDict, List, Dict, Any

Feature = Dict[str, Any]

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