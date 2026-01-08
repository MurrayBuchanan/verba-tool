from typing import List, Dict
import spacy
import textstat
from app.schemas.schemas import SpeakerMetric, Segment

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = spacy.blank("en")


class NLPFeatureExtraction:
    def __init__(self):
        self.nlp = nlp
    
    # Combine segments into a single text block
    def combine_segments(self, segments: List[Segment]) -> str:
        texts = []
        for segment in segments:
            text = segment.get("text", "")
            texts.append(text)
        return " ".join(texts)
    


    # Calculate adverb ratio
    # Formula: (number of adverbs) / (total words)
    def calculate_adverb_ratio(self, segments: List[Segment]) -> float:
        text = self.combine_segments(segments)
        if not text.strip():
            return 0.0

        tokens = self.nlp(text)
        
        # Count all words
        totalWords = 0
        for token in tokens:
            if not token.is_punct and not token.is_space: # Exclude punctuation and spaces
                totalWords += 1
        
        if totalWords == 0:
            return 0.0
        
        # Count adverbs
        totalAdverbs = 0
        for token in tokens:
            if token.pos_ == "ADV":
                totalAdverbs += 1
        
        return totalAdverbs / totalWords
    
    def adverb_ratio_per_speaker(self, segments: List[Segment], group_by_speaker) -> SpeakerMetric:
        groupedSegments = group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            ratio = self.calculate_adverb_ratio(speaker_segments)
            result[speaker] = round(ratio, 4)

        return result
    


    # Calculate Flesch-Kincaid Grade Level
    # Calculation uses textstat library
    def calculate_flesch_kincaid(self, segments: List[Segment]) -> float:
        text = self.combine_segments(segments)
        if not text.strip():
            return 0.0
        return textstat.flesch_kincaid_grade(text)
    
    def flesch_kincaid_per_speaker(self, segments: List[Segment], group_by_speaker) -> SpeakerMetric:
        groupedSegments = group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            score = self.calculate_flesch_kincaid(speaker_segments)
            result[speaker] = round(score, 2)
        
        return result
    


    # Calculate pronoun to pronoun+noun ratio
    # Formula: (number of pronouns) / (number of pronouns + number of nouns)
    def calculate_prp_ratio(self, segments: List[Segment]) -> float:
        text = self.combine_segments(segments)
        if not text.strip():
            return 0.0
        
        # Process text with spaCy
        doc = self.nlp(text)
        
        # Count pronouns
        pronouns = []
        for token in doc:
            if token.pos_ == "PRON":
                pronouns.append(token)
        
        # Count nouns
        nouns = []
        for token in doc:
            if token.pos_ == "NOUN":
                nouns.append(token)
        
        # Calculate total
        total = len(pronouns) + len(nouns)
        if total == 0:
            return 0.0
        
        # Calculate ratio
        ratio = len(pronouns) / total
        return ratio
    
    def prp_ratio_per_speaker(self, segments: List[Segment], group_by_speaker) -> SpeakerMetric:
        groupedSegments = group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            ratio = self.calculate_prp_ratio(speaker_segments)
            result[speaker] = round(ratio, 4)
        
        return result
    


    # Calculate number of unique words
    # Formula: Count of distinct words (case-insensitive)
    def calculate_num_unique_words(self, segments: List[Segment]) -> int:
        text = self.combine_segments(segments)
        words = text.lower().split()
        return len(set(words))
    
    def num_unique_words_per_speaker(self, segments: List[Segment], group_by_speaker) -> SpeakerMetric:
        groupedSegments = group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            count = self.calculate_num_unique_words(speaker_segments)
            result[speaker] = count
        
        return result
