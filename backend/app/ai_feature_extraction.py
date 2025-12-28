from typing import Dict, Any, List
from pydantic import BaseModel, conint
from openai import AzureOpenAI
from .config import OPENAI_API_KEY, OPENAI_ENDPOINT, OPENAI_MODEL, OPENAI_API_VERSION

# TODO: Write more about deployment from Foundry -> Models+endpoints -> This one
# TODO: Add more features

# Create client with the OpenAI SDK for Azure
client = AzureOpenAI(
    api_version = OPENAI_API_VERSION,
    azure_endpoint = OPENAI_ENDPOINT,
    api_key = OPENAI_API_KEY,
)

rubic_score = conint(ge=1, le=5)

class TranscriptAIFeatures(BaseModel):
    # Per-speaker scores
    coherance_score_per_speaker: Dict[str, rubic_score]
    topic_maintenance_score_per_speaker: Dict[str, rubic_score]

def format_transcript(payload: Dict[str, Any]) -> str:
    # Format transcript segments into a readable string
    lines: List[str] = []
    
    for segment in payload.get("raw_segments", []):
        offset = float(segment.get("offset", 0))
        duration = float(segment.get("duration", 0))
        speaker = segment.get("speaker")
        role = segment.get("role", "Unknown")
        text = segment.get("text")
        
        line = (
            f"[{offset:.2f}s +{duration:.2f}s] "
            f"{speaker} ({role}): {text}"
        )
        lines.append(line)
    
    return "\n".join(lines)

def extract_features(transcript: Dict[str, Any]) -> TranscriptAIFeatures:
    # Extract and validate speakers from transcript
    segments = transcript.get("raw_segments", [])
    if not segments:
        raise ValueError("Extraction error: No segments found")
    
    # Extract unique speakers
    speaker_set = set()
    for seg in segments:
        speaker = seg.get("speaker")
        if speaker:
            speaker_set.add(speaker)

    speakers = sorted(speaker_set)
    if not speakers:
        raise ValueError("Extraction error: No speakers identified in transcript segments")

    system_prompt = """
    Task: Extract rubric scores (1-5) from a transcript per speaker.

    Output: Return only a JSON object with these keys:
    {
        "coherance_score_per_speaker": { "<speaker>": 1-5, ... },
        "topic_maintenance_score_per_speaker": { "<speaker>": 1-5, ... }
    }
    
    Rubrics:
    - Coherence: 5 clear/consistent, 3 mostly understandable, 1 often incoherent. 
    - Topic maintenance: 5 stays on topic, 3 some drift, 1 frequent topic jumps.

    Rules:
    - Include every speaker from the provided speaker list.
    - Scores must be integers between 1 to 5.
    - Do not include extra keys.
    """

    user_prompt = (
        f"Full speaker list: {speakers}\n"
        f"Transcript:\n{format_transcript(transcript)}"
    )

    if client is None:
        raise ValueError("Azure OpenAI error: Client not initialised")

    # Call Azure OpenAI chat completion endpoint
    response = client.chat.completions.create(
        model = OPENAI_MODEL,
        messages = [
            {"role": "system", "content": system_prompt + "\nRespond in JSON."},
            {"role": "user", "content": user_prompt},
        ],
        response_format = {"type": "json_object"},
        temperature=0, # More deterministic output
    )

    # Extract the raw JSON
    raw = response.choices[0].message.content
    return TranscriptAIFeatures.model_validate_json(raw)