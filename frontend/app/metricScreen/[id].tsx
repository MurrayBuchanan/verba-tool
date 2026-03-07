import { useState, useCallback, useMemo, useEffect } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricChart as Chart} from "@/components/metric-chart";
import { MetricSelector } from "@/components/metric-selector";
import { ChartToggle as Switch } from "@/components/chart-toggle";
import { TranscriptWithFeatures, Intervention } from "@/constants/interfaces";
import { getTranscripts } from "@/services/transcript-service";
import { getInterventions } from "@/services/intervention-service";
import { getMetricProgression, type Data } from "@/utils/chart-grouping";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";;
import { AlertCircle } from "lucide-react-native";
import { Divider } from "@/components/divider";
import { CHART_DEFINITION } from "@/constants/metrics";

export default function MetricDisplayScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { profileId } = useProfile();
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [interventions, setInterventions] = useState<Intervention[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMetric, setSelectedMetric] = useState<string>(id || "words_per_minute");
	const [showMean, setShowMean] = useState<boolean>(true);
	const [showStandardDeviation, setShowStandardDeviation] = useState<boolean>(true);
	const [showInterventions, setShowInterventions] = useState<boolean>(true);
	const metricDetails = METRIC_DEFINITIONS[selectedMetric];
	const warning = useThemeColor({}, 'warning');
	const icon = useThemeColor({}, 'icon');
	const background = useThemeColor({}, 'background');
	const secondaryBackground = useThemeColor({}, 'backgroundSecondary');
	const border = useThemeColor({}, 'backgroundTertiary');

	useEffect(() => {
		setSelectedMetric(id);
	}, [id]);

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				try {
					setLoading(true);
					
					const [transcriptsData, interventionsData] = await Promise.all([
						getTranscripts(profileId),
						getInterventions(profileId),
					]);
					
					setTranscripts(transcriptsData);
					setInterventions(interventionsData);
					setError(null);
				} catch {
					setError("Unable to load indicators");
				} finally {
					setLoading(false);
				}
			}
			fetchData();
		}, [profileId])
	);

	const chartData = useMemo(() => getMetricProgression(transcripts, selectedMetric), [transcripts, selectedMetric]);

	const metricKeys = useMemo(() => {
		return Object.keys(METRIC_DEFINITIONS).map((metricKey) => ({
			label: METRIC_DEFINITIONS[metricKey].name,
			value: metricKey,
		}));
	}, []);

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
				<>
					<View style={[styles.quickSelectHeader, { backgroundColor: background, borderTopColor: border, borderBottomColor: border }]}>
						<MetricSelector views={metricKeys} selectedValue={selectedMetric} onValueChange={setSelectedMetric} />
					</View>
					<ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
						{ chartData.length > 0 ? (
							<View style={styles.section}>
								<Chart 
									data={chartData} 
									title={`All time changes to ${metricDetails.name}`}
									interventions={interventions}
									showMean={showMean}
									showRange={showStandardDeviation}
									showInterventions={showInterventions}
								/>
							</View>
						) : (
							<View style={styles.center}>
								<Text align="center">No data available for this indicator yet. Record conversations to see progress over time.</Text>
							</View>
						)}

						<View style={[styles.section, { backgroundColor: secondaryBackground }]}>
								<Text type="heading">Indicator Information</Text>
								<Divider />
								<Text type="strong">What Does This Show?</Text>
								<Text type="caption">{metricDetails.alias}</Text>
								<Text type="caption">{CHART_DEFINITION}</Text>
								<Divider />
								<Text type="strong">Description</Text>
								<Text type="caption">{metricDetails.description}</Text>
						</View>

						{ chartData.length > 0 && (
							<View style={[styles.section, { backgroundColor: secondaryBackground }]}>
								<Text type="heading">Chart Controls</Text>
								<Divider />	
								<Switch label="Show Baseline" value={showMean} onValueChange={setShowMean} />
								<Switch label="Show Variation" value={showStandardDeviation} onValueChange={setShowStandardDeviation} />
								<Switch label="Show Interventions" value={showInterventions} onValueChange={setShowInterventions} />
							</View>
						)}
					</ScrollView>
				</>
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
		paddingHorizontal:20,
		marginTop: 8,
		marginBottom: 10,
		borderRadius: 16,
		padding: 20,
		gap: 16,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	placeholder: {
		marginBottom: 16,
	}
});