import { useState, useCallback, useRef } from "react";
import { StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";
import { Item } from "@/components/list-item";
import { getTranscripts } from "@/services/transcript-service";
import { AlertCircle, Clock, MessageSquare } from "lucide-react-native";
import { TranscriptWithFeatures } from "@/constants/interfaces";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";
import { formatDuration, formatDisplayDateTime } from "@/utils/datetime-formatting";

export default function ConversationHistoryScreen() {
	const router = useRouter();
	const { profileId } = useProfile();
	const warningColour = useThemeColor({}, 'warning');
	const iconColour = useThemeColor({}, 'icon');
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
					
					const data = await getTranscripts(profileId);
					setTranscripts(data);
					setError(null);
					hasInitiallyLoaded.current = true;
				} catch {
					setError("Unable to load conversation history");
				} finally {
					setLoading(false);
				}
			}
			fetchTranscripts();
		}, [profileId])
	);

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={iconColour} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warningColour} style={styles.placeholder} />
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : transcripts.length === 0 ? (
				<View style={styles.center}>
					<MessageSquare size={36} color={iconColour} style={styles.placeholder} />
					<Text align="center">No conversations, try starting a new chat!</Text>
				</View>
			) : (
				<>
					<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
						<List divider={true}>
							{transcripts.map((transcript) => (
								<Item
									key={transcript.id}
									name={formatDisplayDateTime(transcript.created_at)}
									icon={<Clock size={14} color={iconColour} />}
									subtitle={formatDuration(transcript.total_duration)}
									onPress={() => router.push(`/conversationScreen/${transcript.id}`)}
								/>
							))}
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