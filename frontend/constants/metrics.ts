export type MetricDetails = {
	name: string;
	alias: string;
	description: string;
};

export const METRIC_DEFINITIONS: Record<string, MetricDetails> = {
	wpm_per_speaker: {
		name: "Words Per Minute",
		alias: "How fast someone is speaking",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
	},
	avg_word_length: {
		name: "Average Word Length",
		alias: "How complex the words are",
		description: "Content coming soon",
	},
	adverb_ratio: {
		name: "Adverb Ratio",
		alias: "How often describing words are used",
		description: "Content coming soon",
	},
	flesch_kincaid: {
		name: "Flesch-Kincaid Grade",
		alias: "How complex the sentences and vocabulary are",
		description: "Content coming soon",
	},
	prp_ratio: {
		name: "Pronoun Ratio",
		alias: "How often personal pronouns are used",
		description: "Content coming soon",
	},
	num_unique_words: {
		name: "Unique Words",
		alias: "How varied the vocabulary is",
		description: "Content coming soon",
	},
	impoverished_vocabulary: {
		name: "Impoverished Vocabulary",
		alias: "Limited range of words used",
		description: "Content coming soon",
	},
	word_finding_difficulties: {
		name: "Word Finding Difficulties",
		alias: "Struggling to get the right words",
		description: "Content coming soon",
	},
	semantic_paraphasias: {
		name: "Semantic Paraphasias",
		alias: "Using related but wrong words",
		description: "Content coming soon",
	},
	syntactic_simplification: {
		name: "Syntactic Simplification",
		alias: "More simple grammar and shorter sentences",
		description: "Content coming soon",
	},
	discourse_impairment: {
		name: "Discourse Impairment",
		alias: "Difficulty staying on topic or making conversation",
		description: "Content coming soon",
	},
};