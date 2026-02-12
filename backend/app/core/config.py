import os
from dotenv import load_dotenv

# Separates environment variables from source code
load_dotenv()

# API auth
API_TOKEN = os.getenv("API_TOKEN")

# Azure Speech Service config
SPEECH_KEY = os.getenv("SPEECH_KEY")
SPEECH_REGION = os.getenv("SPEECH_REGION")

# Azure OpenAI config
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_ENDPOINT = os.getenv("OPENAI_ENDPOINT")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")
OPENAI_VERSION = os.getenv("OPENAI_VERSION")

# PostgreSQL DB config
DATABASE_URL = os.getenv("DATABASE_URL")