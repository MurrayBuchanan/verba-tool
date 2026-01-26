import { StyleSheet, Switch, View } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ChartToggleProps = {
	label: string;
	value: boolean;
	onValueChange: (value: boolean) => void;
};

export function ChartToggle({ label, value, onValueChange }: ChartToggleProps) {
	const colorScheme = useColorScheme() ?? "light";
	const tintColour = Colors[colorScheme].tint;

	return (
		<View style={styles.container}>
			<Text>{label}</Text>
			<Switch
				value={value}
				onValueChange={onValueChange}
				trackColor={{ false: "#767577", true: tintColour }}
				thumbColor={value ? "#FFF" : "#F4F3F4"}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 10,
	},
});