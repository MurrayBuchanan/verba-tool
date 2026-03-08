import { useState, useLayoutEffect, useCallback } from "react";
import { StyleSheet, Platform, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { TextField as TextField } from "@/components/textfield";
import { createProfile } from "@/services/profile-service";
import { useThemeColor } from "@/hooks/use-theme-color";
import { validateProfile, hasErrors, type ProfileErrors } from "@/utils/form-validation";
import { X, Check } from "lucide-react-native";
import { IconButton } from "@/components/icon-button";

export default function ProfileModal() {
	const navigation = useNavigation();
	const warningColour = useThemeColor({}, "warning");
	const accentColour = useThemeColor({}, "accent");
	const background = useThemeColor({}, "background");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState<ProfileErrors>({});

	const handleCreateProfile = useCallback(async () => {
		const validationErrors = validateProfile({ name, description });
		setErrors(validationErrors);
		if (hasErrors(validationErrors)) {
			return;
		}

		try {
			await createProfile({
				name: name.trim(),
				description: description.trim() || null,
			});
			
			router.back();
		} catch {
			Alert.alert("Cannot create profile", "Please try again");
		}
	}, [name, description]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: { backgroundColor: background },
			headerLeft: () => (
				<IconButton icon={<X size={22} color={warningColour} />} onPress={() => router.back()} accessibilityLabel="Cancel" />
			),
			headerRight: () => (
				<IconButton icon={<Check size={22} color={accentColour} />} onPress={handleCreateProfile} accessibilityLabel="Create" />
			),
		});
	}, [navigation, handleCreateProfile, warningColour, accentColour, background]);

	return (
		<View style={[styles.container, { backgroundColor: background }]}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
			</KeyboardAvoidingView>
		</View> 
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 20,
		gap: 24,
	},
});