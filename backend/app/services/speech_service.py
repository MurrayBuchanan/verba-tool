import time
from typing import List
import azure.cognitiveservices.speech as speechsdk
from app.schemas.schemas import TranscriptSegment

class SpeechService:
    def __init__(self, speech_key: str, speech_region: str) -> None:
        if not speech_key or not speech_region:
            raise ValueError("Error: Azure Speech key and region are not set.")

        self.speech_key = speech_key
        self.speech_region = speech_region

    # Transcribe and perform speaker diarisation on audio file using the Azure Speech Service API
    def diarise_audio(self, file_path: str) -> List[TranscriptSegment]:
        speech_config = speechsdk.SpeechConfig(subscription=self.speech_key, region=self.speech_region)
        speech_config.speech_recognition_language = "en-GB"

        # Enable speaker diarisation for per speaker transcriptions        
        speech_config.set_property(
            speechsdk.PropertyId.SpeechServiceResponse_DiarizeIntermediateResults,
            "true",
        )

        # Enable timestamps for each word in the transcript
        speech_config.set_property(
            speechsdk.PropertyId.SpeechServiceResponse_RequestWordLevelTimestamps,
            "true",
        )

        audio_config = speechsdk.audio.AudioConfig(filename=file_path)

        # Conversation transcriber for multi-speaker transcription
        conversation_transcriber = speechsdk.transcription.ConversationTranscriber(
            speech_config=speech_config,
            audio_config=audio_config,
        )

        segments: List[TranscriptSegment] = []
        transcribing_stop = False

        # Extracts speaker, text, offset, and duration from each successful transcribed event
        def conversation_transcriber_transcribed_cb(evt: speechsdk.SpeechRecognitionEventArgs):
            result = evt.result
            if result and result.text:
                segment = TranscriptSegment(
                    speaker=result.speaker_id,
                    text=result.text,
                    offset=result.offset / 10_000_000,
                    duration=result.duration / 10_000_000,
                )
                segments.append(segment)

        # Event handler for session stopped
        def conversation_transcriber_session_stopped_cb(_evt):
            nonlocal transcribing_stop
            print("ConversationTranscriber session stopped.")
            transcribing_stop = True

        # Event handler for cancelled event
        def conversation_transcriber_cancelled_cb(evt):
            nonlocal transcribing_stop
            print("ConversationTranscriber cancelled: ", evt.reason)
            transcribing_stop = True

        # Connect callbacks to events fired by the conversation transcriber
        conversation_transcriber.transcribed.connect(conversation_transcriber_transcribed_cb)
        conversation_transcriber.session_stopped.connect(conversation_transcriber_session_stopped_cb)
        conversation_transcriber.canceled.connect(conversation_transcriber_cancelled_cb)

        conversation_transcriber.start_transcribing_async().get()

        # Wait for the transcribing session to stop
        while not transcribing_stop:
            time.sleep(0.5)
        conversation_transcriber.stop_transcribing_async().get()

        return segments