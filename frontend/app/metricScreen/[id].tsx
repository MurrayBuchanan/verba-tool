import { useState, useCallback, useMemo } from "react";
import { StyleSheet, ActivityIndicator, ScrollView, View } from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricChart as Chart} from "@/components/metric-chart";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/transcript";
import { getMetricProgression } from "@/utils/metric-progression";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { Colors } from "@/constants/theme";

export default function MetricScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const metricDetails = METRIC_DEFINITIONS[id];

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscripts() {
				try {
					setLoading(true);
					
					const data = await getTranscripts();
					setTranscripts(data);
					setError(null);
				} catch {
					setError("Unable to load metrics");
				} finally {
					setLoading(false);
				}
			}
			fetchTranscripts();
		}, [])
	);

	const metricData = useMemo(() => getMetricProgression(transcripts, id), [transcripts, id]);

	return (
		<ThemedView style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={Colors.light.tint} />
					<Text align="center">Loading data...</Text>
				</View>
			) : error ? (
				<View style={styles.center}>
					<Text align="center">{error}</Text>
				</View>
			) : metricData.length === 0 ? (
				<View style={styles.center}>
					<Text align="center">No data available yet. Record conversations to see progress over time.</Text>
				</View>
			) : (
				<ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<View>
						<Chart 
							data={metricData} 
							xAxisLabel={(value) => {
								const point = metricData.find(d => d.x === value);
								return point?.label || "";
							}}
							title={metricDetails.name}
						/>
					</View>

					<View>
						<Text type="heading">Description</Text>
						<Text>{metricDetails.description}</Text>
					</View>

				</ScrollView>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
		padding: 20,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
});