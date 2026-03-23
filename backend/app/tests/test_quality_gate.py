from app.services.quality_gate import check_quality_gate
from app.structures.schemas import Transcript, TranscriptSegment

"""
Tests for upload quality gate (duration and speech detection).

Run using: python -m pytest app/tests/test_quality_gate.py
"""

def create_transcript(total_duration=None, raw_segments=None):
    return Transcript(
        words_per_minute={},
        average_word_length={},
        adverb_ratio={},
        flesch_kincaid_grade={},
        personal_pronoun_ratio={},
        number_of_unique_words={},
        impoverished_vocabulary={},
        word_finding_difficulties={},
        semantic_paraphasias={},
        syntactic_simplification={},
        discourse_impairment={},
        total_duration=total_duration,
        raw_segments=raw_segments,
    )

def create_segment(text, duration = 0.0, speaker = None, offset = 0.0):
    return TranscriptSegment(
        speaker=speaker or "",
        text=text,
        duration=duration,
        offset=offset
    )

def test_when_audio_is_within_duration_limit():
    transcript = create_transcript(
        total_duration=30.0,
        raw_segments=[create_segment("This must be a pretty slow sentence!", duration = 30.0)],
    )
    assert check_quality_gate(transcript) is None

def test_when_audio_is_at_the_duration_limit():
    transcript = create_transcript(
        total_duration=1200.0,
        raw_segments=[create_segment("This must be a very very slow sentence!", duration = 1200.0)],
    )
    assert check_quality_gate(transcript) is None

def test_when_audio_exceeds_duration_limit():
    transcript = create_transcript(
        total_duration=1200.1,
        raw_segments=[create_segment("This must be a very very slow sentence!", duration = 1200.1)],
    )
    assert check_quality_gate(transcript) == "Audio must be less than 20 minutes."

def test_when_no_speech_is_detected():
    transcript = create_transcript(
        total_duration=4.2,
        raw_segments=[create_segment("", duration = 4.2)]
    )
    assert check_quality_gate(transcript) == "Could not detect speech in the audio."

def test_when_speech_is_detected():
    transcript = create_transcript(
        total_duration=4.2,
        raw_segments=[
            create_segment("Hello World!", duration = 1.2),
            create_segment("This is a test", duration = 3.0),
        ],
    )
    assert check_quality_gate(transcript) is None