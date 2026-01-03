export interface Transcript {
	transcript_id: number;
	user_id: number;
	number_of_turns: number;
	total_duration: number;
	wpm_per_speaker: Record<string, number>;
	mean_utterance_length: Record<string, number>;
	db_id: number;
}

export interface TranscriptAndSegments {
	transcript_id: number;
	user_id: number;
	number_of_turns: number;
	total_duration: number;
	wpm_per_speaker: Record<string, number>;
	mean_utterance_length: Record<string, number>;
	segments: TranscriptSegment[];
}

export interface TranscriptSegment {
	duration: number;
	offset: number;
	speaker: string;
	text: string;
}