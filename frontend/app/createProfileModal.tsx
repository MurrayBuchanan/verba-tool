import { useState, useLayoutEffect, useCallback } from "react";
import { StyleSheet, Platform, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { TextField as TextField } from "@/components/textfield";
import { createProfile } from "@/services/profile-service";
import { useThemeColor } from "@/hooks/use-theme-color";
import { X, Check } from "lucide-react-native";
import { IconButton } from "@/components/icon-button";

export default function ProfileModal() {
	const navigation = useNavigation();
	const warningColour = useThemeColor({}, "warning");
	const accentColour = useThemeColor({}, "accent");
	const secondaryBackground = useThemeColor({}, "backgroundSecondary");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const handleCreateProfile = useCallback(async () => {
		if (!name.trim()) {
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
			headerStyle: { backgroundColor: secondaryBackground },
			headerLeft: () => (
				<IconButton icon={<X size={22} color={warningColour} />} onPress={() => router.back()} accessibilityLabel="Cancel" />
			),
			headerRight: () => (
				<IconButton icon={<Check size={22} color={accentColour} />} onPress={handleCreateProfile} accessibilityLabel="Create" />
			),
		});
	}, [navigation, handleCreateProfile, warningColour, accentColour, secondaryBackground]);

	return (
		<View style={[styles.container, { backgroundColor: secondaryBackground }]}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
					<TextField
						label="Name"
						value={name}
						onChangeText={setName}
						placeholder="Enter profile name"
					/>

					<TextField
						label="Description"
						value={description}
						onChangeText={setDescription}
						placeholder="Enter description (optional)"
						multiline
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