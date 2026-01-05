import { useEffect, useState, useCallback } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useNavigation, router, useFocusEffect } from "expo-router";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { BlockButton } from "@/components/block-button";
import { BarGraph } from "@/components/bar-graph";
import { signOut } from "@/services/authentication-service";
import { getTranscripts } from "@/services/transcript-service";
import { Transcript } from "@/constants/transcript";
import { getMetricProgression, getMetricDisplayName } from "@/utils/metric-display";

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
	const [transcripts, setTranscripts] = useState<Transcript[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	const metricName = getMetricDisplayName(id);

	useEffect(() => {
		navigation.setOptions({
			title: metricName,
		});
	}, [navigation, metricName]);

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscripts() {
				try {
					setLoading(true);
					const data = await getTranscripts(USER_ID);
					setTranscripts(data);
					setError(null);
				} catch (error: any) {
					console.error("Failed to load transcripts:", error);
					setError("Failed to load transcripts");
				} finally {
					setLoading(false);
				}
			}
			fetchTranscripts();
		}, [])
	);

	const metricData = getMetricProgression(transcripts, id);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text type="subtitle">Progression of {metricName} indicators</Text>
				{loading ? (
					<View style={styles.center}>
						<ActivityIndicator size="large" color="#B8CDF7" />
					</View>
				) : error ? (
					<View style={styles.center}>
						<Text style={styles.error}>{error}</Text>
					</View>
				) : metricData.length === 0 ? (
					<View style={styles.center}>
						<Text>No data available for this metric yet.</Text>
						<Text type="caption">Record some conversations to see progression!</Text>
					</View>
				) : (
					<>
						<BarGraph data={metricData} xAxisLabel={(value) => {
							const point = metricData.find(d => d.x === value);
							return point?.label || `#${value}`;
						}}/>
					</>
				)}
			</View>
			<BlockButton title="Export data / Signout" onPress={handleSignOut()} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'space-between',
	},
	content: {
		flex: 1,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	error: {
		color: "#DD2C00",
	},
});