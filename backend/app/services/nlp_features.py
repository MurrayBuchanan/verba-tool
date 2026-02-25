from typing import Dict, List
import spacy
import textstat
from app.structures.schemas import Feature, TranscriptSegment

"""
NLP flow for feature extraction
"""

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = spacy.blank("en")

class NLPFeatureExtraction:
    def __init__(self):
        self.nlp = nlp
    
    # Combine segments into single string
    def _combine_segments(self, segments: List[TranscriptSegment]) -> str:
        texts = []
        for segment in segments:
            texts.append(segment.text)
        return " ".join(texts)

    # Count words in text by splitting on whitespace
    def _count_words(self, text: str) -> int:
        if not text:
            return 0
        return len(text.split())


    def _group_by_speaker(self, segments: List[TranscriptSegment]) -> Dict[str, List[TranscriptSegment]]:
        result: Dict[str, List[TranscriptSegment]] = {}
        for segment in segments:
            speaker = segment.speaker
            if speaker not in result:
                result[speaker] = []
            result[speaker].append(segment)
        return result

    # Future work: potential to add more per speaker metrics here e.g. turn taking, mlu, num_of_x etc



    # Calculate words per minute using the formula: total words / (total seconds / 60)
    def calculate_wpm(self, segments: List[TranscriptSegment]) -> float:
        total_words = 0
        total_seconds = 0.0

        for segment in segments:
            total_words += self._count_words(segment.text)
            total_seconds += segment.duration

        if total_seconds <= 0:
            return 0.0

        return total_words / (total_seconds / 60.0)

    def wpm_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        grouped_segments = self._group_by_speaker(segments)
        result = {}

        for speaker, speaker_segments in grouped_segments.items():
            wpm = self.calculate_wpm(speaker_segments)
            result[speaker] = round(wpm, 2)

        return result



    # Calculate average word length using the textstat library
    def calculate_avg_word_length(self, segments: List[TranscriptSegment]) -> float:
        text = self._combine_segments(segments)
        return textstat.avg_character_per_word(text)

    def avg_word_length_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        grouped_segments = self._group_by_speaker(segments)
        result = {}

        for speaker, speaker_segments in grouped_segments.items():
            avg_word_length = self.calculate_avg_word_length(speaker_segments)
            result[speaker] = round(avg_word_length, 2)

        return result
    


    # Calculate adverb ratio using the formula: total adverbs / total words
    def calculate_adverb_ratio(self, segments: List[TranscriptSegment]) -> float:
        text = self._combine_segments(segments)
        total_words = self._count_words(text)
        if total_words == 0:
            return 0.0

        tokens = self.nlp(text)

        # Count adverbs
        total_adverbs = 0
        for token in tokens:
            if token.pos_ == "ADV":
                total_adverbs += 1
        
        return total_adverbs / total_words
    
    def adverb_ratio_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        grouped_segments = self._group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in grouped_segments.items():
            adverb_ratio = self.calculate_adverb_ratio(speaker_segments)
            result[speaker] = round(adverb_ratio, 2)

        return result
    


    # Calculate flesch-kincaid grade level using the textstat library
    def calculate_flesch_kincaid(self, segments: List[TranscriptSegment]) -> float:
        text = self._combine_segments(segments)
        if self._count_words(text) == 0:
            return 0.0
        return textstat.flesch_kincaid_grade(text)
    
    def flesch_kincaid_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        grouped_segments = self._group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in grouped_segments.items():
            flesch_kincaid = self.calculate_flesch_kincaid(speaker_segments)
            result[speaker] = round(flesch_kincaid, 2)
        
        return result
    


    # Calculate personal pronoun ratio using the formula: total pronouns / (total pronouns + total nouns)
    # Reference: https://pmc.ncbi.nlm.nih.gov/articles/PMC7959106/
    def calculate_prp_ratio(self, segments: List[TranscriptSegment]) -> float:
        text = self._combine_segments(segments)
        tokens = self.nlp(text)
        
        pronouns = 0
        nouns = 0
        for token in tokens:
            if not token.is_punct and not token.is_space:
                if token.pos_ == "PRON":
                    pronouns += 1
                elif token.pos_ == "NOUN":
                    nouns += 1

        if pronouns + nouns == 0:
            return 0.0
        
        return pronouns / (pronouns + nouns)

    def prp_ratio_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        grouped_segments = self._group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in grouped_segments.items():
            prp_ratio = self.calculate_prp_ratio(speaker_segments)
            result[speaker] = round(prp_ratio, 2)
        
        return result
    


    # Calculate number of unique words using a set to count unique words by avoiding duplicates
    def calculate_n_unique_words(self, segments: List[TranscriptSegment]) -> int:
        text = self._combine_segments(segments)
        words = text.lower().split()
        return len(set(words))
    
    def n_unique_words_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        grouped_segments = self._group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in grouped_segments.items():
            n_unique_words = self.calculate_n_unique_words(speaker_segments)
            result[speaker] = n_unique_words
        
        return result