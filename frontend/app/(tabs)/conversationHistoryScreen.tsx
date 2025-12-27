import { StyleSheet } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";
import { ConversationItem as Item} from "@/components/conversation-item";
import { BlockButton } from "@/components/block-button";
import { useRouter } from "expo-router";

export default function ConversationHistoryScreen() {
	const router = useRouter();
  	return (
		<View style={styles.container}>
			<Text type="subtitle">Conversation History</Text>
			<List>
				<Item
					onPress={() => console.log('hello')}
					date="2025-12-01"
					conversationId="12345"
					snippet="Discussed symptoms and treatment options..."
				/>
				<BlockButton 
					title="Add New Profile"
					onPress={() => { router.push("/addUserModal"); }}/>
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
