from typing import List
import spacy
import textstat
from app.schemas.schemas import Feature, TranscriptSegment

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = spacy.blank("en")

class NLPFeatureExtraction:
    def __init__(self):
        self.nlp = nlp
    
    # Combine segments into a single text block
    def combine_segments(self, segments: List[TranscriptSegment]) -> str:
        texts = []
        for segment in segments:
            text = segment.text or ""
            texts.append(text)
        return " ".join(texts)

    # Count words in text segment by splitting on whitespace
    def count_words(self, text: str) -> int:
        return len((text or "").split())

    # Calculate words per minute
    # Formula: (total words) / (total seconds / 60)
    def calculate_wpm(self, segments: List[TranscriptSegment]) -> float:
        total_words = 0
        total_seconds = 0.0

        for segment in segments:
            total_words += self.count_words(segment.text or "")
            total_seconds += float(segment.duration or 0.0)

        if total_seconds <= 0:
            return 0.0

        return total_words / (total_seconds / 60.0)

    def wpm_per_speaker(self, segments: List[TranscriptSegment], group_by_speaker) -> Feature:
        groupedSegments = group_by_speaker(segments)
        result = {}

        for speaker, speaker_segments in groupedSegments.items():
            wpm = self.calculate_wpm(speaker_segments)
            result[speaker] = round(wpm, 2)

        return result



    # Calculate average word length
    # Formula: (total characters) / (total words)
    def calculate_avg_word_length(self, segments: List[TranscriptSegment]) -> float:
        text = self.combine_segments(segments)
        words = text.split()

        if len(words) == 0:
            return 0.0

        total_characters = 0
        for word in words:
            total_characters += len(word)

        return total_characters / len(words)

    def avg_word_length_per_speaker(self, segments: List[TranscriptSegment], group_by_speaker) -> Feature:
        groupedSegments = group_by_speaker(segments)
        result = {}

        for speaker, speaker_segments in groupedSegments.items():
            avg_length = self.calculate_avg_word_length(speaker_segments)
            result[speaker] = round(avg_length, 2)

        return result
    


    # Calculate adverb ratio
    # Formula: (number of adverbs) / (total words)
    def calculate_adverb_ratio(self, segments: List[TranscriptSegment]) -> float:
        text = self.combine_segments(segments)
        if not text.strip():
            return 0.0

        tokens = self.nlp(text)
        
        # Count all words
        totalWords = 0
        for token in tokens:
            if not token.is_punct and not token.is_space:
                totalWords += 1
        
        if totalWords == 0:
            return 0.0
        
        # Count adverbs
        totalAdverbs = 0
        for token in tokens:
            if token.pos_ == "ADV":
                totalAdverbs += 1
        
        return totalAdverbs / totalWords
    
    def adverb_ratio_per_speaker(self, segments: List[TranscriptSegment], group_by_speaker) -> Feature:
        groupedSegments = group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            ratio = self.calculate_adverb_ratio(speaker_segments)
            result[speaker] = round(ratio, 4)

        return result
    


    # Calculate Flesch-Kincaid Grade Level
    # Calculation uses textstat library
    def calculate_flesch_kincaid(self, segments: List[TranscriptSegment]) -> float:
        text = self.combine_segments(segments)
        if not text.strip():
            return 0.0
        return textstat.flesch_kincaid_grade(text)
    
    def flesch_kincaid_per_speaker(self, segments: List[TranscriptSegment], group_by_speaker) -> Feature:
        groupedSegments = group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            score = self.calculate_flesch_kincaid(speaker_segments)
            result[speaker] = round(score, 2)
        
        return result
    


    # Calculate pronoun to pronoun+noun ratio
    # Formula: (number of pronouns) / (number of pronouns + number of nouns)
    def calculate_prp_ratio(self, segments: List[TranscriptSegment]) -> float:
        text = self.combine_segments(segments)
        if not text.strip():
            return 0.0
        
        tokens = self.nlp(text)
        
        # Count pronouns
        pronouns = 0
        for token in tokens:
            if token.pos_ == "PRON":
                pronouns += 1
        
        # Count nouns
        nouns = 0
        for token in tokens:
            if token.pos_ == "NOUN":
                nouns += 1
        
        # Calculate total
        total = pronouns + nouns
        if total == 0:
            return 0.0
        
        return pronouns / total
    
    def prp_ratio_per_speaker(self, segments: List[TranscriptSegment], group_by_speaker) -> Feature:
        groupedSegments = group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            ratio = self.calculate_prp_ratio(speaker_segments)
            result[speaker] = round(ratio, 4)
        
        return result
    


    # Calculate number of unique words
    # Formula: Count of distinct words (case-insensitive)
    def calculate_num_unique_words(self, segments: List[TranscriptSegment]) -> int:
        text = self.combine_segments(segments)
        words = text.lower().split()
        return len(set(words))
    
    def num_unique_words_per_speaker(self, segments: List[TranscriptSegment], group_by_speaker) -> Feature:
        groupedSegments = group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            count = self.calculate_num_unique_words(speaker_segments)
            result[speaker] = count
        
        return result