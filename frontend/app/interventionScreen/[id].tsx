import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useState, useCallback, useRef, useMemo, useLayoutEffect } from "react";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { MetricChart as Chart } from "@/components/metric-chart";
import { MetricSelector as Selector } from "@/components/metric-selector";
import { ChartToggle as Switch } from "@/components/chart-toggle";
import { TextField as TextField } from "@/components/textfield";
import { DatePicker as Picker } from "@/components/date-picker";
import { Intervention } from "@/constants/transcript";
import { getIntervention, updateIntervention, deleteIntervention } from "@/services/intervention-service";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/transcript";
import { getMetricProgression } from "@/utils/metric-progression";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { formatAPIDate } from "@/utils/date-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";


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
	const warningColour = useThemeColor({}, 'warning');
	const accentColour = useThemeColor({}, 'accent');
	const [intervention, setIntervention] = useState<any>(null);
	const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMetric, setSelectedMetric] = useState<string>("wpm_per_speaker");
	const [showMean, setShowMean] = useState<boolean>(true);
	const [showRange, setShowRange] = useState<boolean>(true);
	const loadedId = useRef<string | undefined>(undefined);

	const handleDeleteIntervention = useCallback(async () => {
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

	const handleUpdateIntervention = useCallback(async () => {
		if (!id || !editingIntervention) return;
		
		try {
			const interventionId = parseInt(id, 10);
			await updateIntervention(interventionId, editingIntervention);
			setIntervention(editingIntervention);
			setEditingIntervention(null);
		} catch (error) {
			Alert.alert("Cannot update intervention");
		}
	}, [id, editingIntervention]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity style={styles.button} onPress={handleDeleteIntervention}>
					<IconSymbol name="trash" size={24} color={warningColour} />
				</TouchableOpacity>
			),
		});
	}, [navigation, handleDeleteIntervention, warningColour]);

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
					<ActivityIndicator size="large" color={accentColour} />
					<Text align="center">Loading...</Text>
				</View>
			) : error ? (
				<View style={styles.center}>
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<Selector options={metricKeys} selectedValue={selectedMetric} onValueChange={setSelectedMetric} />
					{ metricData.length > 0 ? (
						<View style={styles.section}>
							<Chart 
								data={metricData} 
								xAxisLabel={(value) => {
									const point = metricData.find(d => d.x === value);
									return point?.label || "";
								}}
								title={`Changes to ${metricDetails.name} During Intervention`}
								showMean={showMean}
								showRange={showRange}
								showInterventions={false}
							/>
						</View>
					) : (
						<View style={styles.center}>
							<Text align="center">No data available for this metric within this intervention period.</Text>
						</View>
					)}
					
					<View style={styles.section}>
						<View style={styles.row}>
							<Text type="heading">Intervention Details</Text>
							<View style={styles.buttons}>
								{editingIntervention ? (
									<>
										<TouchableOpacity onPress={() => setEditingIntervention(null)}>
											<Text>Cancel</Text>
										</TouchableOpacity>
										<TouchableOpacity onPress={handleUpdateIntervention}>
											<Text style={{ color: accentColour }}>Update</Text>
										</TouchableOpacity>
									</>
								) : (
									<TouchableOpacity onPress={() => intervention && setEditingIntervention({ ...intervention })}>
										<Text style={{ color: accentColour }}>Edit</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>

						<TextField
							label="Name"
							value={editingIntervention ? (editingIntervention.name ?? "") : intervention.name}
							onChangeText={(text) => editingIntervention && setEditingIntervention({ ...editingIntervention, name: text })}
							editable={editingIntervention !== null}
						/>
						
						<Picker
							label="Start Date"
							value={editingIntervention ? new Date(editingIntervention.start_date) : new Date(intervention.start_date)}
							onDateChange={(date) => editingIntervention && setEditingIntervention({ ...editingIntervention, start_date: formatAPIDate(date)})}
							maximumDate={editingIntervention ? new Date(editingIntervention.end_date) : new Date(intervention.end_date)}
							editable={editingIntervention !== null}
						/>
						
						<Picker
							label="End Date"
							value={editingIntervention ? new Date(editingIntervention.end_date) : new Date(intervention.end_date)}
							onDateChange={(date) => editingIntervention && setEditingIntervention({ ...editingIntervention, end_date: formatAPIDate(date) })}
							minimumDate={editingIntervention ? new Date(editingIntervention.start_date) : new Date(intervention.start_date)}
							editable={editingIntervention !== null}
						/>
						
						<TextField
							label="Description"
							value={editingIntervention ? (editingIntervention.description ?? "") : (intervention.description || "")}
							onChangeText={(text) => editingIntervention && setEditingIntervention({ ...editingIntervention, description: text || null })}
							placeholder="No description"
							multiline
							editable={editingIntervention !== null}
						/>
					</View>
				
					<View style={styles.section}>
						<Text type="heading">Metric Description</Text>
						<View style={styles.spacer}>
							<Text>{metricDetails.description}</Text>
						</View>
					</View>

					{metricData.length > 0 && (
						<View style={styles.section}>
							<Switch label="Show Mean" value={showMean} onValueChange={setShowMean} />
							<Switch label="Show Range" value={showRange} onValueChange={setShowRange} />
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
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	buttons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
});