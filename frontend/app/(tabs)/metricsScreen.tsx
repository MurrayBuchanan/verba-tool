import { StyleSheet } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { MetricItem } from "@/components/metric-item";
import { List } from "@/components/list";
import { FadedScrollView as ScrollView} from "@/components/faded-scroll-view";

export default function MetricsScreen() {
  	return (
		<View style={styles.container}>
			<Text type="title">Metrics</Text>
			<ScrollView>
				<List>
					<MetricItem metricId="1" metricName="Coherence" />
					<MetricItem metricId="1" metricName="Word Choice" />
					<MetricItem metricId="1" metricName="Engagement" />
					<MetricItem metricId="1" metricName="Tone" />
				</List>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
});
