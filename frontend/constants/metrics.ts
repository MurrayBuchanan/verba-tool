export type MetricDetails = {
	name: string;
	description: string;
	usage: string;
};

export const METRIC_DEFINITIONS: Record<string, MetricDetails> = {
	wpm_per_speaker: {
		name: "Words Per Minute",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	mean_utterance_length: {
		name: "Mean Utterance Length",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	avg_word_length: {
		name: "Average Word Length",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	adverb_ratio: {
		name: "Adverb Ratio",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	flesch_kincaid: {
		name: "Flesch-Kincaid Grade",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	prp_ratio: {
		name: "Pronoun Ratio",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	num_unique_words: {
		name: "Unique Words",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	impoverished_vocabulary: {
		name: "Impoverished Vocabulary",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	word_finding_difficulties: {
		name: "Word Finding Difficulties",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	semantic_paraphasias: {
		name: "Semantic Paraphasias",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	syntactic_simplification: {
		name: "Syntactic Simplification",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	discourse_impairment: {
		name: "Discourse Impairment",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
};