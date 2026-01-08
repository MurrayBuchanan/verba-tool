from typing import TypedDict, List, Dict, Any

class Segment(TypedDict):
    speaker: str
    text: str
    duration: float
    offset: float

class RawSegments(TypedDict):
    raw_segments: List[Segment]

SpeakerMetric = Dict[str, Any]

class AIFeatures(TypedDict):
    impoverished_vocabulary: SpeakerMetric
    word_finding_difficulties: SpeakerMetric
    semantic_paraphasias: SpeakerMetric
    syntactic_simplification: SpeakerMetric
    discourse_impairment: SpeakerMetric

class EstablishedFeatures(TypedDict):
    wpm_per_speaker: SpeakerMetric
    mean_utterance_length_per_speaker: SpeakerMetric
    avg_word_length: SpeakerMetric
    adverb_ratio: SpeakerMetric
    flesch_kincaid: SpeakerMetric
    prp_ratio: SpeakerMetric
    num_unique_words: SpeakerMetric

class ConversationAnalysisResult(AIFeatures, EstablishedFeatures, TypedDict, total=False):
    # Result combining AI and established features
    raw_segments: List[Segment]
    turns: SpeakerMetric