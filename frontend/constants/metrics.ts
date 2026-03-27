export type MetricDetails = {
	name: string;
	alias: string;
	description: string;
};

// Information is collected from various sources, and are not definitive, if productionised should be validated with a professional.
// • ASHA: https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/

export const CHART_DEFINITION = "This chart shows changes in language indicators over time. The centre line represents the individual's baseline score, while the upper and lower control limits show the expected range of variation. Scores may vary for many reasons, including external factors. The chart is intended to help distinguish normal fluctuations from potentially meaningful change by showing data points that fall outside the expected range or indicate trends of improvement or decline. An alert will appear when data points are outside the expected range, are increasing/decreasing, or remain above or below the baseline for a consecutive week. The alerts may be subject to false alarms, and should be treated as prompts for further review instead of evidence of change.";

export const METRIC_DEFINITIONS: Record<string, MetricDetails> = {
	words_per_minute: 
	{
		name: "Speech Rate",
		alias: "Shows how quickly the person is speaking.",
		description: "A higher score may suggest faster speech, which in some contexts can make speech harder to follow. A lower score may suggest slower or more effortful speech. This measure should be interpreted in context, as speaking rate can also vary due to topic, emotion, or time of day. ",
	},
	
	average_word_length: 
	{
		name: "Average Word Length",
		alias: "Shows the typical length of the words used.",
		description: "A higher score may suggest the use of longer or more complex words. A lower score may suggest the use of shorter words.",
	},
	
	adverb_ratio: 
	{
		name: "Adverb Ratio",
		alias: "Shows how often adverbs are used.",
		description: "A higher score suggests more frequent use of adverbs. A lower score suggests less frequent use of adverbs. This may reflect differences in style or sentence construction.",
	},
	
	flesch_kincaid_grade: 
	{
		name: "Flesch-Kincaid Grade",
		alias: "Shows how complex the language is based on sentence length and word complexity.",
		description: "A higher score suggests the use of longer sentences and words with more syllables, which indicates more complex language. A lower score suggests shorter sentences and simpler words. This is a readability score and should be interpreted as a rough indicator.",
	},
	personal_pronoun_ratio: 
	{
		name: "Pronoun Ratio",
		alias: "Shows how often pronouns are used instead of more specific nouns. ",
		description: "A higher score suggests more frequent use of pronouns, which in some contexts may make references less clear. A lower score suggests more frequent use of specific nouns, which may support clarity.",
	},
	
	number_of_unique_words: 
	{
		name: "Vocabulary Size",
		alias: "Shows the variety of words used",
		description: "A higher score suggests a wider range of vocabulary. A lower score suggests more repetition or a smaller range of words.",
	},
	impoverished_vocabulary: 
	{
		name: "Impoverished Vocabulary",
		alias: "Shows reliance on general or non-specific words.",
		description:
			"A higher score suggests more frequent use of vague or general terms such as “thing” or “stuff”. A lower score suggests more specific word choice.",
	},
	
	word_finding_difficulties: 
	{
		name: "Word Finding Difficulties",
		alias: "Shows potential difficulty in word finding.",
		description: "A higher score suggests more frequent signs of word-finding difficulties, such as pauses, circumlocution, or difficulty producing the intended word. A lower score suggests words are retrieved more easily and directly.",
	},
	
	semantic_paraphasias: 
	{
		name: "Semantic Paraphasias",
		alias: "Shows the use of semantically related but unintended words.",
		description: "A higher score suggests more frequent substitution of a related but incorrect word for the intended word. A lower score suggests fewer such semantic substitution errors. ",
	},
	
	syntactic_simplification: 
	{
		name: "Syntactic Simplification",
		alias: "Shows how simple the sentence structure is.",
		description: "A higher score suggests greater reliance on shorter, simpler sentence structures and less use of complex grammar. A lower score suggests a more varied and detailed conversation structure.",
	},
	
	discourse_impairment: 
	{
		name: "Discourse Impairment",
		alias: "Shows how well speech is organised and how easy it is to follow.",
		description: "A higher score suggests more difficulty with coherence, organisation, or adding conversation details. A lower score suggests clearer, more coherent, and easier-to-follow conversation. This measure reflects discourse quality broadly rather than a single language skill."
	}
};