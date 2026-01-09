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
    	<TouchableOpacity onPress={onPress} style={styles.container}>	
			<View style={styles.row}>
				<IconSymbol name="chart.bar.fill" size={30} color="#666" />
				<IconSymbol name="chevron.right" size={18} color="#666" />
			</View>
			<Text style={styles.text}>{getMetricDisplayName(metricId)}</Text>
			
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
  	container: {
		width: "48%",
		marginBottom: 12,
    	borderRadius: 12,
    	padding: 16,
		borderColor: "#9E9E9E",
		borderWidth: 1,
  	},
  	row: {
    	flexDirection: "row",
    	alignItems: "center",
    	justifyContent: "space-between",
  	},
	text: {
		fontWeight: "600",
	},
});