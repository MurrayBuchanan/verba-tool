import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { SpeakerSegment } from "@/components/speaker-segment";
import { getTranscript } from "@/services/transcript-service";
import { TranscriptSegment } from "@/constants/transcript";
import { getUserId } from "@/services/authentication-service";

export default function ConversationScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [segments, setSegments] = useState<TranscriptSegment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const loadedId = useRef<string | undefined>(undefined);

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscript() {
				if (!id) {
					setError("No transcript ID provided");
					setLoading(false);
					return;
				}
				
				try {
					// Only show loading on initial load or when id changes
					if (loadedId.current === id) {
						return;
					}
					setLoading(true);
					
					const userId = await getUserId();
					const transcriptId = parseInt(id, 10);
					const data = await getTranscript(userId, transcriptId);
					setSegments(data.segments || []);
					setError(null);
					loadedId.current = id;
				} catch (error) {
					setError("Unable to load transcript");
				} finally {
					setLoading(false);
				}
			}
			fetchTranscript();
		}, [id])
	);
	
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
				<ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					{segments.map((segment, index) => (
						<SpeakerSegment
							key={index}
							speaker={segment.speaker}
							text={segment.text}
						/>
					))}
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingVertical: 20,
	},
	header: {
		padding: 20,
		paddingBottom: 12,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
});
