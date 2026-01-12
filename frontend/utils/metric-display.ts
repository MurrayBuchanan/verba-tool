import { Transcript } from "@/constants/transcript";

export type MetricDataPoint = {
	x: number;
	value: number;
	label: string;
	transcriptId: number;
};

export type MetricDetails = {
	name: string;
	description: string;
	usage: string;
};

export function getMetricProgression(transcripts: Transcript[], metricKey: string): MetricDataPoint[] {
	// Sort transcripts in order of creation
	const orderedTranscripts = [...transcripts].sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()).reverse();

	return orderedTranscripts.map((transcript, index) => {
		// Get the metric value from the transcript
		const metricValue = (transcript as any)[metricKey] as Record<string, number>;

		// Get speaker1's value (sorted alphabetically)
		// TODO: Implement flip feature for switching carer/speaker
		const speakerKeys = Object.keys(metricValue).sort();
		const speaker1Value = speakerKeys.length > 0 ? metricValue[speakerKeys[0]] : 0;

		return {
			x: index + 1,
			value: speaker1Value,
			label: `Conv ${transcript.transcript_id}`,
			transcriptId: transcript.transcript_id,
		};
	});
}


// Map metric keys to UI metric display names and descriptions of dementia benefits
export function getMetricDetails(metricKey: string): MetricDetails {
	const metricDetails: Record<string, MetricDetails> = {
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

	return metricDetails[metricKey];
}