export interface Transcript {
	transcript_id: number;
	user_id: number;
	number_of_turns: number;
	total_duration: number;
	wpm_per_speaker: Record<string, number>;
	mean_utterance_length: Record<string, number>;
	db_id: number;
	created_at: string | null;
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
	created_at: string | null;
}

// TODO: Potentially interface for each metric (Avoid mass loading)

export interface TranscriptWithMetrics {
	transcript_id: number;
	user_id?: number;
	number_of_turns?: number;
	total_duration?: number;
	turns: Record<string, number>;
	raw_segments?: TranscriptSegment[];
	segments?: TranscriptSegment[];
	db_transcript_id?: number;

	// AI Features
	impoverished_vocabulary: Record<string, number>;
	word_finding_difficulties: Record<string, number>;
	semantic_paraphasias: Record<string, number>;
	syntactic_simplification: Record<string, number>;
	discourse_impairment: Record<string, number>;

	// Established Features
	wpm_per_speaker: Record<string, number>;
	mean_utterance_length_per_speaker: Record<string, number>;
	avg_word_length: Record<string, number>;
	adverb_ratio: Record<string, number>;
	flesch_kincaid: Record<string, number>;
	prp_ratio: Record<string, number>;
	num_unique_words: Record<string, number>;
}
