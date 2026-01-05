import { ActivityIndicator, StyleSheet } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";
import { ConversationItem as Item} from "@/components/conversation-item";
import { FadedScrollView as ScrollView } from "@/components/faded-scroll-view";
import { useRouter } from "expo-router";
import { getTranscripts } from "@/services/transcript-service";
import { Transcript } from "@/constants/transcript";

// TODO: Change user id to authenticated user's id
const USER_ID = 1;

function formatDuration(seconds: number): { number: string; unit: string } {
	if (seconds < 60) {
		return { number: Math.round(seconds).toString(), unit: "Secs" };
	} else if (seconds < 3600) {
		return { number: Math.round(seconds / 60).toString(), unit: "Mins" };
	} else {
		return { number: Math.round(seconds / 3600).toString(), unit: "Hrs" };
	}
}

export default function ConversationHistoryScreen() {
	const router = useRouter();
	const [transcripts, setTranscripts] = useState<Transcript[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const hasLoaded = useRef(false);

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscripts() {
				try {
					// Only show loading on initial load
					if (hasLoaded.current) {
						return;
					}
					const data = await getTranscripts(USER_ID);
					setTranscripts(data);
					setError(null);
				} catch (error: any) {
					console.error("Failed to load transcripts:", error);
					setError("Failed to load transcripts");
				} finally {
					setLoading(false);
					hasLoaded.current = true;
				}
			}
			fetchTranscripts();
		}, [])
	);

	return (
		<View style={styles.container}>
			<Text type="title">Chat History</Text>
			<ScrollView>
				{loading ? (
					<View style={styles.center}>
						<ActivityIndicator size="large" color="#B8CDF7" />
					</View>
				) : error ? (
					<View style={styles.center}>
						<Text style={styles.error}>{error}</Text>
					</View>
				) : transcripts.length === 0 ? (
					<View style={styles.center}>
						<Text>No conversations, try starting a new chat!</Text>
					</View>
				) : (
					<List divider={true}>
						{transcripts.map((transcript) => {
							const duration = formatDuration(transcript.total_duration);
							return (
								<Item
									key={transcript.transcript_id}
									onPress={() => router.push(`/conversationScreen/${transcript.transcript_id}`)}
									dateNumber={duration.number}
									dateString={duration.unit}
									conversationId={transcript.transcript_id.toString()}
									conversationLength={transcript.transcript_id.toString()}
								/>
							);
						})}
					</List>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
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
