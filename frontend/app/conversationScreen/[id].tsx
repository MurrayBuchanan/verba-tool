import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { List } from "@/components/list";

export default function ConversationScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	
	return (
		<View style={styles.container}>
			<Text type="subtitle">Conversation #{id}</Text>
			<List>
				<Text type="default">Hello bob</Text>
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

