from concurrent.futures import ThreadPoolExecutor, as_completed
from statistics import median
from typing import List
from app.structures.schemas import TranscriptSegment, AIFeatures
from app.services.ai_features import extract_features

"""
Median aggregation of 3 LLMs to extract features from a transcript
"""

def _aggregate_metric(runs: List[AIFeatures], metric: str) -> dict:
    # Get scores for each speaker from a run
    speakers = set()
    for run in runs:
        scores = getattr(run, metric, {})
        if scores:
            speakers.update(scores.keys())

    # Find the median score over all runs
    median_scores = {}
    for speaker in speakers:
        scores = []
        for run in runs:
            score = getattr(run, metric, {}).get(speaker)
            if score is not None:
                scores.append(float(score))
        if scores:
            median_scores[speaker] = int(round(median(scores)))
        else:
            median_scores[speaker] = 1
    return median_scores

# Runs the feature extraction 3 times and aggregates the results
def extract_features_factory(segments: List[TranscriptSegment]) -> AIFeatures:
    results = []

    with ThreadPoolExecutor(max_workers=5) as executor: # 5 significant improvement > 1
        future_to_run = {executor.submit(extract_features, segments): n for n in range(3)}
        for future in as_completed(future_to_run):
            try:
                results.append(future.result())
            except Exception:
                pass
            
    aggregated_scores = {}
    for metric in AIFeatures.model_fields:
        aggregated_scores[metric] = _aggregate_metric(results, metric)

    return AIFeatures.model_validate(aggregated_scores)