from fastapi import FastAPI, File, UploadFile, Header, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, Any
import os

from .config import API_TOKEN, SPEECH_KEY, SPEECH_REGION
from .audio_converter import AudioConverter
from .speech_service import SpeechService
from .conversation_analytics import ConversationAnalytics

app = FastAPI()

audio_converter = AudioConverter()
speech_service = SpeechService(SPEECH_KEY, SPEECH_REGION)
conversation_analytics = ConversationAnalytics()

# Endpoint to upload audio for diarization and analytics
@app.post("/upload-audio")
async def upload_audio(authorization: str = Header(..., alias="Authorization"), file: UploadFile = File(...)) -> JSONResponse:
    # Token-based authentication
    expected = f"Bearer {API_TOKEN}"
    if authorization != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Must upload an audio file")

    temp_input = "/tmp/input.m4a"
    temp_wav = "/tmp/output.wav"

    # Save uploaded file to temp location
    try:
        contents = await file.read()
        with open(temp_input, "wb") as temp_file:
            temp_file.write(contents)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save audio: {str(error)}",
        )

    try:
        # Convert, diarize, and analyse
        audio_converter.convert_to_wav(temp_input, temp_wav)
        segments = speech_service.diarize_audio(temp_wav)
        analytics: Dict[str, Any] = conversation_analytics.analyse(segments)
        return JSONResponse(content=analytics)
    except Exception as error:
        raise HTTPException(status_code=500, detail="Audio processing failed")
    finally:
        # Clean up temp files
        for path in (temp_input, temp_wav):
            try:
                if os.path.exists(path):
                    os.remove(path)
            except Exception:
                pass