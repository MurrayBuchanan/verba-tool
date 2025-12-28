from pydantic import BaseModel
from typing import List

class Segment(BaseModel):
    duration: float
    offset: float
    speaker: str
    text: str
    role: str = "" # Add role when mapping speakers

class TranscriptAnalysis(BaseModel):
    number_of_turns: int
    raw_segments: List[Segment]
    wpm_per_speaker: dict = {}
    mean_utterance_length: dict = {}