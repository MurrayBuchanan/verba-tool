import { Transcript } from "@/constants/transcript";

export type MetricDataPoint = {
	x: number;
	value: number;
	label: string;
	transcriptId: number;
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

// Map metric keys to UI metric display names
// TODO: Add descriptions and information about each metric
export function getMetricDisplayName(metricKey: string): string {
	const metricNames: Record<string, string> = {
		wpm_per_speaker: "Words Per Minute",
		mean_utterance_length: "Mean Utterance Length",
		avg_word_length: "Average Word Length",
		adverb_ratio: "Adverb Ratio",
		flesch_kincaid: "Flesch-Kincaid Grade",
		prp_ratio: "Pronoun Ratio",
		num_unique_words: "Unique Words",
		impoverished_vocabulary: "Impoverished Vocabulary",
		word_finding_difficulties: "Word Finding Difficulties",
		semantic_paraphasias: "Semantic Paraphasias",
		syntactic_simplification: "Syntactic Simplification",
		discourse_impairment: "Discourse Impairment",
	};

	return metricNames[metricKey] || metricKey;
}