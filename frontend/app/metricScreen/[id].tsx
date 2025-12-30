import { StyleSheet } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { BlockButton } from "@/components/block-button";
import { BarGraph } from "@/components/bar-graph";
import { useLocalSearchParams } from "expo-router";

const data = Array.from({ length: 6 }, (_, index) => ({
    month: index + 1,
    score: Math.floor(Math.random() * 10) + 1,
}))

export default function MetricScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	return (
		<View style={styles.container}>
			<View>
				<Text type="subtitle">Coherence Score</Text>
				<BarGraph data={data} />
				<View style={styles.section}>
					<Text type="subtitle">What does this show?</Text>
					<Text type="default">Bob coherance score is slowly increasing, this means x</Text>
				</View>
				<View style={styles.section}>
					<Text type="subtitle">How is this calculated?</Text>
					<Text type="default">The audio is transcribed and labelled then passed into a model to extract.. with a rubic</Text>
				</View>
			</View>
			<BlockButton title="Export data" backgroundColor="#371B34" color="#FFF" onPress={() => {
				console.log("TODO: Export data");
			}} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'space-between',
	},
	section: {
		marginVertical: 20,
	},
});

