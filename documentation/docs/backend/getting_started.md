---
sidebar_position: 2
---

# Getting Started

## Project Structure

- `app`
	- `app/main.py`: Entry point & DB config
	- `app/routers`
		- `app/routers/interventions.py`: CRUD API endpoints for interventions
		- `app/routers/profiles.py`: CRUD API endpoints for profiles
		- `app/routers/transcripts.py`: Transcripts create and delete endpoints
		- `app/routers/upload.py`: Audio processing (ASR and conversation analysis) endpoint
	- `app/core`
		- `app/core/config.py`: Configuration and environment variables
		- `app/core/database.py`: Database connection and session management
	- `app/services`
		- `app/services/audio_converter.py`: Adapter for Azure compatible format
		- `app/services/speech_service.py`: Manage Speech Service
		- `app/services/quality_gate.py`: Check audio quality
		- `app/services/nlp_features.py`: NLP feature extraction
		- `app/services/ai_features.py`: LLM feature extraction
		- `app/services/ai_feature_factory.py`: LLM Ensemble
		- `app/services/conversation_analytics.py`: Combines NLP and LLM features
	- `app/schemas`
		- `app/schemas/models.py`: SQLAlchemy database models
		- `app/schemas/schemas.py`: Pydantic schemas
	- `app/tests`
		- `...`
- `Dockerfile`: Docker configuration
- `requirements.txt`: Dependencies
- `...`

## Configuration

:::note
If you do not own an Azure account, you can request the original environment variable configurations by contacting the researcher.
:::

1. Create a `.env` file in the backend directory to store environment variables:

    ```bash
    # API Configuration
    API_TOKEN=

    # Azure Speech Service
    SPEECH_KEY=
    SPEECH_REGION=

    # Azure OpenAI
    OPENAI_API_KEY=
    OPENAI_ENDPOINT=
    OPENAI_MODEL=
    OPENAI_VERSION=

    # PostgreSQL Database
    DATABASE_URL=
    ```

2. Create a virtual environment:
    - macOS/Linux: `python -m venv .venv`
    - Windows: `python -m venv .venv`
	
3. Activate the virtual environment:
    - macOS/Linux: `source .venv/bin/activate`
    - Windows: `.venv\Scripts\activate`
	
	To deactivate: `deactivate`

4. Install dependencies

    ```bash
    python -m pip install -r requirements.txt
    ```

5. Install PostgreSQL
    ```bash
    brew install postgresql@18
    ```

6. Create database 
    ```bash
    createdb CS408_postgres
    ```

## How to run
1. Run the application
    ```bash
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```

## How to test
1. Run the tests
    ```bash
    python -m pytest
    ```