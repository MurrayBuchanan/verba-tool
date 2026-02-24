import { Alert, View, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

import { useAuthentication } from "@/context/SessionContext";
import { useProfile } from "@/context/ProfileContext";
import { IconButton } from "@/components/icon-button";
import { ArrowLeft, LogOut, User } from "lucide-react-native";
import { useRouter } from "expo-router";

export function ToProfileButton() {
	const icon = useThemeColor({}, "icon");
	const router = useRouter();
	
	return (
		<View style={styles.container}>
			<IconButton icon={<ArrowLeft size={22} color={icon} />} onPress={() => router.dismissTo("/profilesScreen")} accessibilityLabel="Back to Profiles Button" />
		</View>
	);
}

export function EditProfileButton() {
	const icon = useThemeColor({}, "icon");
	const router = useRouter();
	const { profileId } = useProfile();

	const handlePress = () => {
		router.push({ pathname: "/editProfileModal", params: { id: String(profileId) } });
	};

	return (
		<View style={styles.container}>
			<IconButton icon={<User size={22} color={icon} />} onPress={handlePress} accessibilityLabel="Edit profile" />
		</View>
	);
}

export function LogoutButton() {
	const icon = useThemeColor({}, "warning");
	const { signOut } = useAuthentication();

	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
				{
					text: "Cancel",
					style: "cancel"
				},
				{ text: "Logout", style: "destructive", onPress: () => signOut() }
			]
		);
	};
	return <IconButton icon={<LogOut size={22} color={icon} />} onPress={handleLogout} accessibilityLabel="Logout Button" />
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
	}
});