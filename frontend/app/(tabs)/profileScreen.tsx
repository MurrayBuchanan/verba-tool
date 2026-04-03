import { StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { useProfile } from "@/context/ProfileContext";
import { getProfile } from "@/services/profile-service";
import { Profile } from "@/constants/interfaces";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Theme } from "@/constants/theme";
import { AlertCircle, User } from "lucide-react-native";

export default function ProfileScreen() {
	const router = useRouter();
	const { profileId } = useProfile();
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);
	const icon = useThemeColor({}, "icon");
	const warning = useThemeColor({}, "warning");
	const accent = useThemeColor({}, "accent");
	const textSecondary = useThemeColor({}, "textSecondary");

	useFocusEffect(
		useCallback(() => {
			if (!profileId || profileId <= 0) {
				setProfile(null);
				setError(null);
				setLoading(false);
				hasInitiallyLoaded.current = true;
				return;
			}

			async function fetchProfile() {
				try {
					if (!hasInitiallyLoaded.current) {
						setLoading(true);
					}
					const data = await getProfile(profileId);
					setProfile(data);
					setError(null);
					hasInitiallyLoaded.current = true;
				} catch {
					setError("Unable to load profile");
					setProfile(null);
				} finally {
					setLoading(false);
				}
			}

			void fetchProfile();
		}, [profileId])
	);

	if (!profileId || profileId <= 0) {
		return (
			<View style={styles.container}>
				<View style={styles.center}>
					<User size={36} color={icon} style={styles.placeholder} />
					<Text align="center">Select a profile from the list to see details here.</Text>
					<Pressable onPress={() => router.push("/profilesScreen")} style={styles.linkWrap} accessibilityRole="button" accessibilityLabel="Go to profiles list">
						<Text type="strong" style={{ color: accent }}>Go to profiles</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="small" color={icon} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warning} style={styles.placeholder} />
					<Text align="center" style={{ color: warning }}>{error}</Text>
				</View>
			) : profile ? (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.card} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<Text type="caption" style={styles.detailLabel}>Name</Text>
						<Text type="title" style={styles.detailValue}>{profile.name}</Text>
						<Text type="caption" style={styles.descriptionLabel}>Description</Text>
						<Text style={{ color: textSecondary }}>
							{profile.description?.trim() ? profile.description : "No description"}
						</Text>
					</View>
				</ScrollView>
			) : null}
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
		paddingBottom: 40,
		flexGrow: 1,
	},
	card: {
		borderRadius: 16,
		paddingVertical: 20,
		paddingHorizontal: 20,
	},
	detailLabel: {
		marginBottom: 4,
	},
	detailValue: {
		marginBottom: 20,
	},
	descriptionLabel: {
		marginBottom: 8,
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
	linkWrap: {
		marginTop: 16,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
});
