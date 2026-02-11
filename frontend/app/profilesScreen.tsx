import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { Plus } from 'lucide-react-native';
import { List } from "@/components/list";
import { ProfileItem as Item } from "@/components/profile-item";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ProfilesScreen() {
	const router = useRouter();
	const accentColour = useThemeColor({}, 'accent');

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				
				<List divider={true}>
					<Item key={1} onPress={() => router.push(`/(tabs)/recordAudioScreen`)} name="Murray Buchanan" />
					<Item key={2} onPress={() => router.push(`/(tabs)/recordAudioScreen`)} name="John Doe" />
				</List>
			</ScrollView>
			<TouchableOpacity style={[styles.button, { backgroundColor: accentColour }]} onPress={() => router.push("/createInterventionModal")}>
				<Plus size={28} color="#FFF"/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		paddingHorizontal: 20,
  	},
	content: {
		paddingVertical: 20,
		flexGrow: 1,
	},
	button: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		right: 20,
		bottom: 20,
		width: 68,
		height: 68,
		borderRadius: 34,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	placeholder: {
		marginBottom: 16,
	},
});