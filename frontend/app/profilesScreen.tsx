import { useState, useCallback } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { Plus } from 'lucide-react-native';
import { List } from "@/components/list";
import { ProfileItem as Item } from "@/components/profile-item";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";
import { getProfiles } from "@/services/profile-service";
import { Profile } from "@/constants/interfaces";

export default function ProfilesScreen() {
	const router = useRouter();
	const { setProfileId } = useProfile();
	const accentColour = useThemeColor({}, 'accent');
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(true);

	// TODO: Use this pattern for all fetching
	const loadProfiles = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getProfiles();
			setProfiles(data);
		} catch {
			setProfiles([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadProfiles();
		}, [loadProfiles])
	);

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				{loading ? (
					<ActivityIndicator size="large" style={styles.center} />
				) : (
					<List divider={true}>
						{profiles.map((profile) => (
							<Item
								key={profile.id}
								name={profile.name}
								onPress={() => {setProfileId(profile.id!); router.push("/(tabs)/recordAudioScreen")}}
							/>
						))}
					</List>
				)}
			</ScrollView>
			<TouchableOpacity style={[styles.button, { backgroundColor: accentColour }]} onPress={() => router.push("/createProfileModal")}>
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