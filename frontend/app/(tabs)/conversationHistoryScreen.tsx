import { useState, useCallback, useRef } from "react";
import { StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";
import { ConversationItem as Item } from "@/components/conversation-item";
import { getTranscripts } from "@/services/transcript-service";
import { TranscriptWithFeatures } from "@/constants/interfaces";
import { formatDisplayDateTime } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { AlertCircle } from "lucide-react-native";
import { formatDuration } from "@/utils/datetime-formatting";

export default function ConversationHistoryScreen() {
	const router = useRouter();
	const warningColour = useThemeColor({}, 'warning');
	const accentColour = useThemeColor({}, 'accent');
	const [transcripts, setTranscripts] = useState<TranscriptWithFeatures[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscripts() {
				try {
					if (!hasInitiallyLoaded.current) {
						setLoading(true);
					}
					
					const data = await getTranscripts();
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
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={accentColour} />
					<Text align="center">Loading...</Text>
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warningColour} style={styles.placeholder} />
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : transcripts.length === 0 ? (
				<View style={styles.center}>
					<Text align="center">No conversations, try starting a new chat!</Text>
				</View>
			) : (
				<>
					<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
						<List divider={true}>
							{transcripts.map((transcript) => {
								return (
									<Item
										key={transcript.id}
										onPress={() => router.push(`/conversationScreen/${transcript.id}`)}
										datetime={formatDisplayDateTime(transcript.created_at)}
										duration={formatDuration(transcript.total_duration)}
									/>
								);
							})}
						</List>
					</ScrollView>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		paddingHorizontal: 20,
  	},
	content: {
		flexGrow: 1,
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
});