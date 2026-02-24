import { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { StyleSheet, View, Platform, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { TextField as TextField } from "@/components/textfield";
import { getProfile, updateProfile, deleteProfile } from "@/services/profile-service";
import { useThemeColor } from "@/hooks/use-theme-color";
import { validateProfile, hasErrors, ProfileErrors } from "@/utils/form-validation";
import { X, Check } from "lucide-react-native";
import { IconButton } from "@/components/icon-button";
import { BlockButton } from "@/components/block-button";

export default function EditProfileModal() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const navigation = useNavigation();
	const warningColour = useThemeColor({}, "warning");
	const accentColour = useThemeColor({}, "accent");
	const secondaryBackground = useThemeColor({}, "backgroundSecondary");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState<ProfileErrors>({});

	useEffect(() => {
		async function getData() {
			try {
				const data = await getProfile(parseInt(id, 10));
				setName(data.name ?? "");
				setDescription(data.description ?? "");
			} catch {
				Alert.alert("Failed to load profile", "Please try again");
				router.back();
			}
		}
		getData();
	}, [id]);

	const handleUpdateProfile = useCallback(async () => {
		const validationErrors = validateProfile({ name, description });
		setErrors(validationErrors);
		if (hasErrors(validationErrors)) {
			return null;
		}

		try {
			await updateProfile(parseInt(id, 10), { name: name.trim(), description: description.trim() || null });
			router.back();
		} catch {
			Alert.alert("Cannot update profile", "Please try again");
		}
	}, [id, name, description]);

	const handleDeleteProfile = useCallback(() => {
		Alert.alert("Delete profile", "Are you sure you want to delete this profile?", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Delete", style: "destructive", onPress: async () => {
				try {
					await deleteProfile(parseInt(id, 10));
					router.dismissTo("/profilesScreen");
				} catch {
					Alert.alert("Cannot delete profile", "Please try again");
				}
			}},
		]);
	}, [id]);

	const handleSwitchProfile = useCallback(() => {
		router.dismissTo("/profilesScreen");
		router.push({ pathname: "/profilesScreen" });
	}, [id]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: { backgroundColor: secondaryBackground },
			headerLeft: () => (
				<IconButton icon={<X size={22} color={warningColour} />} onPress={() => router.back()} accessibilityLabel="Cancel Button" />
			),
			headerRight: () => (
				<IconButton icon={<Check size={22} color={accentColour} />} onPress={handleUpdateProfile} accessibilityLabel="Save Button" />
			),
		});
	}, [navigation, handleUpdateProfile, warningColour, accentColour, secondaryBackground]);

	return (
		<View style={[styles.container, { backgroundColor: secondaryBackground }]}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
					<TextField
						label="Name"
						value={name}
						onChangeText={setName}
						placeholder="Enter profile name"
						error={errors.name}
					/>

					<TextField
						label="Description"
						value={description}
						onChangeText={setDescription}
						placeholder="Enter description (optional)"
						multiline
						error={errors.description}
					/>
				</ScrollView>
				<View style={styles.bottomButton}>
					<BlockButton
						title="Switch Profile"
						onPress={handleSwitchProfile}
						lightColour={accentColour}
						darkColour={accentColour}
					/>
					<BlockButton
						title="Delete profile"
						onPress={handleDeleteProfile}
						lightColour={warningColour}
						darkColour={warningColour}
					/>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 100,
		gap: 24,
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
	},
	bottomButton: {
		gap: 16,
		position: "absolute",
		bottom: 20,
		left: 20,
		right: 20,
	},
});
