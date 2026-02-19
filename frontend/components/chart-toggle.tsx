import { StyleSheet, Switch, View } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
	label: string;
	value: boolean;
	onValueChange: (value: boolean) => void;
};

export function ChartToggle({ label, value, onValueChange }: Props) {
	const textColour = useThemeColor({}, 'text');
	const accentColour = useThemeColor({}, 'accent');

	return (
		<View style={styles.container}>
			<Text type="strong">{label}</Text>
			<Switch
				value={value}
				onValueChange={onValueChange}
				trackColor={{ false: textColour, true: accentColour }}
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
	},
});