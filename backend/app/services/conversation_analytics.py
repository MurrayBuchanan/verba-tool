from typing import List, Dict
from app.services.ai_feature_extraction import extract_features
from app.services.nlp_feature_extraction import NLPFeatureExtraction
from app.schemas.schemas import Feature, NLPFeatures,TranscriptSegment, CAResult

class ConversationAnalytics:
    def __init__(self):
        self.nlp_extractor = NLPFeatureExtraction()
    
    # Group segments by speaker before applying each calculation
    def group_by_speaker(self, segments: List[TranscriptSegment]) -> Dict[str, List[TranscriptSegment]]:
        groupedSegmentsSegments = {}
        for segment in segments:
            speaker = segment.get("speaker")
            if speaker not in groupedSegmentsSegments:
                groupedSegmentsSegments[speaker] = []
            groupedSegmentsSegments[speaker].append(segment)
        return groupedSegmentsSegments

    # Count words in text segment by splitting on whitespace
    def count_words(self, text: str) -> int:
        return len((text or "").split())

    # Count turns per speaker
    def count_turns_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        if not segments:
            return {}
            
        counts = {}
        last_speaker = None

        for segment in segments:
            speaker = segment.get("speaker")
            if speaker != last_speaker:
                if speaker not in counts:
                    counts[speaker] = 0
                counts[speaker] = counts[speaker] + 1
                last_speaker = speaker
        return counts

    # Combine segments into a single text block
    def combine_segments(self, segments: List[TranscriptSegment]) -> str:
        texts = []
        for segment in segments:
            text = segment.get("text", "")
            texts.append(text)
        return " ".join(texts)



    # Calculate words per minute
    # Formula: (total words) / (total seconds / 60)
    def calculate_wpm(self, segments: List[TranscriptSegment]) -> float:
        total_words = 0
        total_seconds = 0.0

        for segment in segments:
            total_words += self.count_words(segment.get("text", ""))
            total_seconds += float(segment.get("duration", 0.0))

        if total_seconds <= 0:
            return 0.0

        return total_words / (total_seconds / 60.0)
    
    def wpm_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        groupedSegments = self.group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            wpm = self.calculate_wpm(speaker_segments)
            result[speaker] = round(wpm, 2)
        
        return result



    # Calculate mean utterance length
    # Formula: (total words) / (number of utterances)
    def calculate_mul(self, segments: List[TranscriptSegment]) -> float:
        if not segments:
            return 0.0

        total_words = 0
        for segment in segments:
            total_words += self.count_words(segment.get("text", ""))

        return total_words / len(segments)

    def mul_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        groupedSegments = self.group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            mul = self.calculate_mul(speaker_segments)
            result[speaker] = round(mul, 2)
        
        return result
    


    # Calculate average word length
    # Formula: (total characters) / (total words)
    def calculate_avg_word_length(self, segments: List[TranscriptSegment]) -> float:
        text = self.combine_segments(segments)
        words = text.split()
        
        # Catch empty segments
        if len(words) == 0:
            return 0.0
        
        total_characters = 0
        for word in words:
            total_characters += len(word)
        
        return total_characters / len(words)
    
    def avg_word_length_per_speaker(self, segments: List[TranscriptSegment]) -> Feature:
        groupedSegments = self.group_by_speaker(segments)
        result = {}
        
        for speaker, speaker_segments in groupedSegments.items():
            avg_length = self.calculate_avg_word_length(speaker_segments)
            result[speaker] = round(avg_length, 2)
            
        return result




    def analyse(self, segments: List[TranscriptSegment]) -> CAResult:
        # Extract AI features
        ai_features = extract_features(segments)

        # Extract NLP features
        wpm = self.wpm_per_speaker(segments)
        mul = self.mul_per_speaker(segments)
        avg_word_length = self.avg_word_length_per_speaker(segments)
        adverb_ratio = self.nlp_extractor.adverb_ratio_per_speaker(segments, self.group_by_speaker)
        flesch_kincaid = self.nlp_extractor.flesch_kincaid_per_speaker(segments, self.group_by_speaker)
        prp_ratio = self.nlp_extractor.prp_ratio_per_speaker(segments, self.group_by_speaker)
        num_unique_words = self.nlp_extractor.num_unique_words_per_speaker(segments, self.group_by_speaker)
        established_features = {
            "wpm_per_speaker": wpm,
            "mean_utterance_length_per_speaker": mul,
            "avg_word_length": avg_word_length,
            "adverb_ratio": adverb_ratio,
            "flesch_kincaid": flesch_kincaid,
            "prp_ratio": prp_ratio,
            "num_unique_words": num_unique_words,
        }

        # Combine all features
        result = {
            "raw_segments": segments,
            "turns": self.count_turns_per_speaker(segments),
        }
        
        result.update(ai_features)
        result.update(established_features)
        
        return result