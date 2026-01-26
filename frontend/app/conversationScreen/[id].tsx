import { StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useCallback, useRef, useLayoutEffect } from "react";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { SpeakerSegment } from "@/components/speaker-segment";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getTranscript, deleteTranscript } from "@/services/transcript-service";
import { TranscriptSegment } from "@/constants/transcript";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ConversationScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const navigation = useNavigation();
	const colorScheme = useColorScheme() ?? 'light';
	const [segments, setSegments] = useState<TranscriptSegment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const loadedId = useRef<string | undefined>(undefined);

	const handleDelete = useCallback(async () => {
		if (!id) return;
		
		Alert.alert(
			"Delete Conversation",
			"Are you sure you want to delete this conversation? This will permanently delete the conversation and the metrics associated with it.",
			[
				{
					text: "Cancel",
					style: "cancel"
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							const transcriptId = parseInt(id, 10);
							await deleteTranscript(transcriptId);
							router.back();
						} catch (error) {
							Alert.alert("Failed to delete conversation");
						}
					}
				}
			]
		);
	}, [id]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity 
					style={styles.button} 
					onPress={handleDelete}
				>
					<IconSymbol 
						name="trash" 
						size={24} 
						color={Colors[colorScheme].warning} 
					/>
				</TouchableOpacity>
			),
		});
	}, [navigation, handleDelete, colorScheme]);

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscript() {
				if (!id) {
					setError("No transcript ID provided");
					setLoading(false);
					return;
				}
				
				try {
					if (loadedId.current === id) {
						return;
					}
					setLoading(true);
					
					const transcriptId = parseInt(id, 10);
					const data = await getTranscript(transcriptId);
					setSegments(data.segments || []);
					setError(null);
					loadedId.current = id;
				} catch {
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
					<ActivityIndicator size="large" color={Colors.light.tint} />
					<Text align="center">Loading...</Text>
				</View>
			) : error ? (
				<View style={styles.center}>
					<Text align="center" style={{ color: Colors[colorScheme].warning }}>{error}</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
	content: {
		paddingVertical: 20,
		flexGrow: 1,
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
	button: {
		marginRight: 10,
	},
});