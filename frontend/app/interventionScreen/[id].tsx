import { StyleSheet, ActivityIndicator, ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { useState, useCallback, useRef, useMemo, useLayoutEffect } from "react";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricChart as Chart } from "@/components/metric-chart";
import { MetricSelector as Selector } from "@/components/metric-selector";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getIntervention, deleteIntervention } from "@/services/intervention-service";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/transcript";
import { getMetricProgression } from "@/utils/metric-progression";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { formatDisplayDate } from "@/utils/date-formatting";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
	const navigation = useNavigation();
	const colorScheme = useColorScheme() ?? 'light';
	const [intervention, setIntervention] = useState<any>(null);
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMetric, setSelectedMetric] = useState<string>("wpm_per_speaker");
	const loadedId = useRef<string | undefined>(undefined);

	const handleDelete = useCallback(async () => {
		if (!id) return;
		
		Alert.alert(
			"Delete Intervention",
			"Are you sure you want to delete this intervention?",
			[
				{
					text: "Cancel",
					style: "cancel"
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							const interventionId = parseInt(id, 10);
							await deleteIntervention(interventionId);
							router.back();
						} catch (error) {
							Alert.alert("Failed to delete intervention");
						}
					}
				}
			]
		);
	}, [id]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity 
					style={styles.button} 
					onPress={handleDelete}
				>
					<IconSymbol 
						name="trash" 
						size={24} 
						color={Colors[colorScheme].text} 
					/>
				</TouchableOpacity>
			),
		});
	}, [navigation, handleDelete, colorScheme]);

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				try {
					if (loadedId.current === id) {
						return;
					}
					setLoading(true);
					const interventionId = parseInt(id, 10);

					const interventionData = await getIntervention(interventionId);
					const transcriptsData = await getTranscripts();
					
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
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
								title={`Changes to ${metricDetails.name} During Intervention`}
							/>
						</View>
					) : (
						<View style={styles.center}>
							<Text align="center">No data available for this metric within this intervention period.</Text>
						</View>
					)}
					
					<View style={styles.section}>
						<Text type="heading">Intervention Details</Text>
						
						<View style={styles.spacer}>
							<Text>Start Date</Text>
							<Text type="caption">{formatDisplayDate(intervention.start_date)}</Text>
						</View>
						
						<View style={styles.spacer}>
							<Text>End Date</Text>
							<Text type="caption">{formatDisplayDate(intervention.end_date)}</Text>
						</View>
						
						
						<View style={styles.spacer}>
							<Text>Description</Text>
							<Text type="caption">{intervention.description || "No description"}</Text>
						</View>
					</View>
				
					<View style={styles.section}>
						<Text type="heading">Metric Description</Text>
						<View style={styles.spacer}>
							<Text>{metricDetails.description}</Text>
						</View>
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
	spacer: {
		paddingVertical: 12,
	},
	button: {
		marginRight: 10,
	},
});