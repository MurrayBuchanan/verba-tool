import { StyleSheet } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";

export default function ConversationHistoryScreen() {
  	return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	padding: 20,
  	},
});
