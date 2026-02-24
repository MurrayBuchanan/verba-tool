import { StyleSheet, View, TouchableOpacity } from "react-native";
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

export function AnnotationSelector({ views, selectedValue, onValueChange }: Props) {
	const accent = useThemeColor({}, "accent");
	const text = useThemeColor({}, "text");
	const backgroundSecondary = useThemeColor({}, "backgroundSecondary");

	return (
		<View style={styles.container}>
			{views.map((view) => {
				const isSelected = view.value === selectedValue;
				return (
					<TouchableOpacity key={view.value} onPress={() => onValueChange(view.value)} style={[styles.item, { backgroundColor: backgroundSecondary, borderWidth: 1, borderColor: isSelected ? accent : backgroundSecondary }]}>
						<Text type="caption" style={{ color: text }} numberOfLines={1}>{view.label}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 10,
		marginHorizontal: 20,
		marginVertical: 10,
	},
	item: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	}
});