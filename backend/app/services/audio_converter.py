import subprocess

class AudioConverter:
    # Converts the uploaded audio to Speech Service compatible format (WAV 16kHz mono PCM)
    def convert_to_wav(self, input_path: str, output_path: str) -> None:
        ffmpeg_command = [
            "ffmpeg",
            "-y",
            "-i", input_path,
            "-ac", "1", # mono
            "-ar", "16000", 
            "-c:a", "pcm_s16le", # PCM
            output_path,
        ]

        subprocess.run(ffmpeg_command, check=True)

