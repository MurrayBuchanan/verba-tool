import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Views = {
	label: string;
	value: string;
};

type Props = {
	views: Views[];
	selectedValue: string;
	onValueChange: (value: string) => void;
};

export function MetricSelector({ views, selectedValue, onValueChange }: Props) {
	const accentColour = useThemeColor({}, "accent");
	const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
	const textColour = useThemeColor({}, "text");

	return (
		<>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
				{views.map((view) => {
					const isSelected = view.value === selectedValue;
					return (
						<TouchableOpacity
							key={view.value}
							onPress={() => onValueChange(view.value)}
							style={[styles.item, { backgroundColor: backgroundSecondary, borderWidth: 1, borderColor: isSelected ? accentColour : backgroundSecondary }]}
						>
							<Text type="caption" style={{ color: textColour }} numberOfLines={1}>{view.label}</Text>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	heading: {
		paddingHorizontal: 20,
	},
	content: {
		paddingHorizontal: 20,
		gap: 10,
	},
	item: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
});