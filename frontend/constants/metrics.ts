export type MetricDetails = {
	name: string;
	alias: string;
	description: string;
};


// Extracted features are from: 
// These are referenced in an SLT context here: https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/

export const CHART_DEFINITION = "This chart shows changes in language indicators over time, using a center line representing the average score, and upper and lower control limits representing the expected range of normal variation. Scores may vary due to external factors, however, this chart helps identify normal fluctuation from meaningful change by highlighting results outside the expected range or that demonstrate trends of improvement or decline.";

export const METRIC_DEFINITIONS: Record<string, MetricDetails> = {
	words_per_minute: 
	{
		name: "Speech Rate",
		alias: "How fast the person is speaking",
		description: "A high score means that the person is speaking very quickly, which may result in a lack of clarity in the speech and may even make the speech more difficult to understand. On the other hand, a low score may indicate that the person is speaking more slowly, which may be an indication of a lot of effort being exerted in speech planning, word-finding, and speech movement.",
	},
	
	average_word_length: 
	{
		name: "Average Word Length",
		alias: "How long or complex the words are",
		description: "A high score implies the person uses long and complex words, while a low score implies the person uses short and simple words, which may not be as accurate or detailed.",
	},
	
	adverb_ratio: 
	{
		name: "Adverb Ratio",
		alias: "How much descriptive detail is added (how, when, where)",
		description: "A higher number indicates that they are including more descriptions in sentences, although a high number could mean that they are including vague filler words, whereas a lower number means that they are including fewer descriptions.",
	},
	
	flesch_kincaid_grade: 
	{
		name: "Flesch-Kincaid Grade",
		alias: "How complex the sentences and vocabulary are",
		description: "A higher score means longer sentences and more complex words are being used, and therefore, the language used is more complex, while a lower score means shorter sentences and simpler words are being used.",
	},
	personal_pronoun_ratio: 
	{
		name: "Pronoun Ratio",
		alias: "Indicates the number of grammatical relationships, and signal social informations",
		description: "A higher score means pronouns are being used more frequently, and this might not add to the clarity of the text, as it might not be clear what the pronouns are referring to, while a lower score means more specific nouns are being used, and this can add more clarity to the text.",
	},
	
	number_of_unique_words: 
	{
		name: "Vocabulary Size",
		alias: "How varied many different words are being used",
		description: "A higher score suggests a wider range of vocabulary is being used, while a lower score suggests repetition of the same words, which may indicate a reduced range of vocabulary.",
	},
	impoverished_vocabulary: 
	{
		name: "Impoverished Vocabulary",
		alias: "How limited or general the word choices are",
		description:
			"A higher score suggests reliance on general, non-specific words (e.g., 'thing', 'stuff'), reducing precision and richness of communication, whereas a lower score suggests more specific and meaningful word choices.",
	},
	
	word_finding_difficulties: 
	{
		name: "Word Finding Difficulties",
		alias: "How hard it is to find the intended word",
		description:
			"A higher score suggests frequent pauses, searching for words, or talking around a word (circumlocution), whereas a lower score suggests words are retrieved more easily and directly.",
	},
	
	semantic_paraphasias: 
	{
		name: "Semantic Paraphasias",
		alias: "Using related but incorrect words",
		description: "A high score indicates the use of more general and less specific words which reduce percision, while a low score indicates the use of more specific and meaningful words.",
	},
	
	syntactic_simplification: 
	{
		name: "Syntactic Simplification",
		alias: "How simple the grammar and sentence structure are",
		description: "Higher scores suggest that the speaker may have trouble finishing sentences, pause frequently, or use circumlocution in their speech. Lower scores suggest that words are easily retrieved and used in speech.",
	},
	
	discourse_impairment: 
	{
		name: "Discourse Impairment",
		alias: "How well the person stays on topic and gets their message across",
		description: "Higher scores indicate that the speaker's speech may be hard to understand, jumping from one topic to another, or lack important details. Lower scores indicate that the speaker's speech is clear and easy to understand."
	}
};