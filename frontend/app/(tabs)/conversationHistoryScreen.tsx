import { StyleSheet } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";
import { ConversationItem as Item} from "@/components/conversation-item";
import { FadedScrollView as ScrollView } from "@/components/faded-scroll-view";
import { useRouter } from "expo-router";

export default function ConversationHistoryScreen() {
	const router = useRouter();
	const conversationId = "313141414423";
  	return (
		<View style={styles.container}>
		<Text type="title">Chat History</Text>
			<ScrollView>
				<List divider={true}>
					<Item
						onPress={() => router.push(`/conversationScreen/${conversationId}`)}
						dateNumber="12"
						dateString="Mins"
						conversationId={conversationId}
						conversationLength="12/12/2025 at 12:00:00"
					/>
					<Item
						onPress={() => router.push(`/conversationScreen/${conversationId}`)}
						dateNumber="12"
						dateString="Mins"
						conversationId={conversationId}
						conversationLength="12/12/2025 at 12:00:00"
					/>
					<Item
						onPress={() => router.push(`/conversationScreen/${conversationId}`)}
						dateNumber="12"
						dateString="Mins"
						conversationId={conversationId}
						conversationLength="12/12/2025 at 12:00:00"
					/>
					{/* TODO: Add more conversation items for local storage (then postgrel or azure sql db) */}
				</List>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		padding: 20,
  	},
});
