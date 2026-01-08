# Backend Documentation

## Description

Content coming soon...

### Feature Extraction

Feature selection is derived from Research Paper by the [University of Zurich](https://aclanthology.org/2025.coling-main.126.pdf)

**Established Features**
- words per minute
- mean utterance length
- avg word length
- adverb ratio
- flesch kincaid
- prp ratio
- number of unique words

**Established Features**

- impoverished vocabulary
- word finding difficulty
- semantic paraphasias
- syntactic simplification
- discourse impairment


## Project Structure

- `app`
	- `app/__init__.py`
	- `app/main.py`: Entry point
	- `app/api`
		- `...`: TODO: Separate endpoints
	- `app/core`
		- `app/core/__init__.py`
		- `app/core/config.py`: Configuration and environment variables
		- `app/core/database.py`: Database connection and session management
	- `app/services`
		- `app/services/__init__.py`
		- `app/services/audio_converter.py`: Convert .mp3 to .wav
		- `app/services/speech_service.py`: Azure Speech Service
		- `app/services/nlp_feature_extraction.py`: NLP feature extraction
		- `app/services/ai_feature_extraction.py`: AI feature extraction
		- `app/services/conversation_analytics.py`: Combines features
	- `app/schemas`
		- `app/schemas/__ini1. Run the applicationt__.py`
		- `app/schemas/models.py`: SQLAlchemy database models
		- `app/schemas/schemas.py`: Pydantic schemas
	- `app/tests`
		- `app/tests/sample-data.m4a`: Sample audio file
		- `app/tests/sample-transcript.json`: Sample transcript data

- `Dockerfile`: Docker container configuration
- `requirements.txt`: Python dependencies
- `...`

## Configuration

1. Create `.env file` in the backend directory to store environment variables:

	> [!NOTE]  
	> I can privately share these with you via email on request.

	**API Configuration**
	<br>API_TOKEN=

	**Azure Speech Service**
	<br>SPEECH_KEY=
	<br>SPEECH_REGION=

	**Azure OpenAI**
	<br>OPENAI_API_KEY=
	<br>OPENAI_ENDPOINT=
	<br>OPENAI_MODEL=
	<br>OPENAI_VERSION=

	**PostgreSQL Database**
	<br>DATABASE_USER=
	<br>DATABASE_PASSWORD=
	<br>DATABASE_HOST=localhost
	<br>DATABASE_PORT=5432
	<br>DATABASE_NAME=

2. Create virutal environment
	<br>macOs/Linux: `python -m venv .venv`
	<br>Windows: `python -m venv`
	
3. Activate virtual environment 
	<br>macOS/Linux: `source .venv/bin/activate`
	<br>Windows: `venv\Scripts\activate`
	
	To deactivate: `deactivate`

4. Install dependancies 
	```bash
	python -m pip install -r requirements.txt
	```

5. Install PostgreSQL
    ```bash
    brew install postgresql@14
    ```

6. Create database 
	```bash
	createdb CS408_postgres
	```

## How to run
1. Run the application
	```bash
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
	```

2. To be deleted <br>
	**MUST REMEMBER TO CHANGE TEMP TOKEN**
	```bash
	curl -X POST "http://127.0.0.1:8001/upload-audio" \
 		-H "Authorization: Bearer CS408_SECRET_API_TOKEN" \
 		-H "User-ID: 1" \
 		-F "file=@app/tests/sample-data.m4a;type=audio/mp4"
	```
