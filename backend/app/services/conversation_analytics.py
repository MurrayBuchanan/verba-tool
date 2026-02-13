from typing import List, Dict
from app.services.ai_features import extract_features
from app.services.nlp_features import NLPFeatureExtraction
from app.schemas.schemas import Feature, NLPFeatures, TranscriptSegment, Transcript, AIFeatures

class ConversationAnalytics:
    def __init__(self):
        self.nlp_feature_extraction = NLPFeatureExtraction()
    
    # Group speaker segments by to calculate metrics for each person speaker
    def _group_by_speaker(self, segments: List[TranscriptSegment]) -> Dict[str, List[TranscriptSegment]]:
        grouped_segments = {}
        for segment in segments:
            speaker = segment.speaker

            if speaker not in grouped_segments:
                grouped_segments[speaker] = []
                
            grouped_segments[speaker].append(segment)
        return grouped_segments

    def _calculate_total_duration(self, segments: List[TranscriptSegment]) -> float:
        total_duration = 0.0
        for segment in segments:
            total_duration += segment.duration
        return total_duration

    def analyse(self, segments: List[TranscriptSegment]) -> Transcript:
        # Extract AI features
        ai_features = extract_features(segments)

        # Extract NLP features
        wpm = self.nlp_feature_extraction.wpm_per_speaker(segments, self._group_by_speaker)
        avg_word_length = self.nlp_feature_extraction.avg_word_length_per_speaker(segments, self._group_by_speaker)
        adverb_ratio = self.nlp_feature_extraction.adverb_ratio_per_speaker(segments, self._group_by_speaker)
        flesch_kincaid = self.nlp_feature_extraction.flesch_kincaid_per_speaker(segments, self._group_by_speaker)
        prp_ratio = self.nlp_feature_extraction.prp_ratio_per_speaker(segments, self._group_by_speaker)
        num_unique_words = self.nlp_feature_extraction.n_unique_words_per_speaker(segments, self._group_by_speaker)
        established_features = {
            "wpm_per_speaker": wpm,
            "avg_word_length": avg_word_length,
            "adverb_ratio": adverb_ratio,
            "flesch_kincaid": flesch_kincaid,
            "prp_ratio": prp_ratio,
            "num_unique_words": num_unique_words,
        }

        # Combine all features
        nlp_features = NLPFeatures(**established_features)

        result = Transcript(
            **nlp_features.model_dump(),
            **ai_features.model_dump(),
            total_duration=self._calculate_total_duration(segments),
            raw_segments=segments,
        )
        return result