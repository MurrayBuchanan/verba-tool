import re
from collections import defaultdict
from typing import List, Dict, Any
# TODO: Include more from the 48 (12) feature paper (Repetition Detection, hesitations, and long pauses)
# TODO: Create RAG model for conversation analytics
# TODO: Run RAG model on segments and in parallel
# TODO: Storage of previous conversations for context from backend not frontend for security
# TODO: Add tests for this module

class ConversationAnalytics:
    def map_speakers(self, segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not segments:
            return segments

        mapping: Dict[str, str] = {}
        guest_number = 1

        for segment in segments:
            speaker = segment["speaker"]
            if speaker not in mapping:
                if not mapping:
                    # First speaker is the carer
                    mapping[speaker] = "Carer"
                else:
                    # Next speakers are guests (more than 10 reduces accuracy)
                    mapping[speaker] = f"Guest-{guest_number}"
                    guest_number += 1

        # Map roles to segments
        for segment in segments:
            segment["role"] = mapping.get(segment["speaker"], "Unknown")

        return segments

    # Count the number of turns each speaker has taken
    def count_turns(self, segments: List[Dict[str, Any]]) -> int:
        turns = 0
        last = None
        for segment in segments:
            if segment["speaker"] != last:
                turns += 1
                last = segment["speaker"]
        return turns

    def analyse(self, segments: List[Dict[str, Any]]) -> Dict[str, Any]:
        segments = self.map_speakers(segments)
        analytics: Dict[str, Any] = {
            "number_of_turns": self.count_turns(segments),
            "raw_segments": segments,
        }
        return analytics