import { ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";
import { ConversationItem as Item} from "@/components/conversation-item";
import { useRouter } from "expo-router";
import { getTranscripts } from "@/services/transcript-service";
import { Transcript } from "@/constants/transcript";

// TODO: Change user id to authenticated user's id
const USER_ID = 1;

function formatDuration(inputSeconds: number): string {
	const totalSeconds = Math.floor(inputSeconds);

	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes === 0) {
		return `${seconds}s`;
	}
	if (seconds === 0) {
		return `${minutes}m`;
	}	

	return `${minutes}m ${seconds}s`;
}

export default function ConversationHistoryScreen() {
	const router = useRouter();
	const [transcripts, setTranscripts] = useState<Transcript[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscripts() {
				try {
					// Only show loading on initial load
					if (!hasInitiallyLoaded.current) {
						setLoading(true);
					}
					const data = await getTranscripts(USER_ID);
					setTranscripts(data);
					setError(null);
					hasInitiallyLoaded.current = true;
				} catch (error) {
					setError("Unable to load transcripts");
				} finally {
					setLoading(false);
				}
			}
			fetchTranscripts();
		}, [])
	);

	return (
		<View style={styles.container}>
			<ScrollView 
				style={styles.scrollView} 
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{loading ? (
					<View style={styles.center}>
						<ActivityIndicator size="large" color="#B8CDF7" />
					</View>
				) : error ? (
					<View style={styles.center}>
						<Text align="center" lightColor="#B00020" darkColor="#CF6679">{error}</Text>
					</View>
				) : transcripts.length === 0 ? (
					<View style={styles.center}>
						<Text align="center">No conversations, try starting a new chat!</Text>
					</View>
				) : (
					<List divider={true}>
						{transcripts.map((transcript) => {
							return (
								<Item
									key={transcript.transcript_id}
									onPress={() => router.push(`/conversationScreen/${transcript.transcript_id}`)}
									datetime={new Date(transcript.created_at).toLocaleDateString()}
									duration={formatDuration(transcript.total_duration)}
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
  	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingVertical: 20,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
});
