import { StyleSheet } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";

export default function ConversationScreen(id: string, date: string) {
  	return (
		<View style={styles.container}>
			<Text type="subtitle">Conversation #{id}</Text>
			<Text type="heading">{date}{id}</Text>
			{/* Retrieve conversation and display segments */}
			<List>
				<Text type="default">Placeholder</Text>
			</List>
		
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	padding: 20,
  	},
});
