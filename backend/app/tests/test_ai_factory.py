import pytest

from app.services.ai_feature_factory import extract_features_factory, _aggregate_metric
from app.structures.schemas import AIFeatures, TranscriptSegment

"""
Tests for the AI feature factory.

Run using: python -m pytest app/tests/test_ai_factory.py
"""

def create_segment(text, duration = 0.0, speaker = None, offset = 0.0):
    return TranscriptSegment(
        speaker=speaker or "",
        text=text,
        duration=duration,
        offset=offset
    )

def create_ai_features(**metric):
    fields = {
        "impoverished_vocabulary": {},
        "word_finding_difficulties": {},
        "semantic_paraphasias": {},
        "syntactic_simplification": {},
        "discourse_impairment": {},
    }
    fields.update(metric)
    return AIFeatures(**fields)

def test_aggregate_metric_median_of_fifteen_runs():
    runs = [
        create_ai_features(word_finding_difficulties={"Speaker-1": 3, "Speaker-2": 1}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 4, "Speaker-2": 2}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 2, "Speaker-2": 3}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 2, "Speaker-2": 4}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 5, "Speaker-2": 5}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 4, "Speaker-2": 6}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 3, "Speaker-2": 7}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 2, "Speaker-2": 1}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 3, "Speaker-2": 2}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 4, "Speaker-2": 3}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 2, "Speaker-2": 4}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 3, "Speaker-2": 5}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 4, "Speaker-2": 6}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 2, "Speaker-2": 7}),
        create_ai_features(word_finding_difficulties={"Speaker-1": 3, "Speaker-2": 1})
    ]
    aggregated_indicator = _aggregate_metric(runs, "word_finding_difficulties")
    assert aggregated_indicator["Speaker-1"] == 3
    assert aggregated_indicator["Speaker-2"] == 4


def test_aggregate_metric_median_of_three_runs():
    runs = [
        create_ai_features(impoverished_vocabulary={"Speaker-1": 2, "Speaker-2": 1}),
        create_ai_features(impoverished_vocabulary={"Speaker-1": 4, "Speaker-2": 3}),
        create_ai_features(impoverished_vocabulary={"Speaker-1": 6, "Speaker-2": 5})
    ]
    aggregated_indicator = _aggregate_metric(runs, "impoverished_vocabulary")
    assert aggregated_indicator["Speaker-1"] == 4
    assert aggregated_indicator["Speaker-2"] == 3

def test_aggregate_metric_single_run():
    runs = [create_ai_features(semantic_paraphasias={"Speaker-1": 4})]
    aggregated_indicator = _aggregate_metric(runs, "semantic_paraphasias")
    assert aggregated_indicator["Speaker-1"] == 4

def test_aggragate_metric_no_recording():
    runs = [create_ai_features(syntactic_simplification={})]
    aggregated_indicator = _aggregate_metric(runs, "syntactic_simplification")
    assert aggregated_indicator == {}