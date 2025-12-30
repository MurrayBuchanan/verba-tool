import { StyleSheet, ScrollView } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricItem } from "@/components/metric-item";
import { List } from "@/components/list";

export default function MetricsScreen() {
  	return (
		<View style={styles.container}>
			<Text type="title">Metrics</Text>
			<ScrollView 
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}
			>
				<List>
					<MetricItem metricId="1" metricName="Coherence Score" />
				</List>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingTop: 12,
		paddingBottom: 20,
	},
});
