import { StyleSheet, ScrollView, ActivityIndicator, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { useProfile } from "@/context/ProfileContext";
import { getProfile } from "@/services/profile-service";
import { Profile } from "@/constants/interfaces";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Theme } from "@/constants/theme";
import { AlertCircle, Pencil, User } from "lucide-react-native";
import { resolveProfilePictureUrl } from "@/utils/profile-picture";
import { IconButton } from "@/components/icon-button";

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
	const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
	const border = useThemeColor({}, "backgroundTertiary");

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

	const detailPhotoUri = profile ? resolveProfilePictureUrl(profile.picture_url) : null;

	if (!profileId || profileId <= 0) {
		return (
			<ThemedView style={styles.container}>
				<ThemedView style={styles.center}>
					<User size={36} color={icon} style={styles.placeholder} />
					<Text align="center">Select a profile from the list to see details here.</Text>
					<Pressable onPress={() => router.push("/profilesScreen")} style={styles.linkWrap} accessibilityRole="button" accessibilityLabel="Go to profiles list">
						<Text type="strong" style={{ color: accent }}>Go to profiles</Text>
					</Pressable>
				</ThemedView>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			{loading ? (
				<ThemedView style={styles.center}>
					<ActivityIndicator size="small" color={icon} />
				</ThemedView>
			) : error ? (
				<ThemedView style={styles.center}>
					<AlertCircle size={36} color={warning} style={styles.placeholder} />
					<Text align="center" style={{ color: warning }}>{error}</Text>
				</ThemedView>
			) : profile ? (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<ThemedView style={styles.card} lightColour={Theme.light.backgroundSecondary} darkColour={Theme.dark.backgroundSecondary}>
						<View style={styles.cardEditAnchor} pointerEvents="box-none">
							<IconButton
								icon={<Pencil size={22} color={icon} />}
								onPress={() =>
									router.push({ pathname: "/editProfileModal", params: { id: String(profileId) } })
								}
								accessibilityLabel="Edit profile"
							/>
						</View>
						<View style={styles.avatarWrap}>
							{detailPhotoUri ? (
								<Image source={{ uri: detailPhotoUri }} style={styles.avatarLarge} contentFit="cover" transition={200} />
							) : (
								<View style={[styles.avatarLarge, styles.avatarPlaceholder, { backgroundColor: backgroundSecondary, borderColor: border }]}>
									<User size={40} color={icon} />
								</View>
							)}
						</View>
						<Text type="caption" style={styles.detailLabel}>First name</Text>
						<Text type="title" style={styles.detailValue}>{profile.first_name}</Text>
						<Text type="caption" style={styles.detailLabel}>Last name</Text>
						<Text type="title" style={styles.detailValue}>{profile.last_name}</Text>
						<Text type="caption" style={styles.descriptionLabel}>Description</Text>
						<Text style={{ color: textSecondary }}>
							{profile.description?.trim() ? profile.description : "No description"}
						</Text>
					</ThemedView>
				</ScrollView>
			) : null}
		</ThemedView>
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
		position: "relative",
	},
	cardEditAnchor: {
		position: "absolute",
		top: 8,
		right: 8,
		zIndex: 1,
	},
	avatarWrap: {
		alignItems: "center",
		marginBottom: 20,
	},
	avatarLarge: {
		width: 112,
		height: 112,
		borderRadius: 56,
	},
	avatarPlaceholder: {
		borderWidth: StyleSheet.hairlineWidth,
		alignItems: "center",
		justifyContent: "center",
	},
	detailLabel: {
		marginBottom: 4,
	},
	detailValue: {
		marginBottom: 12,
	},
	descriptionLabel: {
		marginTop: 8,
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
