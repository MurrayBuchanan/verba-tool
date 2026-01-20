import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { IconSymbol } from "@/components//ui/icon-symbol";
import { METRIC_DEFINITIONS } from "@/constants/metrics";
import { Colors } from "@/constants/theme";

export type MetricItemProps = {
    metricId: string;
    onPress: () => void;
};

export function MetricItem({ metricId, onPress }: MetricItemProps) {
  	return (
    	<View style={styles.container} lightColor={Colors.light.secondaryBackground} darkColor={Colors.dark.secondaryBackground}>
			<TouchableOpacity onPress={onPress} style={styles.content}>
			<View style={styles.iconRow} lightColor={Colors.light.secondaryBackground} darkColor={Colors.dark.secondaryBackground}>
				<View lightColor={Colors.light.tint} darkColor={Colors.dark.tint} style={styles.iconBackground}>
					<IconSymbol name="chart.bar.fill" size={20} color="#fff" />
				</View>
				<IconSymbol name="chevron.right" size={18} color="#666" />
			</View>
			<Text type="caption" style={styles.text}>{METRIC_DEFINITIONS[metricId].name}</Text>
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