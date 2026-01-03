import { StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { FadedScrollView as ScrollView} from "@/components/faded-scroll-view";
import { SpeakerSegment } from "@/components/speaker-segment";
import { getTranscript } from "@/services/transcript-service";
import { TranscriptSegment } from "@/constants/transcript";


// TODO: Change user id to authenticated user's id
const USER_ID = 1;

export default function ConversationScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const navigation = useNavigation();
	const [segments, setSegments] = useState<TranscriptSegment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const loadedId = useRef<string | undefined>(undefined);

	useEffect(() => {
		navigation.setOptions({
			title: "Viewing Chat",
		});
	}, [navigation]);

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
					const transcriptId = parseInt(id, 10);

					const data = await getTranscript(USER_ID, transcriptId);
					setSegments(data.segments || []);
					setError(null);
					loadedId.current = id;
				} catch (error: any) {
					console.error("Failed to load transcript:", error);
					setError("Failed to load transcript");
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
					<Text style={styles.error}>{error}</Text>
				</View>
			) : segments.length === 0 ? (
				<View style={styles.center}>
					<Text>No transcript found</Text>
					{/* Maybe go back */}
				</View>
			) : (
				<ScrollView showGradient={false}>
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
	error: {
		color: "#DD2C00",
	},
});

