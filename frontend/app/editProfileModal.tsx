import { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { StyleSheet, View, Platform, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { TextField as TextField } from "@/components/textfield";
import { getProfile, updateProfile, deleteProfile, uploadProfilePicture, deleteProfilePicture } from "@/services/profile-service";
import { ProfilePhotoField } from "@/components/profile-photo-field";
import { resolveProfilePictureUrl } from "@/utils/profile-picture";
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
	const background = useThemeColor({}, "background");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState<ProfileErrors>({});
	const [remotePictureUrl, setRemotePictureUrl] = useState<string | null>(null);
	const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
	const [removePictureRequested, setRemovePictureRequested] = useState(false);

	// Fetch the profile when the screen is focused
	useEffect(() => {
		async function getData() {
			try {
				const data = await getProfile(parseInt(id, 10));
				setFirstName(data.first_name ?? "");
				setLastName(data.last_name ?? "");
				setDescription(data.description ?? "");
				setRemotePictureUrl(data.picture_url ?? null);
				setPendingImageUri(null);
				setRemovePictureRequested(false);
			} catch {
				Alert.alert("Failed to load profile", "Please try again");
				router.back();
			}
		}
		getData();
	}, [id]);

	// Update the profile
	const handleUpdateProfile = useCallback(async () => {
		const validationErrors = validateProfile({ firstName, lastName, description });
		setErrors(validationErrors);
		if (hasErrors(validationErrors)) {
			return null;
		}

		try {
			const pid = parseInt(id, 10);
			await updateProfile(pid, {
				first_name: firstName.trim(),
				last_name: lastName.trim(),
				description: description.trim() || null,
			});
			if (pendingImageUri) {
				await uploadProfilePicture(pid, pendingImageUri);
			} else if (removePictureRequested && remotePictureUrl) {
				await deleteProfilePicture(pid);
			}
			router.back();
		} catch {
			Alert.alert("Cannot update profile", "Please try again");
		}
	}, [id, firstName, lastName, description, pendingImageUri, removePictureRequested, remotePictureUrl]);

	// Delete the profile
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

	// Save and cancel buttons
	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: { backgroundColor: background },
			headerLeft: () => (
				<IconButton icon={<X size={22} color={warningColour} />} onPress={() => router.back()} accessibilityLabel="Cancel Button" />
			),
			headerRight: () => (
				<IconButton icon={<Check size={22} color={accentColour} />} onPress={handleUpdateProfile} accessibilityLabel="Save Button" />
			),
		});
	}, [navigation, handleUpdateProfile, warningColour, accentColour, background]);

	return (
		<View style={[styles.container, { backgroundColor: background }]}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
					<ProfilePhotoField
						displayUri={pendingImageUri ?? (removePictureRequested ? null : resolveProfilePictureUrl(remotePictureUrl))}
						onPick={(uri) => {
							setPendingImageUri(uri);
							setRemovePictureRequested(false);
						}}
						onRemove={() => {
							setPendingImageUri(null);
							setRemovePictureRequested(true);
						}}
						canRemove={!!pendingImageUri || (!removePictureRequested && !!resolveProfilePictureUrl(remotePictureUrl))}
					/>
					<TextField
						label="First name"
						value={firstName}
						onChangeText={setFirstName}
						placeholder="Enter first name"
						error={errors.firstName}
					/>
					<TextField
						label="Last name"
						value={lastName}
						onChangeText={setLastName}
						placeholder="Enter last name"
						error={errors.lastName}
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
	}
});
