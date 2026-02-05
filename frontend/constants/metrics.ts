export type MetricDetails = {
	name: string;
	alias: string;
	description: string;
	usage: string;
};

export const METRIC_DEFINITIONS: Record<string, MetricDetails> = {
	wpm_per_speaker: {
		name: "Words Per Minute",
		alias: "How fast someone is speaking",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	mean_utterance_length: {
		name: "Mean Utterance Length",
		alias: "How long phrases or sentences are",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	avg_word_length: {
		name: "Average Word Length",
		alias: "How complex the words are",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	adverb_ratio: {
		name: "Adverb Ratio",
		alias: "How often describing words are used",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	flesch_kincaid: {
		name: "Flesch-Kincaid Grade",
		alias: "How complex the sentences and vocabulary are",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	prp_ratio: {
		name: "Pronoun Ratio",
		alias: "How often personal pronouns are used",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	num_unique_words: {
		name: "Unique Words",
		alias: "How varied the vocabulary is",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	impoverished_vocabulary: {
		name: "Impoverished Vocabulary",
		alias: "Limited range of words used",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	word_finding_difficulties: {
		name: "Word Finding Difficulties",
		alias: "Struggling to get the right words",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	semantic_paraphasias: {
		name: "Semantic Paraphasias",
		alias: "Using related but wrong words",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	syntactic_simplification: {
		name: "Syntactic Simplification",
		alias: "More simple grammar and shorter sentences",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
	discourse_impairment: {
		name: "Discourse Impairment",
		alias: "Difficulty staying on topic or making conversation",
		description: "Content coming soon",
		usage: "Content coming soon",
	},
};