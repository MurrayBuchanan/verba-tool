from typing import List, Dict
import spacy
import textstat
from .ai_feature_extraction import extract_features

from .schemas import SpeakerMetric, Segment, RawSegments, ConversationAnalysisResult, EstablishedFeatures

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = spacy.blank("en")

class ConversationAnalytics:   
    # Group segments by speaker before applying per-speaker calculations
    def group_by_speaker(self, segments: List[Segment]) -> Dict[str, List[Segment]]:
        groups: Dict[str, List[Segment]] = {}
        for segment in segments:
            speaker = segment.get("speaker")
            groups.setdefault(speaker, []).append(segment)
        return groups

    # Count words in text segment by splitting on whitespace
    def count_words(self, text: str) -> int:
        return len((text or "").split())

    # Count turns per speaker
    def count_turns_per_speaker(self, segments: List[Segment]) -> SpeakerMetric:
        if not segments:
            return {}
            
        counts: Dict[str, int] = {}
        last_speaker = None

        for segment in segments:
            speaker = segment.get("speaker")
            if speaker != last_speaker:
                counts[speaker] = counts.get(speaker, 0) + 1
                last_speaker = speaker
        return counts

    # Join segments into a single text block
    def join_segments(self, segments: List[Segment]) -> str:
        texts = [segment.get("text", "") for segment in segments]
        return " ".join(texts)




    # Calculate words per minute
    # Formula: (total words) / (total seconds / 60)
    def calculate_wpm(self, segments: List[Segment]) -> float:
        total_words = 0
        total_seconds = 0.0

        for segment in segments:
            total_words += self.count_words(segment.get("text", ""))
            total_seconds += float(segment.get("duration", 0.0) or 0.0)

        if total_seconds <= 0:
            return 0.0

        return total_words / (total_seconds / 60.0)
    
    def wpm_per_speaker(self, segments: List[Segment]) -> SpeakerMetric:
        grouped = self.group_by_speaker(segments)
        return { speaker: round(self.calculate_wpm(speaker_segments), 2) for speaker, speaker_segments in grouped.items()}




    # Calculate mean utterance length
    # Formula: (total words) / (number of utterances)
    def calculate_mul(self, segments: List[Segment]) -> float:
        if not segments:
            return 0.0

        total_words = 0
        for segment in segments:
            total_words += self.count_words(segment.get("text", ""))

        return total_words / len(segments)

    def mul_per_speaker(self, segments: List[Segment]) -> SpeakerMetric:
        grouped = self.group_by_speaker(segments)
        return { speaker: round(self.calculate_mul(speaker_segments), 2) for speaker, speaker_segments in grouped.items()}
    



    # Calculate average word length
    # Formula: (total characters) / (total words)
    def calculate_avg_word_length(self, segments: List[Segment]) -> float:
        text = self.join_segments(segments)
        words = text.split()
        if not words:
            return 0.0
        total_characters = sum(len(word) for word in words)
        return total_characters / len(words)
    
    def avg_word_length_per_speaker(self, segments: List[Segment]) -> SpeakerMetric:
        grouped = self.group_by_speaker(segments)
        return { speaker: round(self.calculate_avg_word_length(speaker_segments), 2) for speaker, speaker_segments in grouped.items()}
    




    # Calculate adverb ratio
    # Formula: (number of adverbs) / (total words)
    def calculate_adverb_ratio(self, segments: List[Segment]) -> float:
        text = self.join_segments(segments)
        if not text.strip():
            return 0.0
        
        doc = nlp(text)
        total_words = [
            token
            for token in doc
            if not token.is_punct and not token.is_space
        ]
        if not total_words:
            return 0.0
        
        adverbs = [token for token in doc if token.pos_ == "ADV"]
        return len(adverbs) / len(total_words)
    
    def adverb_ratio_per_speaker(self, segments: List[Segment]) -> SpeakerMetric:
        grouped = self.group_by_speaker(segments)
        return { speaker: round(self.calculate_adverb_ratio(speaker_segments), 4) for speaker, speaker_segments in grouped.items() }




    # Calculate Flesch-Kincaid Grade Level
    # Calculation uses textstat library
    def calculate_flesch_kincaid(self, segments: List[Segment]) -> float:
        text = self.join_segments(segments)
        if not text.strip():
            return 0.0
        return textstat.flesch_kincaid_grade(text)
    
    def flesch_kincaid_per_speaker(self, segments: List[Segment]) -> SpeakerMetric:
        grouped = self.group_by_speaker(segments)
        return { speaker: round(self.calculate_flesch_kincaid(speaker_segments), 2) for speaker, speaker_segments in grouped.items() }
    




    # Calculate pronoun to pronoun+noun ratio
    # Formula: (number of pronouns) / (number of pronouns + number of
    def calculate_prp_ratio(self, segments: List[Segment]) -> float:
        text = self.join_segments(segments)
        if not text.strip():
            return 0.0
        
        doc = nlp(text)
        pronouns = [token for token in doc if token.pos_ == "PRON"]
        nouns = [token for token in doc if token.pos_ == "NOUN"]
        
        total = len(pronouns) + len(nouns)
        if total == 0:
            return 0.0
        
        return len(pronouns) / total
    
    def prp_ratio_per_speaker(self, segments: List[Segment]) -> SpeakerMetric:
        grouped = self.group_by_speaker(segments)
        return { speaker: round(self.calculate_prp_ratio(speaker_segments), 4) for speaker, speaker_segments in grouped.items()}





    # Calculate number of unique words
    # Formula: Count of distinct words (case-insensitive)
    # TODO: Sliding window (maybe)
    def calculate_num_unique_words(self, segments: List[Segment]) -> int:
        text = self.join_segments(segments)
        words = text.lower().split()
        unique_words = set(words)
        return len(unique_words)
    
    def num_unique_words_per_speaker(self, segments: List[Segment]) -> SpeakerMetric:
        grouped = self.group_by_speaker(segments)
        return { speaker: self.calculate_num_unique_words(speaker_segments) for speaker, speaker_segments in grouped.items()}




    def analyse(self, segments: List[Segment]) -> ConversationAnalysisResult:
        # Prepare transcript payload by wrapping segments
        transcript_payload: RawSegments = {"raw_segments": segments}

        # Extract AI features
        ai_features = extract_features(transcript_payload)

        # Calculate established features
        established_features: EstablishedFeatures = {
            "wpm_per_speaker": self.wpm_per_speaker(segments),
            "mean_utterance_length_per_speaker": self.mul_per_speaker(segments),
            "avg_word_length": self.avg_word_length_per_speaker(segments),
            "adverb_ratio": self.adverb_ratio_per_speaker(segments),
            "flesch_kincaid": self.flesch_kincaid_per_speaker(segments),
            "prp_ratio": self.prp_ratio_per_speaker(segments),
            "num_unique_words": self.num_unique_words_per_speaker(segments),
        }

        # Combine all features into the result
        result = {
            "raw_segments": segments,
            "turns": self.count_turns_per_speaker(segments),
        }
        result.update(ai_features)
        result.update(established_features)
        return result
