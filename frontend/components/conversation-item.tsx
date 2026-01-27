import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { IconSymbol } from "@/components//ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ConversationItemProps = {
    onPress: () => void;
	id: number;
	datetime: string;
	duration: string;
};

export function ConversationItem({ onPress, id, datetime, duration }: ConversationItemProps) {
	const iconColour = useThemeColor({}, 'icon');
  	return (
    	<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				<View style={styles.left}>
					<View style={styles.content}>
						<Text style={styles.label}>Conversation {id}</Text>
						<Text type="caption" style={styles.date}>{datetime} • {duration}</Text>
					</View>
				</View>
				<IconSymbol name="chevron.right" size={18} color={iconColour} />
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
  	left: {
    	flexDirection: "row",
		alignItems: "center",
		flex: 1,
  	},
	content: {
		flex: 1,
	},
	label: {
		fontWeight: "600",
		marginBottom: 2,
	},
	date: {
		opacity: 0.7,
	},
});