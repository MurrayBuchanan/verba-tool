import { StyleSheet, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricItem } from "@/components/metric-item";
import { List } from "@/components/list";
import { FadedScrollView as ScrollView} from "@/components/faded-scroll-view";
import { getTranscripts } from "@/services/transcript-service";

// TODO: Change to authenticated user's id
const USER_ID = 1;

const all_metrics = [
	{ id: "wpm_per_speaker" },
	{ id: "mean_utterance_length" },
	{ id: "avg_word_length" },
	{ id: "adverb_ratio" },
	{ id: "flesch_kincaid" },
	{ id: "prp_ratio" },
	{ id: "num_unique_words" },
	{ id: "impoverished_vocabulary" },
	{ id: "word_finding_difficulties" },
	{ id: "semantic_paraphasias" },
	{ id: "syntactic_simplification" },
	{ id: "discourse_impairment" },
];

export default function MetricsScreen() {
	const [loading, setLoading] = useState(true);
	const [hasConversations, setHasConversations] = useState(false);

	useFocusEffect(
		useCallback(() => {
			async function checkConversations() {
				try {
					const transcripts = await getTranscripts(USER_ID);
					setHasConversations(transcripts.length > 0);
				} catch (error) {
					console.error("Failed to check transcripts:", error);
					setHasConversations(false);
				} finally {
					setLoading(false);
				}
			}
			checkConversations();
		}, [])
	);

  	return (
		<View style={styles.container}>
			<Text type="title">Metrics</Text>
			<ScrollView>
				{loading ? (
					<View style={styles.center}>
						<ActivityIndicator size="large" color="#B8CDF7" />
					</View>
				) : (!hasConversations || all_metrics.length === 0) ? (
					<View style={styles.center}>
						<Text>No metrics exist, record a conversation to see metrics!</Text>
					</View>
				) : (
					<List>
						{all_metrics.map((metric) => (
							<MetricItem key={metric.id} metricId={metric.id} />
						))}
					</List>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
});
