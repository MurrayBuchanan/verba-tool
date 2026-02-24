import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export function Divider() {
	const divider = useThemeColor({}, "backgroundTertiary");

	return <View style={[styles.divider, { backgroundColor: divider }]} />;
}

const styles = StyleSheet.create({
	divider: {
		height: StyleSheet.hairlineWidth,
		width: "100%",
		marginVertical: 4
	}
});