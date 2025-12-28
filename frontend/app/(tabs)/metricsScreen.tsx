import { StyleSheet } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";

export default function MetricsScreen() {
  	return (
	<View style={styles.container}>
		<Text type="title">Metrics</Text>
		<Text type="subtitle">Linguistic Metrics</Text>
		<Text type="subtitle">Syntactic Metrics</Text>
		<Text type="subtitle">Behavioural Metrics</Text>
		<Text type="subtitle">Engagement Metrics</Text>
	</View>
	);

}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	padding: 20,
  	},
});
