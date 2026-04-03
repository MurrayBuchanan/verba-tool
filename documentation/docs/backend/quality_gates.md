---
sidebar_position: 3
---

# Quality Gates

The quality gate validates uploaded transcripts before the conversation is analysed.

## Validation Rules

`check_quality_gate(transcript)`:
- The audio is not longer than 20 minutes
- The transcript contains at least some detected speech

The function returns details on why the audio is not passing through.

### Additional Validation Rules 
These quality gates can be extended by adding additional checks. For example:
```python
error = check_quality_gate(transcript)
if error is not None:
    # Stop upload and return error
    ...
```
