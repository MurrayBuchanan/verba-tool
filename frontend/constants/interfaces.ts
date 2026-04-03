export interface Profile {
	id?: number;
	first_name: string;
	last_name: string;
	description: string | null;
	picture_url?: string | null;
}

export interface TranscriptMetadata {
	id: number;
	user_id?: string;
	profile_id: number;
	created_at: string;
	total_duration: number;
}

export interface TranscriptFeatures {
	words_per_minute: Record<string, number>;
	average_word_length: Record<string, number>;
	adverb_ratio: Record<string, number>;
	flesch_kincaid_grade: Record<string, number>;
	personal_pronoun_ratio: Record<string, number>;
	number_of_unique_words: Record<string, number>;
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

// Combines transcript metadata and features for visualisation of all transcripts
export interface TranscriptWithFeatures extends TranscriptMetadata, TranscriptFeatures{}

// Combines transcript metadata and segments for viewing single transcript
export interface TranscriptWithSegments extends TranscriptMetadata {
	segments: TranscriptSegment[];
}

export interface Intervention {
	id?: number;
	profile_id: number;
	name: string;
	description: string | null;
	goals: string | null;
	success: boolean | null;
	start_date: string;
	end_date: string;
}