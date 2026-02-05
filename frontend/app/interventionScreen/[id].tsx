import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useCallback, useRef, useMemo, useLayoutEffect } from "react";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { Trash, Pencil, X, Check } from "lucide-react-native";
import { Divider } from "@/components/divider"
import { MetricChart as Chart } from "@/components/metric-chart";
import { MetricSelector } from "@/components/metric-selector";
import { AnnotationSelector } from "@/components/annotation-selector";
import { ChartToggle as Switch } from "@/components/chart-toggle";
import { TextField as TextField } from "@/components/textfield";
import { DatePicker as Picker } from "@/components/date-picker";
import { Intervention } from "@/constants/transcript";
import { getIntervention, updateIntervention, deleteIntervention } from "@/services/intervention-service";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/transcript";
import { getMetricProgression } from "@/utils/metric-progression";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { formatAPIDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { IconButton } from "@/components/icon-button";

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
	const [annotationView, setAnnotationView] = useState<string>("details");
	const [showMean, setShowMean] = useState<boolean>(true);
	const [showRange, setShowRange] = useState<boolean>(true);
	const loadedId = useRef<string | undefined>(undefined);

	const handleDeleteIntervention = useCallback(async () => {
		if (!id) return;
		
		Alert.alert(
			"Delete Annotation",
			"Are you sure you want to delete this annotation?",
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
							Alert.alert("Failed to delete annotation");
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
			Alert.alert("Cannot update annotation");
		}
	}, [id, editingIntervention]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<IconButton icon={<Trash size={24} color={warningColour} />} onPress={handleDeleteIntervention} />
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
					setError("Unable to load annotation");
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

	const annotationViewOptions = useMemo(() => [
		{ label: "Annotation", value: "details" },
		{ label: "What This Shows", value: "description" },
	], []);
	
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
				<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
					<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
						<MetricSelector views={metricKeys} selectedValue={selectedMetric} onValueChange={setSelectedMetric} />
					{ metricData.length > 0 ? (
						<View style={styles.section}>
							<Chart 
								data={metricData} 
								xAxisLabel={(value) => {
									const point = metricData.find(d => d.x === value);
									return point?.label || "";
								}}
								title={`Changes to ${metricDetails.name}\nDuring Annotation`}
								showMean={showMean}
								showRange={showRange}
								showInterventions={false}
							/>
						</View>
					) : (
						<View style={styles.center}>
							<Text align="center">No data available for this metric within this annotation period.</Text>
						</View>
					)}

					<View style={styles.section}>
					<AnnotationSelector options={annotationViewOptions} selectedValue={annotationView} onValueChange={setAnnotationView} />
					
					<View style={styles.annotationViewContainer}>
						{annotationView === "details" && (
							<>
								<View style={styles.row}>
									<Text type="heading">Annotation Details</Text>
									<View style={styles.buttons}>
										{editingIntervention ? (
											<>
												<IconButton icon={<X size={22} color={warningColour} />} onPress={() => setEditingIntervention(null)} accessibilityLabel="Cancel" />
												<IconButton icon={<Check size={22} color={accentColour} />} onPress={handleUpdateIntervention} accessibilityLabel="Update" />
											</>
										) : (
											<IconButton icon={<Pencil size={22} color={accentColour} />} onPress={() => intervention && setEditingIntervention({ ...intervention })} accessibilityLabel="Edit" />
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
							</>
						)}

						{annotationView === "description" && (
							<>
								<Text type="heading">Annotation Description</Text>
								<View>
									<Text>{metricDetails.alias}</Text>
									<Text>{metricDetails.description}</Text>
								</View>
							</>
						)}
					</View>

						<Divider />

						{metricData.length > 0 && (
							<View>
								<Switch label="Show Mean" value={showMean} onValueChange={setShowMean} />
								<Switch label="Show Range" value={showRange} onValueChange={setShowRange} />
							</View>
						)}
					</View>
					</ScrollView>
				</KeyboardAvoidingView>
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
	annotationViewContainer: {
		minHeight: 420,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
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
	},
	section: {
		paddingVertical: 10,
		marginHorizontal: 20,
	},
});