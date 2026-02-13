from typing import Optional
from app.schemas.schemas import Transcript

# Ensures the audio is long enough, and has enough text segments to analyse
def check_quality_gates(transcript: Transcript) -> Optional[str]:
    duration = transcript.total_duration
    if duration < 60:
        return "Audio must be at least 1 minute."

    segments = transcript.raw_segments
    has_text = False
    for segment in segments:
        if segment.text:
            has_text = True
            break
    if not has_text:
        return "Could not detect speech in the audio."

    return None