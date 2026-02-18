import { StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useState, useCallback, useRef, useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { Trash, AlertCircle } from 'lucide-react-native';
import { SpeakerSegment } from "@/components/speaker-segment";
import { TranscriptWithSegments } from "@/constants/interfaces";
import { getTranscript, deleteTranscript } from "@/services/transcript-service";
import { useThemeColor } from "@/hooks/use-theme-color";
import { IconButton } from "@/components/icon-button";

export default function ConversationDisplayScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const navigation = useNavigation();
	const warningColour = useThemeColor({}, 'warning');
	const iconColour = useThemeColor({}, 'icon');
	const [transcript, setTranscript] = useState<TranscriptWithSegments | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const loadedId = useRef<string | undefined>(undefined);

	const handleDelete = useCallback(() => {
		Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation? This will permanently delete the conversation and the indicators associated with it.", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Delete", style: "destructive", onPress: async () => {
				try {
					const transcriptId = parseInt(id, 10);
					await deleteTranscript(transcriptId);
					router.back();
				} catch {
					Alert.alert("Failed to delete conversation");
				}
			}},
		]);
	}, [id]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<IconButton icon={<Trash size={22} color={warningColour} />} onPress={handleDelete} />
			),
		});
	}, [navigation, handleDelete, warningColour]);

	useFocusEffect(
		useCallback(() => {
			async function fetchTranscript() {
				try {
					if (loadedId.current === id) {
						return;
					}
					setLoading(true);
					
					const transcriptId = parseInt(id, 10);
					const data = await getTranscript(transcriptId);
					setTranscript(data);
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
					<ActivityIndicator size="large" color={iconColour} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warningColour} style={styles.placeholder} />
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					{(transcript?.segments ?? []).map((segment, index) => (
						<SpeakerSegment
							key={index}
							speaker={segment.speaker}
							text={segment.text}
							createdAt={transcript?.created_at}
							offsetSeconds={segment.offset}
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
	placeholder: {
		marginBottom: 16,
	},
	button: {
		marginRight: 10,
	},
});