import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export function Divider() {
	const backgroundTertiary = useThemeColor({}, 'backgroundTertiary');
	return <View style={[styles.divider, { backgroundColor: backgroundTertiary }]} />
}

const styles = StyleSheet.create({
	divider: {
		height: StyleSheet.hairlineWidth,
	},
});