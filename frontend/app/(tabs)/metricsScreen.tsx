import { StyleSheet, ScrollView, ActivityIndicator, View } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricItem as Item } from "@/components/metric-item";
import { getTranscripts } from "@/services/transcript-service";
import { useThemeColor } from "@/hooks/use-theme-color";
import { List } from "@/components/list";
import { Theme } from "@/constants/theme";

export default function MetricsScreen() {
	const router = useRouter();
	const warningColour = useThemeColor({}, 'warning');
	const accentColour = useThemeColor({}, 'accent');
	const [loading, setLoading] = useState(true);
	const [hasConversations, setHasConversations] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);

	useFocusEffect(
		useCallback(() => {
			async function checkConversations() {
				try {
					if (!hasInitiallyLoaded.current) {
						setLoading(true);
					}
					
					const transcripts = await getTranscripts();
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
		<ThemedView style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={accentColour} />
					<Text align="center">Loading...</Text>
				</View>
			) : error ? (
				<View style={styles.center}>
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : (!hasConversations) ? (
				<View style={styles.center}>
					<Text align="center">No metrics exist, record a conversation to see metrics!</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<Text type="heading" style={styles.categoryHeader}>Speech Rate & Fluency</Text>
					<ThemedView style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item metricId="wpm_per_speaker" onPress={() => router.push(`/metricScreen/wpm_per_speaker`)} />
							<Item metricId="mean_utterance_length" onPress={() => router.push(`/metricScreen/mean_utterance_length`)} />
						</List>
					</ThemedView>
					
					<Text type="heading" style={styles.categoryHeader}>Lexical & Vocabulary</Text>
					<ThemedView style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item metricId="num_unique_words" onPress={() => router.push(`/metricScreen/num_unique_words`)} />
							<Item metricId="avg_word_length" onPress={() => router.push(`/metricScreen/avg_word_length`)} />
							<Item metricId="impoverished_vocabulary" onPress={() => router.push(`/metricScreen/impoverished_vocabulary`)} />
							<Item metricId="word_finding_difficulties" onPress={() => router.push(`/metricScreen/word_finding_difficulties`)} />
						</List>
					</ThemedView>
					
					<Text type="heading" style={styles.categoryHeader}>Grammatical & Syntactic</Text>
					<ThemedView style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item metricId="prp_ratio" onPress={() => router.push(`/metricScreen/prp_ratio`)} />
							<Item metricId="adverb_ratio" onPress={() => router.push(`/metricScreen/adverb_ratio`)} />
							<Item metricId="syntactic_simplification" onPress={() => router.push(`/metricScreen/syntactic_simplification`)} />
						</List>
					</ThemedView>
					
					<Text type="heading" style={styles.categoryHeader}>Semantic Integrity</Text>
					<ThemedView style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item metricId="semantic_paraphasias" onPress={() => router.push(`/metricScreen/semantic_paraphasias`)} />
						</List>
					</ThemedView>
					
					<Text type="heading" style={styles.categoryHeader}>Discourse & Cognitive Load</Text>
					<ThemedView style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item metricId="flesch_kincaid" onPress={() => router.push(`/metricScreen/flesch_kincaid`)} />
							<Item metricId="discourse_impairment" onPress={() => router.push(`/metricScreen/discourse_impairment`)} />
						</List>
					</ThemedView>
				</ScrollView>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
	content: {
		paddingVertical: 20,
		paddingBottom: 40,
		flexGrow: 1,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	section: {
		paddingHorizontal: 20,
		borderRadius: 20,
		marginBottom: 20,
	},
	categoryHeader: {
		paddingVertical: 10,
	}
});