import { useState, useLayoutEffect, useCallback } from "react";
import { StyleSheet, Platform, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { TextField as TextField } from "@/components/textfield";
import { DatePicker as Picker } from "@/components/date-picker";
import { createIntervention } from "@/services/intervention-service";
import { formatAPIDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";
import { X, Check } from "lucide-react-native";
import { IconButton } from "@/components/icon-button";

export default function InterventionModal() {
	const navigation = useNavigation();
	const { profileId } = useProfile();
	const warningColour = useThemeColor({}, "warning");
	const accentColour = useThemeColor({}, "accent");
	const secondaryBackground = useThemeColor({}, "backgroundSecondary");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	const handleCreateIntervention = useCallback(async () => {
		if (!name.trim()) {
			return;
		}

		try {
			await createIntervention({
				profile_id: profileId,
				name: name.trim(),
				description: description.trim() || null,
				start_date: formatAPIDate(startDate),
				end_date: formatAPIDate(endDate),
			});
			
			router.back();
		} catch {
			console.error("Cannot create intervention");
		}
	}, [name, description, startDate, endDate, profileId]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: { backgroundColor: secondaryBackground },
			headerLeft: () => (
				<IconButton icon={<X size={22} color={warningColour} />} onPress={() => router.back()} accessibilityLabel="Cancel" />
			),
			headerRight: () => (
				<IconButton icon={<Check size={22} color={accentColour} />} onPress={handleCreateIntervention} accessibilityLabel="Create" />
			),
		});
	}, [navigation, handleCreateIntervention, warningColour, accentColour, secondaryBackground]);

	return (
		<View style={[styles.container, { backgroundColor: secondaryBackground }]}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
					<TextField
						label="Annotation Name"
						value={name}
						onChangeText={setName}
						placeholder="Enter annotation name"
					/>

					<TextField
						label="Description"
						value={description}
						onChangeText={setDescription}
						placeholder="Enter description (optional)"
						multiline
					/>

					<Picker
						label="Start Date"
						value={startDate}
						onDateChange={setStartDate}
						maximumDate={endDate}
					/>

					<Picker
						label="End Date"
						value={endDate}
						onDateChange={setEndDate}
						minimumDate={startDate}
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