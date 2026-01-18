import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricItem as Item } from "@/components/metric-item";
import { List } from "@/components/list";
import { getTranscripts } from "@/services/transcript-service";
import { getUserId } from "@/services/authentication-service";

export default function MetricsScreen() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [hasConversations, setHasConversations] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);

	useFocusEffect(
		useCallback(() => {
			async function checkConversations() {
				try {
					// Only show loading on initial load
					if (!hasInitiallyLoaded.current) {
						setLoading(true);
					}
					
					const userId = await getUserId();
					const transcripts = await getTranscripts(userId);
					setHasConversations(transcripts.length > 0);
					setError(null);
					hasInitiallyLoaded.current = true;
				} catch (error: any) {
					setError("Unable to load metrics");
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
			<ScrollView 
				style={styles.scrollView} 
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{loading ? (
					<View style={styles.center}>
						<ActivityIndicator size="large" color="#B8CDF7" />
					</View>
				) : error ? (
					<View style={styles.center}>
						<Text align="center" lightColor="#B00020" darkColor="#CF6679">{error}</Text>
					</View>
				) : (!hasConversations) ? (
					<View style={styles.center}>
						<Text align="center">No metrics exist, record a conversation to see metrics!</Text>
					</View>
				) : (
					<List>
						<View style={styles.categorySection}>
							<Text type="heading" style={styles.categoryHeader}>Speech Rate & Fluency</Text>
							<View style={styles.metricsRow}>
								<Item metricId="wpm_per_speaker" onPress={() => router.push(`/metricScreen/wpm_per_speaker`)} />
								<Item metricId="mean_utterance_length" onPress={() => router.push(`/metricScreen/mean_utterance_length`)} />
							</View>
						</View>
						
						<View style={styles.categorySection}>
							<Text type="heading" style={styles.categoryHeader}>Lexical & Vocabulary</Text>
							<View style={styles.metricsRow}>
								<Item metricId="num_unique_words" onPress={() => router.push(`/metricScreen/num_unique_words`)} />
								<Item metricId="avg_word_length" onPress={() => router.push(`/metricScreen/avg_word_length`)} />
								<Item metricId="impoverished_vocabulary" onPress={() => router.push(`/metricScreen/impoverished_vocabulary`)} />
								<Item metricId="word_finding_difficulties" onPress={() => router.push(`/metricScreen/word_finding_difficulties`)} />
							</View>
						</View>
						
						<View style={styles.categorySection}>
							<Text type="heading" style={styles.categoryHeader}>Grammatical & Syntactic</Text>
							<View style={styles.metricsRow}>
								<Item metricId="prp_ratio" onPress={() => router.push(`/metricScreen/prp_ratio`)} />
								<Item metricId="adverb_ratio" onPress={() => router.push(`/metricScreen/adverb_ratio`)} />
								<Item metricId="syntactic_simplification" onPress={() => router.push(`/metricScreen/syntactic_simplification`)} />
							</View>
						</View>
						
						<View style={styles.categorySection}>
							<Text type="heading" style={styles.categoryHeader}>Semantic Integrity</Text>
							<View style={styles.metricsRow}>
								<Item metricId="semantic_paraphasias" onPress={() => router.push(`/metricScreen/semantic_paraphasias`)} />
							</View>
						</View>
						
						<View style={styles.categorySection}>
							<Text type="heading" style={styles.categoryHeader}>Discourse & Cognitive Load</Text>
							<View style={styles.metricsRow}>
								<Item metricId="flesch_kincaid" onPress={() => router.push(`/metricScreen/flesch_kincaid`)} />
								<Item metricId="discourse_impairment" onPress={() => router.push(`/metricScreen/discourse_impairment`)} />
							</View>
						</View>
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
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingVertical: 20,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	categorySection: {
		marginBottom: 24,
	},
	categoryHeader: {
		marginBottom: 12,
		marginTop: 8,
		fontWeight: "600",
	},
	metricsRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
});
