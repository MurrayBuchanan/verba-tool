from typing import List
from app.services import nlp_features as extract_nlp_features
from app.services.ai_feature_factory import extract_features_factory
from app.structures.schemas import NLPFeatures, TranscriptSegment, Transcript, AIFeatures

"""
Conversation analytics to combine established and AI features into a single transcript
"""

class ConversationAnalytics:
    def _calculate_total_duration(self, segments: List[TranscriptSegment]) -> float:
        total_duration = 0.0
        for segment in segments:
            total_duration += segment.duration
        return round(total_duration, 3)

    # Future work: potential to add more general conversation analytics here e.g. total turns, etc

    def analyse(self, segments: List[TranscriptSegment]) -> Transcript:
        # ai_features = extract_features(segments) # Run a single LLM
        ai_features = extract_features_factory(segments) # Run an ensemble of LLMs

        nlp_features = NLPFeatures(
            words_per_minute=extract_nlp_features.wpm_per_speaker(segments),
            average_word_length=extract_nlp_features.avg_word_length_per_speaker(segments),
            adverb_ratio=extract_nlp_features.adverb_ratio_per_speaker(segments),
            flesch_kincaid_grade=extract_nlp_features.flesch_kincaid_per_speaker(segments),
            personal_pronoun_ratio=extract_nlp_features.prp_ratio_per_speaker(segments),
            number_of_unique_words=extract_nlp_features.n_unique_words_per_speaker(segments)
        )

        # Combine all features
        transcript = Transcript(
            **nlp_features.model_dump(),
            **ai_features.model_dump(),
            total_duration = self._calculate_total_duration(segments),
            raw_segments = segments
        )
        return transcript