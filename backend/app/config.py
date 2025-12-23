import os
from dotenv import load_dotenv

# TODO: Change to use azure key vault
load_dotenv()

API_TOKEN = os.getenv("API_TOKEN", "CS408_IS_AWESOME")
SPEECH_KEY = os.getenv("SPEECH_KEY")
SPEECH_REGION = os.getenv("SPEECH_REGION")