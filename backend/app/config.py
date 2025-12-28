import os
from dotenv import load_dotenv

# TODO: Change to use azure key vault
load_dotenv()

API_TOKEN = os.getenv("API_TOKEN", "CS408_IS_AWESOME")
SPEECH_KEY = os.getenv("SPEECH_KEY")
SPEECH_REGION = os.getenv("SPEECH_REGION")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_ENDPOINT = os.getenv("OPENAI_ENDPOINT")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
OPENAI_API_VERSION = os.getenv("OPENAI_API_VERSION", "2024-12-01-preview")