import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { ChevronRight } from "lucide-react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
    name: string;
    onPress: () => void;
    icon?: React.ReactNode;
    subtitle?: string;
};

export function Item({ name, onPress, icon, subtitle }: Props) {
	const iconColour = useThemeColor({}, "icon");
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				<View style={styles.content}>
					<Text type="strong" numberOfLines={1}>{name}</Text>
					{ subtitle && (
						<View style={styles.subtitle}>
							{icon && <View style={styles.icon}>{icon}</View>}
							<Text type="caption" numberOfLines={1}>{subtitle}</Text>
						</View>
					)}
				</View>
				<ChevronRight size={18} color={iconColour} />
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		paddingVertical: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	content: {
		flex: 1,
	},
	subtitle: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginRight: 6,
	},
});