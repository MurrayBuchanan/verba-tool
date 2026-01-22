import { StyleSheet, ActivityIndicator, ScrollView, View } from "react-native";
import { useState, useCallback, useRef, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricChart as Chart } from "@/components/metric-chart";
import { MetricSelector as Selector } from "@/components/metric-selector";
import { getIntervention } from "@/services/intervention-service";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/transcript";
import { getMetricProgression } from "@/utils/metric-progression";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { formatDisplayDate } from "@/utils/date-formatting";
import { Colors } from "@/constants/theme";
import { getUserId } from "@/services/authentication-service";

function filterByDate(transcripts: TranscriptWithFeatures[], startDate: string, endDate: string): TranscriptWithFeatures[] {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const result = [];
	
	for (let i = 0; i < transcripts.length; i++) {
		const transcript = transcripts[i];
		const date = new Date(transcript.created_at);
		if (date >= start && date <= end) {
			result.push(transcript);
		}
	}
	return result;
}

export default function InterventionDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [intervention, setIntervention] = useState<any>(null);
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMetric, setSelectedMetric] = useState<string>("wpm_per_speaker");
	const loadedId = useRef<string | undefined>(undefined);
	

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				try {
					if (loadedId.current === id) {
						return;
					}
					setLoading(true);
					const userId = await getUserId();
					const interventionId = parseInt(id, 10);

					const interventionData = await getIntervention(userId, interventionId);
					const transcriptsData = await getTranscripts(userId);
					
					setIntervention(interventionData);
					setTranscripts(transcriptsData);
					setError(null);
					loadedId.current = id;
				} catch {
					setError("Unable to load intervention");
				} finally {
					setLoading(false);
				}
			}
			fetchData();
		}, [id])
	);

	const filteredTranscripts = useMemo(() => {
		if (!intervention) {
			return [];
		}
		return filterByDate(transcripts, intervention.start_date, intervention.end_date);
	}, [transcripts, intervention]);

	const metricData = useMemo(() => {
		if (!filteredTranscripts.length) {
			return [];
		}
		return getMetricProgression(filteredTranscripts, selectedMetric);
	}, [filteredTranscripts, selectedMetric]);

	const metricDetails = METRIC_DEFINITIONS[selectedMetric];
	
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
					<Text align="center">Loading...</Text>
				</View>
			) : error ? (
				<View style={styles.center}>
					<Text align="center" lightColor="#B00020" darkColor="#CF6679">{error}</Text>
				</View>
			) : (
				<ScrollView 
					style={styles.container} 
					contentContainerStyle={styles.scrollContent} 
					showsVerticalScrollIndicator={false}
				>
					{filteredTranscripts.length === 0 ? (
						<View style={styles.center}>
							<Text align="center">No conversations found within this intervention period.</Text>
						</View>
					) : (
						<>
							<View>
								<Text type="heading">Metric</Text>
								<Selector
									options={metricKeys}
									selectedValue={selectedMetric}
									onValueChange={setSelectedMetric}
								/>
							</View>
							{metricData.length > 0 && (
								<View>
									<Chart 
										data={metricData} 
										xAxisLabel={(value) => {
											const point = metricData.find(d => d.x === value);
											return point?.label || "";
										}}
										title={`${metricDetails.name} Progression`}
									/>
								</View>
							)}
						</>
					)}
					
					{intervention && (
						<View>
							<Text type="heading">Intervention Details</Text>
							
							<View style={styles.spacer}>
								<Text type="caption">Start Date</Text>
								<Text type="caption">{formatDisplayDate(intervention.start_date)}</Text>
							</View>
							
							<View style={styles.spacer}>
								<Text type="caption">End Date</Text>
								<Text type="caption">{formatDisplayDate(intervention.end_date)}</Text>
							</View>
							
							{intervention.description && (
								<View style={styles.spacer}>
									<Text type="caption">Description</Text>
									<Text type="caption">{intervention.description}</Text>
								</View>
							)}
						</View>
					)}
					
				</ScrollView>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		padding: 20,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	spacer: {
		paddingVertical: 12,
	},
});