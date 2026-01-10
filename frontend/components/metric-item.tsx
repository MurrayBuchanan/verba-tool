import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { IconSymbol } from "@/components//ui/icon-symbol";
import { getMetricDisplayName } from "@/utils/metric-display";

export type MetricItemProps = {
    metricId: string;
    onPress: () => void;
};

export function MetricItem({ metricId, onPress }: MetricItemProps) {
  	return (
    	<View style={styles.container} lightColor="#fff" darkColor="#888">
			<TouchableOpacity onPress={onPress} style={styles.content}>
			<View style={styles.iconRow} lightColor="#fff" darkColor="#888">
				<View lightColor="#2F6FE4" darkColor="#5A8DFF" style={styles.iconBackground}>
					<IconSymbol name="chart.bar.fill" size={20} color="#fff" />
				</View>
				<IconSymbol name="chevron.right" size={18} color="#666" />
			</View>
			<Text type="caption" style={styles.text}>{getMetricDisplayName(metricId)}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
		width: "48%",
		height: 140,
		marginBottom: 12,
    	borderRadius: 12,
    	padding: 16,
		flexDirection: "column",
		justifyContent: "space-between",
  	},
	content: {
		flex: 1,
		justifyContent: "space-between",
	},
  	iconRow: {
    	flexDirection: "row",
    	alignItems: "center",
    	justifyContent: "space-between",
  	},
	iconBackground: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontWeight: "600",
	},
});