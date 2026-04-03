---
sidebar_position: 2
---

# Project Structure

## 3-Layered Architecture
The project uses a three-tier architecture, which separates the application into presentation, application, and data layers. The presentation layer is responsible for the client application, handling user interaction, audio recording and data visualisation. The application layer is responsible for the server-side logic, including transcription, diarisation, feature extraction, validation and external API calls. The data layer is responsible for storing users, profiles, transcripts, and interventions.

## High Level System Design
### System Architecture Diagram
<img src="/img/system_architecture_diagram.png" alt="System Architecture Diagram" width="550" />

### System Component Diagram
![System Component Diagram](/img/system_component_diagram.png)


## Prototypes
The wireframes show an expanded view of the wireframes, defining the navigation structure and component design, and visualising the relationships between them. The blue prototype lines show the connections between screens and components.

![Wireframes](/img/wireframes.png)

## Feature Extraction

### NLP
The system extracts low-level linguistic indicators using the [spaCy](https://spacy.io/) and [textstat](https://pypi.org/project/textstat/) libraries. The indicators are as follows:
- Words per minute
- Avg word length
- Adverb ratio
- Pronoun ratio
- Flesch-Kincaid grade
- Number of unique words

### LLM
The system uses an enterprise version of GPT-4o via the [Azure OpenAI](https://azure.microsoft.com/en-gb/products/ai-foundry/models/openai/) API, to extract high-level linguistic indicators. The indicators are as follows:

- Impoverished vocabulary
- Word finding difficulty
- Semantic paraphasias
- Syntactic simplification
- Discourse impairment