import { useState, useCallback, useMemo, useEffect } from "react";
import { StyleSheet, ActivityIndicator, ScrollView, View } from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricChart as Chart} from "@/components/metric-chart";
import { MetricSelector as Selector } from "@/components/metric-selector";
import { getTranscripts } from "@/services/transcript-service";
import { getInterventions } from "@/services/intervention-service";
import { TranscriptWithFeatures, Intervention } from "@/constants/transcript";
import { getMetricProgression } from "@/utils/metric-progression";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { Colors } from "@/constants/theme";

export default function MetricScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [interventions, setInterventions] = useState<Intervention[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMetric, setSelectedMetric] = useState<string>(id || "wpm_per_speaker");
	const metricDetails = METRIC_DEFINITIONS[selectedMetric];

	useEffect(() => {
		if (id && METRIC_DEFINITIONS[id]) {
			setSelectedMetric(id);
		}
	}, [id]);

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				try {
					setLoading(true);
					
					const [transcriptsData, interventionsData] = await Promise.all([
						getTranscripts(),
						getInterventions()
					]);
					
					setTranscripts(transcriptsData);
					setInterventions(interventionsData);
					setError(null);
				} catch {
					setError("Unable to load metrics");
				} finally {
					setLoading(false);
				}
			}
			fetchData();
		}, [])
	);

	const metricData = useMemo(() => getMetricProgression(transcripts, selectedMetric), [transcripts, selectedMetric]);

	const metricKeys = useMemo(() => {
		return Object.keys(METRIC_DEFINITIONS).map((metricKey) => ({
			label: METRIC_DEFINITIONS[metricKey].name,
			value: metricKey,
		}));
	}, []);

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
			) : (
				<ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<Selector
						options={metricKeys}
						selectedValue={selectedMetric}
						onValueChange={setSelectedMetric}
					/>
					
					{ metricData.length > 0 ? (
						<View style={styles.section}>
							<Chart 
								data={metricData} 
								xAxisLabel={(value) => {
									const point = metricData.find(d => d.x === value);
									return point?.label || "";
								}}
								title={`Changes to ${metricDetails.name}`}
								interventions={interventions}
							/>
						</View>
					) : (
						<View style={styles.center}>
							<Text align="center">No data available for this metric yet. Record conversations to see progress over time.</Text>
						</View>
					)}

					<View style={styles.section}>
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
	},
	section: {
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
});