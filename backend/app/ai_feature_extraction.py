from typing import List, cast
import json
from openai import AzureOpenAI
from .config import OPENAI_API_KEY, OPENAI_ENDPOINT, OPENAI_MODEL, OPENAI_VERSION
from .schemas import RawSegments, AIFeatures

# TODO: Write more about deployment from Foundry -> Models+endpoints -> This one

# Create client with the OpenAI SDK for Azure
client = AzureOpenAI(
    api_version = OPENAI_VERSION,
    azure_endpoint = OPENAI_ENDPOINT,
    api_key = OPENAI_API_KEY,
)

def format_transcript(payload: RawSegments) -> str:
    # Format transcript segments into a readable string
    lines: List[str] = []
    
    for segment in payload["raw_segments"]:
        offset = segment["offset"]
        duration = segment["duration"]
        speaker = segment["speaker"]
        text = segment["text"]
        
        line = (
            f"[{offset:.2f}s +{duration:.2f}s] "
            f"{speaker}: {text}"
        )
        lines.append(line)
    
    return "\n".join(lines)

def extract_features(transcript: RawSegments) -> AIFeatures:
    # Extract and validate speakers from transcript
    segments = transcript["raw_segments"]
    if not segments:
        raise ValueError("Extraction error: No segments found")
    
    # Extract unique speakers
    speaker_set = set()
    for segment in segments:
        speaker = segment["speaker"]
        if speaker:
            speaker_set.add(speaker)

    speakers = sorted(speaker_set)
    if not speakers:
        raise ValueError("Extraction error: No speakers identified in transcript segments")

    system_prompt = """
    You are a experienced doctor studying patients with dementia. You understand how the disease affects language abilities.
    Task: 
    - Extract linguistic impairment features from a transcript per speaker.
    - Rate each feature on a scale from 0.0 (no impairment) to 1.0 (severe impairment).

    Output: Return only a JSON object with these keys:
    {
        "impoverished_vocabulary": { "<speaker>": 0.0-1.0, ... },
        "word_finding_difficulties": { "<speaker>": 0.0-1.0, ... },
        "semantic_paraphasias": { "<speaker>": 0.0-1.0, ... },
        "syntactic_simplification": { "<speaker>": 0.0-1.0, ... },
        "discourse_impairment": { "<speaker>": 0.0-1.0, ... }
    }
    
    Feature Definitions:
    - Word-Finding Difficulties (Anomia): Difficulty retrieving words, hesitations, frequent pauses, use of non-specific and filler words. 0.0 = fluent word retrieval, 1.0 = frequent word-finding problems.
    - Impoverished Vocabulary: Limited range of vocabulary, repetitive word choice, overuse of generic terms. 0.0 = rich vocabulary, 1.0 = very limited vocabulary.
    - Semantic Paraphasias: Substitution of words with semantically related but incorrect words. 0.0 = no paraphasias, 1.0 = frequent semantic errors.
    - Syntactic Simplification: Overuse of simple, short sentence structures, reduced complexity, increased grammatical errors. 0.0 = complex syntax, 1.0 = very simplified syntax.
    - Discourse Impairment: Poor coherence, topic maintenance issues, difficulty organizing thoughts, tangential speech. 0.0 = coherent discourse, 1.0 = severely impaired discourse.

    Rules:
    - Include every speaker from the provided speaker list.
    - Scores must be floating point numbers between 0.0 and 1.0.
    - Do not include extra keys or explanations.
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

    # Extract and parse the JSON response
    raw = response.choices[0].message.content
        
    parsed: dict = json.loads(raw)
    # Validate that all required fields are present
    required_fields = [
        "word_finding_difficulties",
        "impoverished_vocabulary",
        "semantic_paraphasias",
        "syntactic_simplification",
        "discourse_impairment"
    ]
    for field in required_fields:
        if field not in parsed:
            parsed[field] = {}
    
    return cast(AIFeatures, parsed)