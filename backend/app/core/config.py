import os
from dotenv import load_dotenv

"""
Separates environment variables from source code
"""

load_dotenv()

# API Authentication
API_TOKEN = os.getenv("API_TOKEN")

# Azure Speech Service Configuration
SPEECH_KEY = os.getenv("SPEECH_KEY")
SPEECH_REGION = os.getenv("SPEECH_REGION")

# Azure OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_ENDPOINT = os.getenv("OPENAI_ENDPOINT")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")
OPENAI_VERSION = os.getenv("OPENAI_VERSION")

# PostgreSQL Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL")

# Local uploads (profile pictures served under /static/...)
UPLOADS_ROOT = os.getenv("UPLOADS_ROOT", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"))