---
sidebar_position: 4
---

# NLP Features

Feature extraction is performed in two separate pipelines before being aggregated into a single model.

NLP-derived features are calculated independently for each speaker to ensure indicators reflect individual language patterns rather than the conversation as a whole.

## Speaker Groupings

The NLP feature extractor groups transcript segments by `speaker` before computing each indicator.

## Feature Groupings

All `*_per_speaker(...)` methods return:
- `Dict[str, Any]` where the keys are speaker ids (e.g., `"Speaker-1"`)
- the values are speaker-separated indicator values

For float indicators, the per-speaker values are rounded to 2 decimal places.

## Features

There are 6 NLP-derived feature methods currently:

- `wpm_per_speaker()`
- `avg_word_length_per_speaker()`
- `adverb_ratio_per_speaker()`
- `flesch_kincaid_per_speaker()`
- `pronoun_ratio_per_speaker()`
- `n_unique_words_per_speaker()`

## Example Usage

Using grouped speaker segments, individual features can be extracted from the segments.

```python
nlp = NLPFeatureExtraction()
wpm = nlp.wpm_per_speaker(segments)