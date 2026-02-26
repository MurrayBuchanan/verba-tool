from typing import List
import json
from openai import AzureOpenAI
from app.core.config import OPENAI_API_KEY, OPENAI_ENDPOINT, OPENAI_MODEL, OPENAI_VERSION
from app.structures.schemas import TranscriptSegment, AIFeatures

"""
AI feature extraction using Azure's Enterprise OpenAI API
Validated system prompt was adapted from: https://arxiv.org/pdf/2412.15772
Structured output advice: https://developers.openai.com/api/docs/guides/structured-outputs/
Prompt engineering advice: https://machinelearningmastery.com/mastering-json-prompting-for-llms/
"""

# Create client with the OpenAI SDK for Azure
client = AzureOpenAI(
    api_version=OPENAI_VERSION,
    azure_endpoint=OPENAI_ENDPOINT,
    api_key=OPENAI_API_KEY,
)

SYSTEM_PROMPT = """
You are an experienced healthcare professional studying patients with dementia. You understand how the disease affects language abilities.

Task: Extract language impairment features from the transcript per speaker. Rate each feature on an integer scale from 1 (no impairment) to 7 (severe impairment).

Expected Format:
{
    "impoverished_vocabulary": 
        "<speaker>": 1-7, ... 
    ,
    "word_finding_difficulties": 
        "<speaker>": 1-7, ... 
    ,
    "semantic_paraphasias": 
        "<speaker>": 1-7, ... 
    ,
    "syntactic_simplification": 
        "<speaker>": 1-7, ... 
    ,
    "discourse_impairment": 
        "<speaker>": 1-7, ... 
}

Feature Definitions:
- Word-Finding Difficulties (Anomia): Difficulty retrieving words, hesitations, frequent pauses, use of non-specific and filler words. 1 = fluent word retrieval, 7 = frequent word-finding problems.
- Impoverished Vocabulary: Limited range of vocabulary, repetitive word choice, overuse of generic terms. 1 = rich vocabulary, 7 = very limited vocabulary.
- Semantic Paraphasias: Substitution of words with semantically related but incorrect words. 1 = no paraphasias, 7 = frequent semantic errors.
- Syntactic Simplification: Overuse of simple, short sentence structures, reduced complexity, increased grammatical errors. 1 = complex syntax, 7 = very simplified syntax.
- Discourse Impairment: Poor coherence, topic maintenance issues, difficulty organising thoughts, tangential speech. 1 = coherent discourse, 7 = severely impaired discourse.

Rules:
- Include every speaker from the provided speaker list.
- Scores must be integers between 1 and 7.
- Do not include extra keys or explanations.
- Respond as a JSON object.
"""

def _format_transcript(segments: List[TranscriptSegment]) -> str:
    # Format transcript into a neat string for the user prompt
    lines = []

    for segment in segments:
        lines.append(f"[{segment.offset}s +{segment.duration}s] {segment.speaker}: {segment.text}")
    
    return "\n".join(lines)

def extract_features(segments: List[TranscriptSegment]) -> AIFeatures:
    if not segments:
        raise ValueError("Error: No segments found for feature extraction")
    
    all_speakers = set()
    for segment in segments:
        speaker = segment.speaker
        if speaker:
            all_speakers.add(speaker)

    speakers = sorted(all_speakers)

    # Call Azure OpenAI API
    # Structured JSON was selected over structured outputs due to sometimes returning incorrect/no values using beta API.
    response = client.chat.completions.create(
        model = OPENAI_MODEL,
        messages = [
            {
                "role": "system", 
                "content": SYSTEM_PROMPT
            }, 
            {
                "role": "user", 
                "content": (
                    f"Full speaker list: {speakers}\n"
                    f"Transcript:\n{_format_transcript(segments)}"
                )
            }
        ],
        response_format = {"type": "json_object"}, # Formats the response as a JSON
        temperature=0 # Sets the output to be deterministic
    )

    # Validates the response is in the correct format
    return AIFeatures.model_validate_json(response.choices[0].message.content)