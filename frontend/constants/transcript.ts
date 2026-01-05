export interface Transcript {
	transcript_id: number;
	user_id: number;
	number_of_turns: number;
	total_duration: number;
	db_id: number;
	created_at: string | null;
	segments?: TranscriptSegment[];

	// Established features
	wpm_per_speaker: Record<string, number>;
	mean_utterance_length: Record<string, number>;
	avg_word_length: Record<string, number>;
	adverb_ratio: Record<string, number>;
	flesch_kincaid: Record<string, number>;
	prp_ratio: Record<string, number>;
	num_unique_words: Record<string, number>;

	// AI features
	impoverished_vocabulary: Record<string, number>;
	word_finding_difficulties: Record<string, number>;
	semantic_paraphasias: Record<string, number>;
	syntactic_simplification: Record<string, number>;
	discourse_impairment: Record<string, number>;
}

export interface TranscriptSegment {
	duration: number;
	offset: number;
	speaker: string;
	text: string;
}