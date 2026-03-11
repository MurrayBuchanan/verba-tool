import { StyleSheet, View, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useCallback, useMemo, useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { AlertCircle, Pencil, Trash } from "lucide-react-native";
import { MetricChart as Chart } from "@/components/metric-chart";
import { MetricSelector } from "@/components/metric-selector";
import { InformationSelector } from "@/components/information-selector";
import { ChartToggle as Switch } from "@/components/chart-toggle";
import { useProfile } from "@/context/ProfileContext";
import { getIntervention, deleteIntervention } from "@/services/intervention-service";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/interfaces";
import { getMetricProgression } from "@/utils/chart-grouping";
import { CHART_DEFINITION, METRIC_DEFINITIONS } from "@/constants/metrics";
import { formatDisplayDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { IconButton } from "@/components/icon-button";;
import { Divider } from "@/components/divider";

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
	const [intervention, setIntervention] = useState<any>(null);
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMetric, setSelectedMetric] = useState<string>("words_per_minute");
	const [interventionView, setInterventionView] = useState<string>("intervention");
	const [showMean, setShowMean] = useState<boolean>(true);
	const [showStandardDeviation, setShowStandardDeviation] = useState<boolean>(true);
	const warning = useThemeColor({}, 'warning');
	const accent = useThemeColor({}, 'accent');
	const icon = useThemeColor({}, 'icon');
	const background = useThemeColor({}, 'background');
	const secondaryBackground = useThemeColor({}, 'backgroundSecondary');
	const border = useThemeColor({}, 'backgroundTertiary');

	const handleDeleteIntervention = useCallback(() => {
		Alert.alert("Delete Intervention", "Are you sure you want to delete this intervention?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						await deleteIntervention(parseInt(id, 10));
						router.back();
					} catch {
						Alert.alert("Failed to delete intervention");
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
			headerRight: () => (<IconButton icon={<Trash size={22} color={warning} />} onPress={handleDeleteIntervention} accessibilityLabel="Delete Intervention" />),
		});
	}, [navigation, handleDeleteIntervention, warning]);

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
					setError("Unable to load intervention");
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

	const chartData = useMemo(() => {
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

	const interventionViewOptions = useMemo(() => [
			{ label: "Intervention Details", value: "intervention" },
			{ label: "Indicator Information", value: "metric" },
		], []
	);

	return (
		<ThemedView style={styles.container}>
			{ loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="small" color={icon} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warning} style={styles.placeholder} />
					<Text align="center" style={{ color: warning }}>{error}</Text>
				</View>
			) : (
				<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
					<View style={[styles.quickSelectHeader, { backgroundColor: background, borderTopColor: border, borderBottomColor: border }]}>
						<MetricSelector views={metricKeys} selectedValue={selectedMetric} onValueChange={setSelectedMetric} />
					</View>
					<ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
						{ chartData.length > 0 ? (
							<View style={[styles.section, styles.chart]}>
								{/* Chart configuration */}
								<Chart
									data={chartData}
									title={`Changes to ${metricDetails.name} During Intervention Period`}
									showMean={showMean}
									showRange={showStandardDeviation}
									showInterventions={false}
								/>
							</View>
						) : (
							<View style={styles.center}>
								<Text align="center">No data available for this indicator within this intervention period.</Text>
							</View>
						)}

						<View>
							<InformationSelector views={interventionViewOptions} selectedValue={interventionView} onValueChange={setInterventionView} />
								{interventionView === "intervention" ? (
								<View style={[styles.section, { backgroundColor: secondaryBackground }]}>
									<View style={styles.detailsRow}>
										<Text type="heading">Intervention Details</Text>
										<IconButton icon={<Pencil size={22} color={accent} />} onPress={handleUpdateIntervention} accessibilityLabel="Edit" />
									</View>
									<Divider />
									<Text type="strong">Name</Text>
									<Text>{intervention.name}</Text>
									<Divider />
									{ intervention.description && 
										<>
											<Text type="strong">Description</Text>
											<Text>{intervention.description}</Text> 
											<Divider />
										</> 
									}
									
									{ intervention.goals && 
										<>
											<Text type="strong">Goals</Text>
											<Text>{intervention.goals}</Text> 
											<Divider />
										</> 
									}
									<Text type="strong">Success</Text>
									<Text>{intervention.success ? "Yes" : "No"}</Text>
									<Divider />
									<View style={styles.row}>
										<View>
											<Text type="strong">Start Date</Text>
											<Text>{formatDisplayDate(intervention.start_date)}</Text>
										</View>
										<View>
											<Text type="strong">End Date</Text>
											<Text>{formatDisplayDate(intervention.end_date)}</Text>
										</View>
									</View>
									
								</View>
							) : (
								<View style={[styles.section, { backgroundColor: secondaryBackground }]}>
									<View style={styles.detailsRow}>
										<Text type="heading">Indicator Information</Text>
									</View>
									<Divider />
									<Text type="strong">What Does This Show?</Text>
									<Text>{metricDetails.alias}</Text>
									<Text>{CHART_DEFINITION}</Text>
									<Divider />
									<Text type="strong">Description</Text>
									<Text>{metricDetails.description}</Text>
								</View>
							)}
						</View>

						{chartData.length > 0 && (
							<View style={[styles.section, { backgroundColor: secondaryBackground }]}>
								<Text type="heading">Chart Controls</Text>
								<Divider />
								<Switch label="Show Baseline" value={showMean} onValueChange={setShowMean} />
								<Switch label="Show Variation" value={showStandardDeviation} onValueChange={setShowStandardDeviation} />
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
	chart: {
		marginHorizontal: 0,
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
	}
});