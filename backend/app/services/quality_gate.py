from typing import Optional
from app.structures.schemas import Transcript

"""
Quality gate to ensure the audio is long enough and has enough text to analyse
"""

def check_quality_gate(transcript: Transcript) -> Optional[str]:
    duration = transcript.total_duration
    if duration > 600:
        return "Audio must be less than 10 minutes."

    segments = transcript.raw_segments
    contains_words = False
    for segment in segments:
        if segment.text:
            contains_words = True
            break
    if not contains_words:
        return "Could not detect speech in the audio."

    return None