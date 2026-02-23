import { useState, useCallback, useRef } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { Plus, AlertCircle, User } from 'lucide-react-native';
import { List } from "@/components/list";
import { Item } from "@/components/list-item";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";
import { getProfiles } from "@/services/profile-service";
import { Profile } from "@/constants/interfaces";

export default function ProfilesScreen() {
	const router = useRouter();
	const { setProfileId } = useProfile();
	const accentColour = useThemeColor({}, 'accent');
	const iconColour = useThemeColor({}, 'icon');
	const warningColour = useThemeColor({}, 'warning');
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);

	useFocusEffect(
		useCallback(() => {
			async function fetchProfiles() {
				try {
					if (!hasInitiallyLoaded.current) {
						setLoading(true);
					}
					const data = await getProfiles();
					setProfiles(data);
					setError(null);
					hasInitiallyLoaded.current = true;
				} catch {
					setError("Unable to load all profiles");
				} finally {
					setLoading(false);
				}
			}
			fetchProfiles();
		}, [])
	);

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={iconColour} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warningColour} style={styles.placeholder} />
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : profiles.length === 0 ? (
				<View style={styles.center}>
					<User size={36} color={iconColour} style={styles.placeholder} />
					<Text align="center">No profiles, try creating a new profile!</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<List divider={true}>
						{profiles.map((profile) => (
							<Item
								key={profile.id}
								name={profile.name}
								subtitle={profile.description || undefined}
								onPress={() => {setProfileId(profile.id!); router.push("/(tabs)/recordAudioScreen")}}
							/>
						))}
					</List>
				</ScrollView>
			)}
			{!loading && !error && (
				<TouchableOpacity style={[styles.button, { backgroundColor: accentColour }]} onPress={() => router.push("/createProfileModal")}>
					<Plus size={32} color="#FFF"/>
				</TouchableOpacity>
			)}
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