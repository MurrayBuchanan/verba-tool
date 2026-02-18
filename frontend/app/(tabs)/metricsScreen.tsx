import { StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { Item } from "@/components/list-item";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { getTranscripts } from "@/services/transcript-service";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";
import { List } from "@/components/list";
import { Theme } from "@/constants/theme";
import { AlertCircle, ChartLine } from "lucide-react-native";

export default function MetricsScreen() {
	const router = useRouter();
	const { profileId } = useProfile();
	const warningColour = useThemeColor({}, 'warning');
	const iconColour = useThemeColor({}, 'icon');
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
					
					const transcripts = await getTranscripts(profileId);
					setHasConversations(transcripts.length > 0);
					setError(null);
					hasInitiallyLoaded.current = true;
				} catch {
					setError("Unable to load indicators");
					setHasConversations(false);
				} finally {
					setLoading(false);
				}
			}
			checkConversations();
		}, [profileId])
	);

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={iconColour} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warningColour} style={styles.placeholder} />
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : (!hasConversations) ? (
				<View style={styles.center}>
					<ChartLine size={36} color={iconColour} style={styles.placeholder} />
					<Text align="center">No indicators exist, record a conversation to see indicators!</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<Text type="heading" style={styles.categoryHeader}>Speech Rate</Text>
					<View style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item name={METRIC_DEFINITIONS.wpm_per_speaker.name} subtitle={METRIC_DEFINITIONS.wpm_per_speaker.alias} onPress={() => router.push(`/metricScreen/wpm_per_speaker`)} />
						</List>
					</View>
					
					<Text type="heading" style={styles.categoryHeader}>Lexical & Vocabulary</Text>
					<View style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item name={METRIC_DEFINITIONS.num_unique_words.name} subtitle={METRIC_DEFINITIONS.num_unique_words.alias} onPress={() => router.push(`/metricScreen/num_unique_words`)} />
							<Item name={METRIC_DEFINITIONS.avg_word_length.name} subtitle={METRIC_DEFINITIONS.avg_word_length.alias} onPress={() => router.push(`/metricScreen/avg_word_length`)} />
							<Item name={METRIC_DEFINITIONS.impoverished_vocabulary.name} subtitle={METRIC_DEFINITIONS.impoverished_vocabulary.alias} onPress={() => router.push(`/metricScreen/impoverished_vocabulary`)} />
							<Item name={METRIC_DEFINITIONS.word_finding_difficulties.name} subtitle={METRIC_DEFINITIONS.word_finding_difficulties.alias} onPress={() => router.push(`/metricScreen/word_finding_difficulties`)} />
						</List>
					</View>
					
					<Text type="heading" style={styles.categoryHeader}>Grammatical & Syntactic</Text>
					<View style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item name={METRIC_DEFINITIONS.prp_ratio.name} subtitle={METRIC_DEFINITIONS.prp_ratio.alias} onPress={() => router.push(`/metricScreen/prp_ratio`)} />
							<Item name={METRIC_DEFINITIONS.adverb_ratio.name} subtitle={METRIC_DEFINITIONS.adverb_ratio.alias} onPress={() => router.push(`/metricScreen/adverb_ratio`)} />
							<Item name={METRIC_DEFINITIONS.syntactic_simplification.name} subtitle={METRIC_DEFINITIONS.syntactic_simplification.alias} onPress={() => router.push(`/metricScreen/syntactic_simplification`)} />
						</List>
					</View>
					
					<Text type="heading" style={styles.categoryHeader}>Semantic Integrity</Text>
					<View style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item name={METRIC_DEFINITIONS.semantic_paraphasias.name} subtitle={METRIC_DEFINITIONS.semantic_paraphasias.alias} onPress={() => router.push(`/metricScreen/semantic_paraphasias`)} />
						</List>
					</View>
					
					<Text type="heading" style={styles.categoryHeader}>Discourse & Cognitive Load</Text>
					<View style={styles.section} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<List divider={true}>
							<Item name={METRIC_DEFINITIONS.flesch_kincaid.name} subtitle={METRIC_DEFINITIONS.flesch_kincaid.alias} onPress={() => router.push(`/metricScreen/flesch_kincaid`)} />
							<Item name={METRIC_DEFINITIONS.discourse_impairment.name} subtitle={METRIC_DEFINITIONS.discourse_impairment.alias} onPress={() => router.push(`/metricScreen/discourse_impairment`)} />
						</List>
					</View>
				</ScrollView>
			)}
		</View>
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
	placeholder: {
		marginBottom: 16,
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