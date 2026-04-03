---
sidebar_position: 3
---

# Automatic Speech Recognition

The system uses Azure Speech Service's real-time transcription for transcribing and speaker diarisation for the audio recording. This ensures no data is retained by any third-party service.

## Upload
The `upload` endpoint receives the audio recording, time of recording, profile, user and authorisation key. This then sends the audio to the audio converter to ensure the audio recording is compatible with Azure Speech Service.

**Required Format:**
- WAV format
- 16kHz sample rate
- Mono/single channel
- 16-bit PCM encoding

### Response
Once processed, this provides a transcript in the following format.
```json
[
  {
    "speaker": "",
    "text": "",
    "duration": 0.0,
    "offset": 0.0
  }
]
```