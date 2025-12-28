import { StyleSheet } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";
import { ConversationItem as Item} from "@/components/conversation-item";
import { useRouter } from "expo-router";

export default function ConversationHistoryScreen() {
	const router = useRouter();
	const conversationId = "313141414423";
  	return (
		<View style={styles.container}>
			<Text type="title">Chat History</Text>
			<Text type="subtitle">Jan 2025</Text>
			<List>
				<Item
					onPress={() => router.push(`/conversationScreen/${conversationId}`)}
					dateNumber="12"
					dateString="Wed"
					conversationId={conversationId}
					snippet="Discussed symptoms and treatment options..."
				/>
				{/* TODO: Add more conversation items for local storage (then postgrel or azure sql db) */}
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
