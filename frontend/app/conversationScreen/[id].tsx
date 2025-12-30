import { StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

import { ThemedView as View } from "@/components/themed-view";
import { SpeakerSegment } from "@/components/speaker-segment";
import { FadedScrollView as ScrollView} from "@/components/faded-scroll-view";

export default function ConversationScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			title: "Viewing Chat",
		});
	}, [navigation]);
	
	return (
		<View style={styles.container}>
			<ScrollView showGradient={false}>
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
});

