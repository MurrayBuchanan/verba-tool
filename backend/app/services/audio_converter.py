import ffmpeg

class AudioConverter:
    # Makes the audio compatible with Azure Speech Service
    # Since different devices record audio at different sample rates
    # ffmpeg repository: https://github.com/kkroening/ffmpeg-python

    # Expected format:
    # - WAV file
    # - 16kHz sample rate
    # - Mono/single channel
    # - 16-bit PCM encoding

    def convert_to_wav(self, inputPath: str, outputPath: str) -> None:
        (
            ffmpeg
            .input(inputPath)
            .output(
                outputPath,
                ac=1,
                ar=16000,
                acodec='pcm_s16le'
            )
            .overwrite_output() # Overwrite output
            .run(quiet=True) # Run and catch exceptions
        )