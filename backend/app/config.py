import os
from dotenv import load_dotenv

# TODO: Change to use azure key vault
load_dotenv()

API_TOKEN = os.getenv("API_TOKEN")
SPEECH_KEY = os.getenv("SPEECH_KEY")
SPEECH_REGION = os.getenv("SPEECH_REGION")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_ENDPOINT = os.getenv("OPENAI_ENDPOINT")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")
OPENAI_VERSION = os.getenv("OPENAI_VERSION")