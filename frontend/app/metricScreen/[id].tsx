import { useEffect, useState, useCallback, useMemo } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useNavigation, router, useFocusEffect } from "expo-router";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { BlockButton } from "@/components/block-button";
import { Chart } from "@/components/chart";
import { signOut } from "@/services/authentication-service";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/transcript";
import { getMetricProgression, getMetricDetails } from "@/utils/metric-display";

// TODO: Change user id to authenticated user's id
const USER_ID = 1;

const handleSignOut = () => {
	return async () => {
		try {
			await signOut();
			router.replace("/");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};
}

export default function MetricScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const navigation = useNavigation();
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	const metricDetails = getMetricDetails(id);

	useEffect(() => {
		navigation.setOptions({
			title: metricDetails.name,
		});
	}, [navigation, metricDetails.name]);

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscripts() {
				try {
					setLoading(true);
					const data = await getTranscripts(USER_ID);
					setTranscripts(data);
					setError(null);
				} catch (error: any) {
					setError("Unable to load metrics");
				} finally {
					setLoading(false);
				}
			}
			fetchTranscripts();
		}, [])
	);

	// Memoize getMetrics to prevent unnecessary rerenders
	const metricData = useMemo(() => getMetricProgression(transcripts, id), [transcripts, id]);

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color="#B8CDF7" />
				</View>
			) : error ? (
				<View style={styles.center}>
					<Text align="center" lightColor="#B00020" darkColor="#CF6679">{error}</Text>
				</View>
			) : (
				<View style={styles.content}>
					<View>
						<Chart data={metricData} xAxisLabel={(value) => {
							const point = metricData.find(d => d.x === value);
							return point?.label || `Conv ${value}`;
						}} />

						<Text type="heading" style={styles.heading}>Description</Text>
						<Text>{metricDetails.description}</Text>
					</View>
					<BlockButton 
						title="Export data / Signout" 
						lightBackgroundColor="#4F5D75"
						darkBackgroundColor="#8A95B5"
						onPress={handleSignOut()} 
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,

	},
	content: {
		flex: 1,
		justifyContent: 'space-between',
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	heading: {
		marginTop: 20,
		marginBottom: 10,
	},
});