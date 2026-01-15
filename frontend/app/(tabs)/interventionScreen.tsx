import { StyleSheet, ScrollView } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { BlockButton as Button } from "@/components/block-button";

export default function InterventionScreen() {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				<View style={styles.center}>
					<Text align="center">This is for recording rehabilitation interventions</Text>
				</View>
			</ScrollView>
			<View style={styles.buttonContainer}>
				<Button title="Add Intervention" onPress={() => console.log("Intervention Added")} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		paddingHorizontal: 20,
  	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingVertical: 20,
	},
	buttonContainer: {
		paddingBottom: 20,
		paddingTop: 10,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
});
