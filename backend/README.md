# Backend Documentation

## How to run

Create (once): ```python3 -m venv .venv```
Activate: ```source .venv/bin/activate```
Deactivate: ```deactivate```

### Database Setup

Install PostgreSQL (once) ```brew install postgresql@14```

Create database ```createdb CS408_postgres```

### Install dependancies
python -m pip install -r requirements.txt

```uvicorn app.main:app --reload```

**MUST REMEMBER TO CHANGE TEMP TOKEN**
curl -X POST "http://127.0.0.1:8001/upload-audio" \
  -H "Authorization: Bearer CS408_SECRET_API_TOKEN" \
  -H "User-ID: 1" \
  -F "file=@app/tests/sample-data.m4a;type=audio/mp4"

## How to deploy

Enter this later without exposing environment variables

## Quality Gate
Filter to determine if the transcript session should be scorted or not.
- Minimum speech lenght 2 minutes
- Minimum word count 150

## Feature Extraction

### NLP
- Words per minute: Total words / speaking minute
- Mean Utterance length: Total words / turn
- Disfluency/repair rate: Number of self-repairs
- Type-token ratio: Unique word types / total words (on a fixed window size)
- Content word ratio: (nouns + verbs + adjectives + adverbs) / total words
- Pronoun ratio: Pronouns / (pronouns + nouns)
- Repetition rate: Count of duplicate words / ...

### AI
- Coherance score (rubic)
- Information
- Topic maintenance

### Extra
- Turn taking ratio
- Response latency