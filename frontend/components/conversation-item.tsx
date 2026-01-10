import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { IconSymbol } from "@/components//ui/icon-symbol";

export type ConversationItemProps = {
    onPress: () => void;
	datetime: string;
	duration: string;
};

export function ConversationItem({ onPress, datetime, duration }: ConversationItemProps) {
  	return (
    	< TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				<View style={styles.leftContent}>
					<View lightColor="#2F6FE4" darkColor="#5A8DFF" style={styles.backgroundBox}>
						<Text style={styles.durationText}>{duration}</Text>
					</View>
					<Text>Took place on {datetime}</Text>
				</View>
				<IconSymbol name="chevron.right" size={18} color="#666" />
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
	backgroundBox: {
		padding: 6,
		borderRadius: 8,
		marginRight: 12,
		paddingHorizontal: 20,
	},
  	leftContent: {
    	flexDirection: "row",
		alignItems: "center",
  	},
	durationText: {
		fontWeight: "600",
		color: "#fff",
	},
});