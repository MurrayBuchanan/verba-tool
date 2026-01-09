import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { IconSymbol } from "@/components//ui/icon-symbol";

export type ConversationItemProps = {
    onPress: () => void;
	id: string;
	name: string;
	date: string;
	duration: string;
};

export function ConversationItem({ onPress, id, name, date, duration }: ConversationItemProps) {
  	return (
    	< TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				<View style={styles.leftContent}>
				<Text type="heading">Untitled Conversation{name}</Text>
				<Text>Date: {date}</Text>
				<Text>Duration: {duration}</Text>
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
  	leftContent: {
    	flexDirection: "column",
  	},
});