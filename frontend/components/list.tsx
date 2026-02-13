import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
	children: React.ReactNode;
	divider?: boolean;
};

export function List({ children, divider = false }: Props) {
	const dividerColor = useThemeColor({}, "backgroundTertiary");
	const items = React.Children.toArray(children);

	return (
		<View style={styles.container}>
			{items.map((child, index) => (
				<View key={index}>
					<View style={styles.item}>{child}</View>
					{divider && index < items.length - 1 && (
						<View style={[styles.divider, { backgroundColor: dividerColor }]} />
					)}
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	item: {
		paddingVertical: 4,
	},
	divider: {
		height: StyleSheet.hairlineWidth,
	},
});