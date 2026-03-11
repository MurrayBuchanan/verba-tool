import time
from typing import List
import azure.cognitiveservices.speech as speechsdk
from app.structures.schemas import TranscriptSegment

"""
Azure Speech Service for speaker diarisation and transcription
Adapted from: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-use-conversation-transcription?pivots=programming-language-python
"""

class SpeechService:
    def __init__(self, speech_key: str, speech_region: str) -> None:
        if not speech_key or not speech_region:
            raise ValueError("Error: Azure Speech key and region are not set.")

        self.speech_key = speech_key
        self.speech_region = speech_region

    # Transcribe and perform speaker diarisation on audio file using the Azure Speech Service API
    def diarise_audio(self, file_path: str) -> List[TranscriptSegment]:
        speech_config = speechsdk.SpeechConfig(subscription = self.speech_key, region = self.speech_region)

        speech_config.speech_recognition_language = "en-GB"
        
        # Enable speaker diarisation to label each speaker
        speech_config.set_property(speechsdk.PropertyId.SpeechServiceResponse_DiarizeIntermediateResults, "true")

        # Enable timestamps
        speech_config.set_property(speechsdk.PropertyId.SpeechServiceResponse_RequestWordLevelTimestamps, "true")

        audio_config = speechsdk.audio.AudioConfig(filename = file_path)

        # Conversation transcriber for diarisation and transcription
        conversation_transcriber = speechsdk.transcription.ConversationTranscriber(speech_config = speech_config, audio_config = audio_config)

        segments: List[TranscriptSegment] = []
        transcribing_stop = False

        # Extracts speaker, text, offset, and duration from transcription
        def conversation_transcriber_transcribed_cb(evt: speechsdk.SpeechRecognitionEventArgs):
            result = evt.result
            # Only add segments if there is text
            if result and result.text:
                segments.append(TranscriptSegment(
                    speaker = result.speaker_id,
                    text = result.text,
                    offset = result.offset / 10_000_000, # Convert to seconds
                    duration = result.duration / 10_000_000, # Convert to seconds
                ))

        # Event handler for stopping session
        def conversation_transcriber_session_stopped_cb(_evt):
            nonlocal transcribing_stop
            print("ConversationTranscriber session stopped.")
            transcribing_stop = True

        # Event handler for cancelling session
        def conversation_transcriber_cancelled_cb(evt):
            nonlocal transcribing_stop
            print("ConversationTranscriber cancelled: ", evt.reason)
            transcribing_stop = True

        # Connect callbacks to events triggered by the conversation transcriber
        conversation_transcriber.transcribed.connect(conversation_transcriber_transcribed_cb)
        conversation_transcriber.session_stopped.connect(conversation_transcriber_session_stopped_cb)
        conversation_transcriber.canceled.connect(conversation_transcriber_cancelled_cb)

        conversation_transcriber.start_transcribing_async().get()

        # Wait for the transcribing session to end
        while not transcribing_stop:
            time.sleep(0.5)
        conversation_transcriber.stop_transcribing_async().get()

        return segments