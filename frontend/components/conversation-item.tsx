import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { Clock, ChevronRight } from 'lucide-react-native';
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
    onPress: () => void;
	datetime: string;
	duration: string;
};

export function ConversationItem({ onPress, datetime, duration }: Props) {
	const iconColour = useThemeColor({}, 'icon');

	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				<View style={styles.left}>
					<View style={styles.content}>
						<Text type="strong">{datetime}</Text>
						<View style={styles.dateRow}>
							<Clock size={14} color={iconColour} style={styles.icon}/>
							<Text type="caption">{duration}</Text>
						</View>
					</View>
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
  	left: {
    	flexDirection: "row",
		alignItems: "center",
		flex: 1,
  	},
	content: {
		flex: 1,
	},
	dateRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginRight: 6,
	},
});