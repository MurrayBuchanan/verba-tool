# Backend Documentation

## How to run

Create (once): ```python -m venv .venv```
Activate: ```source .venv/bin/activate```
Deactivate: ```deactivate```

### Database Setup

Install PostgreSQL (once) ```brew install postgresql@14```

Create database ```createdb CS408_postgres```

Install dependancies ```python -m pip install -r requirements.txt```

Run backend ```uvicorn app.main:app --reload --host 0.0.0.0 --port 8001```

**MUST REMEMBER TO CHANGE TEMP TOKEN**
curl -X POST "http://127.0.0.1:8001/upload-audio" \
  -H "Authorization: Bearer CS408_SECRET_API_TOKEN" \
  -H "User-ID: 1" \
  -F "file=@app/tests/sample-data.m4a;type=audio/mp4"

## How to deploy

Enter this later without exposing environment variables


## Feature Extraction

Feature selection is derived from Research Paper by the [University of Zurich](https://aclanthology.org/2025.coling-main.126.pdf)

### Established Features
- words per minute
- mean utterance length
- avg word length
- adverb ratio
- flesch kincaid
- prp ratio
- number of unique words

### AI Features
- impoverished vocabulary
- word finding difficulty
- semantic paraphasias
- syntactic simplification
- discourse impairment
