export interface Transcript {
	transcript_id: number;
	user_id: number;
	number_of_turns: number;
	total_duration: number;
	wpm_per_speaker: Record<string, number>;
	mean_utterance_length: Record<string, number>;
	db_id: number;
}

export interface TranscriptSegment {
	duration: number;
	offset: number;
	speaker: string;
	text: string;
}

export interface TranscriptAndSegments {
	transcript_id: number;
	user_id: number;
	number_of_turns: number;
	total_duration: number;
	segments: TranscriptSegment[];
}

export interface TranscriptWithMetrics {
	transcript_id: number;
	user_id: number;
	number_of_turns: number;
	total_duration: number;
	wpm_per_speaker: Record<string, number>;
	mul_per_speaker: Record<string, number>;
	coherence_per_speaker: Record<string, number>;
	hesitation_rate_per_speaker: Record<string, number>;
	segments: TranscriptSegment[];
}
