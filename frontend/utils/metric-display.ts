import { Transcript } from "@/constants/transcript";

// TODO: Implement flip feature for switching carer/speaker

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
	const sortedTranscripts = [...transcripts].sort((a, b) => a.transcript_id - b.transcript_id);

	const metricDataPoints: MetricDataPoint[] = [];
	
	for (let i = 0; i < sortedTranscripts.length; i++) {
		const transcript = sortedTranscripts[i];
		
		// Get the metric value from the transcript
		const metricValue = (transcript as any)[metricKey] as Record<string, number>;

		// Get speaker 1 values
		const speakerNames = Object.keys(metricValue).sort();
		const firstSpeakerValue = speakerNames.length > 0 ? metricValue[speakerNames[0]] : 0;

		metricDataPoints.push({
			x: i + 1,
			value: firstSpeakerValue,
			label: `Conv ${transcript.transcript_id}`,
			transcriptId: transcript.transcript_id,
		});
	}

	return metricDataPoints;
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