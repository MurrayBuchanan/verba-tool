import { StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useState, useCallback, useRef, useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { SpeakerSegment } from "@/components/speaker-segment";
import { getProfile } from "@/services/profile-service";
import { TranscriptWithSegments } from "@/constants/interfaces";
import { getTranscript, deleteTranscript } from "@/services/transcript-service";
import { useThemeColor } from "@/hooks/use-theme-color";
import { AlertCircle, Trash } from "lucide-react-native";
import { IconButton } from "@/components/icon-button";

export default function ConversationDisplayScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const navigation = useNavigation();
	const [transcript, setTranscript] = useState<TranscriptWithSegments | null>(null);
	const [profileName, setProfileName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const loadedId = useRef<string | undefined>(undefined);
	const warning = useThemeColor({}, "warning");
	const icon = useThemeColor({}, "icon");

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
				<IconButton icon={<Trash size={22} color={warning} />} onPress={handleDelete} />
			),
		});
	}, [navigation, handleDelete, warning]);

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

					try {
						const profile = await getProfile(data.profile_id);
						setProfileName(profile.name);
					} catch {
						setProfileName(null);
					}
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
			{ loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="small" color={icon} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warning} style={styles.placeholder} />
					<Text align="center" style={{ color: warning }}>{error}</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					{(transcript?.segments ?? []).map((segment, index) => {
						const speakerTitle = segment.speaker === "Guest-1" ? "You": (profileName ?? segment.speaker);
						
						return (
							<SpeakerSegment
								key={index}
								speaker={segment.speaker}
								speakerTitle={speakerTitle}
								text={segment.text}
								createdAt={transcript?.created_at}
								offsetSeconds={segment.offset}
							/>
						);
					})}
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
	}
});