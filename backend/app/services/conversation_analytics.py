from typing import List, Dict
from app.services.ai_features import extract_features
from app.services.nlp_features import NLPFeatureExtraction
from app.schemas.schemas import Feature, NLPFeatures, TranscriptSegment, Transcript, AIFeatures

class ConversationAnalytics:
    def __init__(self):
        self.nlp_extractor = NLPFeatureExtraction()
    
    # Group segments by speaker before applying each calculation
    def group_by_speaker(self, segments: List[TranscriptSegment]) -> Dict[str, List[TranscriptSegment]]:
        groupedSegments = {}
        for segment in segments:
            speaker = segment.speaker
            if speaker not in groupedSegments:
                groupedSegments[speaker] = []
            groupedSegments[speaker].append(segment)
        return groupedSegments

    # Count turns per speaker
    def count_turns_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        if not segments:
            return {}
            
        counts = {}
        last_speaker = None

        for segment in segments:
            speaker = segment.speaker
            if speaker != last_speaker:
                if speaker not in counts:
                    counts[speaker] = 0
                counts[speaker] = counts[speaker] + 1
                last_speaker = speaker
        return counts

    def analyse(self, segments: List[TranscriptSegment]) -> Transcript:
        # Extract AI features
        ai_features = extract_features(segments)

        # Extract NLP features
        wpm = self.nlp_extractor.wpm_per_speaker(segments, self.group_by_speaker)
        avg_word_length = self.nlp_extractor.avg_word_length_per_speaker(segments, self.group_by_speaker)
        adverb_ratio = self.nlp_extractor.adverb_ratio_per_speaker(segments, self.group_by_speaker)
        flesch_kincaid = self.nlp_extractor.flesch_kincaid_per_speaker(segments, self.group_by_speaker)
        prp_ratio = self.nlp_extractor.prp_ratio_per_speaker(segments, self.group_by_speaker)
        num_unique_words = self.nlp_extractor.num_unique_words_per_speaker(segments, self.group_by_speaker)
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
            **ai_features.model_dump(),
            **nlp_features.model_dump(),
            raw_segments=segments,
            turns=self.count_turns_per_speaker(segments),
        )
        
        return result