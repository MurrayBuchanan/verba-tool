import { StyleSheet, View, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useCallback, useMemo, useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { Trash, Pencil, AlertCircle } from "lucide-react-native";
import { MetricChart as Chart } from "@/components/metric-chart";
import { MetricSelector } from "@/components/metric-selector";
import { AnnotationSelector } from "@/components/annotation-selector";
import { ChartToggle as Switch } from "@/components/chart-toggle";
import { getIntervention, deleteIntervention } from "@/services/intervention-service";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/interfaces";
import { getMetricProgression } from "@/utils/metric-progression";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { formatDisplayDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";
import { IconButton } from "@/components/icon-button";
import { List } from "@/components/list";

function filterByDate(transcripts: TranscriptWithFeatures[], startDate: string, endDate: string): TranscriptWithFeatures[] {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const dates = [];
	
	for (let i = 0; i < transcripts.length; i++) {
		const transcript = transcripts[i];
		const date = new Date(transcript.created_at);
		if (date >= start && date <= end) {
			dates.push(transcript);
		}
	}
	return dates;
}

export default function InterventionDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const navigation = useNavigation();
	const { profileId } = useProfile();
	const warningColour = useThemeColor({}, 'warning');
	const accentColour = useThemeColor({}, 'accent');
	const iconColour = useThemeColor({}, 'icon');
	const sectionBackground = useThemeColor({}, 'background');
	const secondaryBackground = useThemeColor({}, 'backgroundSecondary');
	const borderColour = useThemeColor({}, 'backgroundTertiary');
	const [intervention, setIntervention] = useState<any>(null);
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMetric, setSelectedMetric] = useState<string>("wpm_per_speaker");
	const [annotationView, setAnnotationView] = useState<string>("annotation");
	const [showMean, setShowMean] = useState<boolean>(true);
	const [showStandardDeviation, setShowStandardDeviation] = useState<boolean>(true);

	const handleDeleteIntervention = useCallback(() => {
		Alert.alert("Delete Annotation", "Are you sure you want to delete this annotation?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						await deleteIntervention(parseInt(id, 10));
						router.back();
					} catch {
						Alert.alert("Failed to delete annotation");
					}
				},
			},
		]);
	}, [id]);

	const handleUpdateIntervention = useCallback(() => {
		router.push({ pathname: "/editInterventionModal", params: { id } });
	}, [id]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (<IconButton icon={<Trash size={22} color={warningColour} />} onPress={handleDeleteIntervention} accessibilityLabel="Delete Annotation" />),
		});
	}, [navigation, handleDeleteIntervention, warningColour]);

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				try {
					setLoading(true);
					const interventionId = parseInt(id, 10);

					const interventionData = await getIntervention(interventionId);
					const transcriptsData = await getTranscripts(profileId);

					setIntervention(interventionData);
					setTranscripts(transcriptsData);
					setError(null);
				} catch {
					setError("Unable to load annotation");
				} finally {
					setLoading(false);
				}
			}
			fetchData();
		}, [id, profileId])
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
			{ label: "Annotation Details", value: "annotation" },
			{ label: "Indicator Information", value: "metric" },
		], []
	);

	return (
		<ThemedView style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={iconColour} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warningColour} style={styles.placeholder} />
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : (
				<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
					<View style={[styles.quickSelectHeader, { backgroundColor: sectionBackground, borderTopColor: borderColour, borderBottomColor: borderColour }]}>
						<MetricSelector
							views={metricKeys}
							selectedValue={selectedMetric}
							onValueChange={setSelectedMetric}
						/>
					</View>
					<ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
						{metricData.length > 0 ? (
							<View style={styles.section}>
								<Chart
									data={metricData}
									xAxisLabel={(value) => {
										const point = metricData.find(data => data.x === value); 
										return point?.label ?? ""; 
									}}
									title={`Changes to ${metricDetails.name} during annotation`}
									showMean={showMean}
									showRange={showStandardDeviation}
									showInterventions={false}
								/>
							</View>
						) : (
							<View style={styles.center}>
								<Text align="center">No data available for this indicator within this annotation period.</Text>
							</View>
						)}

						<View>
							<AnnotationSelector views={annotationViewOptions} selectedValue={annotationView} onValueChange={setAnnotationView} />
								{annotationView === "annotation" ? (
								<View style={[styles.section, { backgroundColor: secondaryBackground }]}>
									<View style={styles.detailsRow}>
										<Text type="heading">Annotation Details</Text>
										<IconButton icon={<Pencil size={22} color={accentColour} />} onPress={handleUpdateIntervention} accessibilityLabel="Edit" />
									</View>
									<Text type="strong">Annotation Name</Text>
									<Text type="caption">{intervention.name}</Text>
									{ intervention.description && 
										<>
											<Text type="strong">Description</Text>
											<Text>{intervention.description}</Text> 
										</> 
									}
									{ intervention.goals && 
										<>
											<Text type="strong">Goals</Text>
											<Text>{intervention.goals}</Text> 
										</> 
									}
									<Text type="strong">Success</Text>
									<Text type="caption">{intervention.success ? "Yes" : "No"}</Text>
									<Text type="strong">Start Date</Text>
									<Text type="caption">{formatDisplayDate(intervention.start_date)}</Text>
									<Text type="strong">End Date</Text>
									<Text type="caption">{formatDisplayDate(intervention.end_date)}</Text>
								</View>
							) : (
								<View style={[styles.section, { backgroundColor: secondaryBackground }]}>
									<View style={styles.detailsRow}>
										<Text type="heading">Indicator Information</Text>
									</View>
									<Text type="strong">What Does this Mean?</Text>
									<Text type="caption">{metricDetails.alias}</Text>
									<Text type="strong">Description</Text>
									<Text type="caption">{metricDetails.description}</Text>
								</View>
							)}
						</View>

						{metricData.length > 0 && (
							<View style={[styles.section, { backgroundColor: secondaryBackground }]}>
								<Text type="heading">Chart Controls</Text>
								<List divider>
									<Switch label="Show Mean" value={showMean} onValueChange={setShowMean} />
									<Switch label="Show Standard Deviation" value={showStandardDeviation} onValueChange={setShowStandardDeviation} />
								</List>
							</View>
						)}
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
	quickSelectHeader: {
		paddingVertical: 8,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	content: {
		flexGrow: 1,
		paddingBottom: 10,
	},
	section: {
		marginHorizontal: 20,
		marginVertical: 10,
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 30,
		gap: 14,
		borderRadius: 16
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
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	detailsRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: 48,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
	},
});