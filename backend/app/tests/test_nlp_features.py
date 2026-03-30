import pytest
from app.services import nlp_features as extract_nlp_features
from app.structures.schemas import TranscriptSegment

"""
Tests for all established NLP features

Run using: python -m pytest app/tests/test_nlp_features.py
"""

# Helpers
def create_segment(text, duration = 0.0, speaker = None, offset = 0.0):
    return TranscriptSegment(
        speaker=speaker or "",
        text=text,
        duration=duration,
        offset=offset
    )

def test_count_words():
    assert extract_nlp_features._count_words("heLLo World!") == 2
    assert extract_nlp_features._count_words(" m  u   r r ") == 4
    assert extract_nlp_features._count_words("") == 0
    assert extract_nlp_features._count_words(None) == 0

# Words per minute
def test_calculate_wpm_null():
    segments = [create_segment("", duration=0.0)]
    assert extract_nlp_features.calculate_wpm(segments) == 0.0

def test_calculate_wpm():
    segments = [
        create_segment("Hello there, what do you", duration = 6.0),
        create_segment("want for breakfast?", duration = 5.0)
    ]
    assert extract_nlp_features.calculate_wpm(segments) == pytest.approx(43, 1)

def test_wpm_per_speaker():
    segments = [
        create_segment("Did you have a good day today?", duration = 8.0, speaker="Speaker-1"),
        create_segment("I had an incredible day today, I went out for coffee 4 times!", duration = 12.4, speaker="Speaker-2")
    ]
    wpm = extract_nlp_features.wpm_per_speaker(segments)
    assert wpm["Speaker-1"] == pytest.approx(38, 1)
    assert wpm["Speaker-2"] == pytest.approx(43, 1)

# Average word length
def test_calculate_avg_word_length_null():
    segments = [create_segment("", duration = 0.0)]
    assert extract_nlp_features.calculate_avg_word_length(segments) == 0.0

def test_calculate_avg_word_length():
    segments = [
        create_segment("Hello there, what do you", duration = 6.0),
        create_segment("want for breakfast?", duration = 5.0)
    ]
    assert extract_nlp_features.calculate_avg_word_length(segments) == pytest.approx(4.3, 1)

def test_avg_word_length_per_speaker():
    segments = [
        create_segment("Hello there, what do you", duration = 6.0, speaker="Speaker-1"),
        create_segment("want for breakfast?", duration = 5.0, speaker="Speaker-2")
    ]
    avg_word_length = extract_nlp_features.avg_word_length_per_speaker(segments)
    assert avg_word_length["Speaker-1"] == pytest.approx(4.3, 1)
    assert avg_word_length["Speaker-2"] == pytest.approx(4.3, 1)

# Adverb ratio
def test_calculate_adverb_ratio_null():
    segments = [create_segment("", duration = 0.0)]
    assert extract_nlp_features.calculate_adverb_ratio(segments) == 0.0

def test_calculate_adverb_ratio():
    segments = [
        create_segment("Hello there, what do you", duration = 6.0),
        create_segment("want for breakfast?", duration = 5.0)
    ]
    assert extract_nlp_features.calculate_adverb_ratio(segments) == pytest.approx(0.125, 0.1)

def test_adverb_ratio_per_speaker():
    segments = [
        create_segment("Hello there, what do you", duration = 6.0, speaker="Speaker-1"),
        create_segment("What do you...?", duration = 5.0, speaker="Speaker-2")
    ]
    adverb_ratio = extract_nlp_features.adverb_ratio_per_speaker(segments)
    assert adverb_ratio["Speaker-1"] == pytest.approx(0.2, 0.1)
    assert adverb_ratio["Speaker-2"] == pytest.approx(0.0, 0)

# Flesch-Kincaid Grade
# Reference: https://quanteda.io/reference/textstat_readability.html
def test_calculate_flesch_kincaid_null():
    segments = [create_segment("", duration = 0.0)]
    assert extract_nlp_features.calculate_flesch_kincaid(segments) == 0.0

def test_calculate_flesch_kincaid():
    segments = [
        create_segment("Today was an incredible day.", duration = 3.0),
        create_segment("I went to the store and bought three books.", duration = 4.0)
    ]
    grade = extract_nlp_features.calculate_flesch_kincaid(segments)
    assert grade == pytest.approx(2.5, 0.1)

def test_flesch_kincaid_per_speaker():
    segments = [
        create_segment("Describe what you see in this picture.", duration = 4.0, speaker = "Speaker-1"),
        create_segment("I see a woman washing the dishes, where the sink is overflowing.", duration = 8.0, speaker = "Speaker-2"),
        create_segment("There are two children in the background, reaching for a cookie.", duration = 6.0, speaker = "Speaker-2")
    ]
    flesch_kincaid_grade = extract_nlp_features.flesch_kincaid_per_speaker(segments)
    assert flesch_kincaid_grade["Speaker-1"] == pytest.approx(2.5, 0)
    assert flesch_kincaid_grade["Speaker-2"] == pytest.approx(5.4, 0)

# Personal pronoun ratio
def test_calculate_prp_ratio_null():
    segments = [create_segment("", duration = 0.0)]
    assert extract_nlp_features.calculate_prp_ratio(segments) == 0.0

def test_calculate_prp_ratio():
    segments = [
        create_segment("Today was a semi-productive day, I really enjoyed it.", duration = 6.0)
    ]
    prp_ratio = extract_nlp_features.calculate_prp_ratio(segments)
    assert prp_ratio == 0.5

def test_prp_ratio_per_speaker():
    segments = [
        create_segment("Describe what you see in this picture.", duration = 1.0, speaker = "Speaker-1"),
        create_segment("I see a woman washing the dishes, where the sink is overflowing.", duration = 1.0, speaker = "Speaker-2")
    ]
    prp_ratio = extract_nlp_features.prp_ratio_per_speaker(segments)
    assert prp_ratio["Speaker-1"] == 0.67
    assert prp_ratio["Speaker-2"] == 0.25

# Number of unique words
def test_calculate_n_unique_words_null():
    segments = [create_segment("", duration = 0.0)]
    assert extract_nlp_features.calculate_n_unique_words(segments) == 0

def test_calculate_n_unique_words():
    segments = [
        create_segment("There is an overflowing sink in the kitchen.", duration = 4.0)
    ]
    assert extract_nlp_features.calculate_n_unique_words(segments) == 8

def test_n_unique_words_per_speaker():
    segments = [
        create_segment("Describe what you see in this picture.", duration = 3.0, speaker = "Speaker-1"),
        create_segment("I see a woman washing the dishes, where the sink is overflowing.", duration = 8.0, speaker = "Speaker-2"),
        create_segment("There are two children in the background, reaching for a cookie.", duration = 7.0, speaker = "Speaker-2")
    ]
    n_unique_words = extract_nlp_features.n_unique_words_per_speaker(segments)
    assert n_unique_words["Speaker-1"] == 7
    assert n_unique_words["Speaker-2"] == 20