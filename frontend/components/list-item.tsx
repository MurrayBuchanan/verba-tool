import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ThemedText as Text } from "@/components/themed-text";
import { ChevronRight, User } from "lucide-react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
    name: string;
    onPress: () => void;
    icon?: React.ReactNode;
    subtitle?: string;
    avatarUri?: string | null;
};

export function Item({ name, onPress, icon, subtitle, avatarUri }: Props) {
	const iconColour = useThemeColor({}, "icon");
	const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
	const border = useThemeColor({}, "backgroundTertiary");
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				{avatarUri ? (
					<Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" transition={200} />
				) : (
					<View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: backgroundSecondary, borderColor: border }]}>
						<User size={20} color={iconColour} />
					</View>
				)}
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
		gap: 12,
	},
	avatar: {
		width: 44,
		height: 44,
		borderRadius: 22,
	},
	avatarPlaceholder: {
		borderWidth: StyleSheet.hairlineWidth,
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		flex: 1,
		minWidth: 0,
	},
	subtitle: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginRight: 6,
	}
});