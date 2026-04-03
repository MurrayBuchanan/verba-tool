---
sidebar_position: 5
---

# AI Features

Feature extraction is performed in two separate pipelines before being aggregated into a single model.

AI-derived features are calculated independently for each speaker using Azure OpenAI. For each speaker, the model assigns an integer severity score from 1 (no impairment) to 7 (severe impairment).

## Feature Groupings

The LLM produces output `Feature` (`Dict[str, Any]`).

All AI feature fields follow the same shape:
- each field value is a `Dict[str, Any]`
- keys are speaker ids (e.g., `"Speaker-1"`)
- values are integer scores between `1-7`

## Features

There are 5 AI-derived feature indicators:
- `impoverished_vocabulary`
- `word_finding_difficulties`
- `semantic_paraphasias`
- `syntactic_simplification`
- `discourse_impairment`

Additional features can be added by updating the system prompt and its dependencies.

### Input
- `segments: List[TranscriptSegment]`
  - used by `extract_features(...)` to produce per-speaker integer scores
### Output
- `AIFeatures`
  - each field (e.g., `impoverished_vocabulary`) is a `Feature` mapping:
    - `{ "<speaker>": 1..7, ... }`
  - all values come from the median/rounding aggregation across the 3 runs


### Ensemble

A median aggregation ensemble is used to run the AI feature extraction multiple times, aggregating the results to reduce variance in scoring.

The ensemble size can be modified in the ```ai_feature_factory.py```.
- Calls `extract_features(segments)` `x` times in parallel
- Collects the resulting `AIFeatures` objects
- For each AI metric field in `AIFeatures` (i.e., for each key in `AIFeatures.model_fields`), it aggregates per speaker:
- Calculates the median of the runs

## Example Usage

A single run: `ai_features = extract_features(segments)`

An ensemble: `extract_features_factory(segments)` 