import pytest
from app.services.nlp_features import NLPFeatureExtraction
from app.schemas.schemas import TranscriptSegment
from app.services.conversation_analytics import ConversationAnalytics

def create_segment(text, duration=0.0, speaker=None, offset=0.0):
    return TranscriptSegment(
        speaker=speaker or "",
        text=text,
        duration=duration,
        offset=offset,
    )

def test_count_words():
    nlp = NLPFeatureExtraction()
    assert nlp._count_words("heLLo World!") == 2
    assert nlp._count_words(" m  u   r r ") == 4
    assert nlp._count_words("") == 0
    assert nlp._count_words(None) == 0


def test_calculate_wpm_null():
    nlp = NLPFeatureExtraction()
    segments = [create_segment("one two", duration=0.0)]
    assert nlp.calculate_wpm(segments) == 0.0

def test_calculate_wpm():
    nlp = NLPFeatureExtraction()
    segments = [
        create_segment("Hello there, what do you", duration=6.0),
        create_segment("want for breakfast?", duration=5.0),
    ]
    assert nlp.calculate_wpm(segments) == pytest.approx(43, 1)

def test_wpm_per_speaker():
    nlp = NLPFeatureExtraction()
    analytics = ConversationAnalytics()
    segments = [
        create_segment("Did you have a good day today?", duration=8.0, speaker="Speaker-1"),
        create_segment("I had an incredible day today, I went out for coffee 4 times!", duration=12.4, speaker="Speaker-2"),
    ]
    result = nlp.wpm_per_speaker(segments, analytics._group_by_speaker)
    assert result == {"Speaker-1": pytest.approx(38, 1), "Speaker-2": pytest.approx(43, 1)}