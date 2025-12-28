from typing import List, Dict, Any
from .ai_feature_extraction import extract_features

# TODO: Storage of previous conversations for context from backend not frontend for security
# TODO: Add tests for this module
# TODO: Add typing 
# TODO: Synchronised calculations with speaker roles
# TODO: Implement quality gate for short segments

class ConversationAnalytics:
    # Group segments by speaker before applying per-speaker calculations
    def group_by_speaker(self, segments: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        groups: Dict[str, List[Dict[str, Any]]] = {}
        for seg in segments:
            speaker = seg.get("speaker")
            groups.setdefault(speaker, []).append(seg)
        return groups
    
    # Count words in text segment by splitting on whitespace
    def count_words(self, text: str) -> int:
        return len((text or "").split())

    # Count the total number of turns in the conversation
    def count_turns_total(self, segments: List[Dict[str, Any]]) -> int:
        turns = 0 
        last_speaker = None
        for seg in segments:
            speaker = seg.get("speaker")
            if speaker != last_speaker:
                turns += 1
                last_speaker = speaker
        return turns

    # Count turns per speaker
    def count_turns_per_speaker(self, segments: List[Dict[str, Any]]) -> Dict[str, int]:
        counts: Dict[str, int] = {}
        last_speaker = None

        for seg in segments:
            speaker = seg.get("speaker")
            if speaker != last_speaker:
                counts[speaker] = counts.get(speaker, 0) + 1
                last_speaker = speaker
        return counts

    """ Features calculations """

    # Calculate words per minute
    # Formula: (total words) / (total seconds / 60)
    def wpm_for_segments(self, segments: List[Dict[str, Any]]) -> float:
        total_words = 0
        total_seconds = 0.0

        for seg in segments:
            total_words += self.count_words(seg.get("text", ""))
            total_seconds += float(seg.get("duration", 0.0) or 0.0)

        if total_seconds <= 0:
            return 0.0

        return total_words / (total_seconds / 60.0)
    
    # WPM per speaker
    def wpm_per_speaker(self, segments: List[Dict[str, Any]]) -> Dict[str, float]:
        groups = self.group_by_speaker(segments)
        return { speaker: round(self.wpm_for_segments(segs), 2) for speaker, segs in groups.items() }

    # Calculate mean utterance length
    # Formula: (total words) / (number of utterances)
    def mul_for_segments(self, segments: List[Dict[str, Any]]) -> float:
        if not segments:
            return 0.0

        total_words = 0
        for seg in segments:
            total_words += self.count_words(seg.get("text", ""))

        return total_words / len(segments)

    # MUL per speaker 
    def mul_per_speaker(self, segments: List[Dict[str, Any]]) -> Dict[str, float]:
        groups = self.group_by_speaker(segments)
        return {
            speaker: round(self.mul_for_segments(segs), 2)
            for speaker, segs in groups.items()
        }
    
    # - Repetition rate: Number of repeated words / total words
    
    # Spacy-based features 
    # - Content word ratio: (nouns + verbs + adjectives + adverbs) / total words
    # - Pronoun ratio: Pronouns / (pronouns + nouns)

    # Dictionary-based features
    # - Type-token ratio: Unique word types / total words (on a fixed window size)
    # - Disfluency/repair rate: Number of self-repairs

    """ Main analysis function """
    def analyse(self, segments: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Prepare transcript payload by wrapping segments
        transcript_payload = {"raw_segments": segments}
        
        return {
            "raw_segments": segments,
            "turns": {
                "total": self.count_turns_total(segments),
                "per_speaker": self.count_turns_per_speaker(segments),
            },
            "AI_features": extract_features(transcript_payload).model_dump(),
            "wpm_per_speaker": self.wpm_per_speaker(segments),
            "mean_utterance_length_per_speaker": self.mul_per_speaker(segments),
        }
