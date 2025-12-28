# Backend Documentation

## How to run

## Virtual Environment
Activate: ```source .venv/bin/activate```
Deactivate: ```deactivate```


uvicorn app.main:app --reload


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
- Repetition rate: ...

### AI
- Coherance score (rubic)
- Information
- Topic maintenance

### Extra
- Turn taking ratio
- Response latency