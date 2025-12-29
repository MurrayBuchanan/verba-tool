import { StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ThemedView as View } from "@/components/themed-view";
import { SpeakerSegment } from "@/components/speaker-segment";

export default function ConversationScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	
	return (
		<View style={styles.container}>
			<ScrollView 
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}
			>
				<SpeakerSegment speaker="Guest-1" text="Hello bob" />
				<SpeakerSegment speaker="Guest-2" text="Hello how are you doing today?" />
				<SpeakerSegment speaker="Guest-1" text="I'm doing great!" />
			</ScrollView>
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
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingVertical: 8,
		paddingBottom: 20,
		paddingHorizontal: 16,
	},
});

