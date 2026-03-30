import { useState, useLayoutEffect, useCallback } from "react";
import { StyleSheet, View, Platform, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import { TextField as TextField } from "@/components/textfield";
import { DatePicker as Picker } from "@/components/date-picker";
import { ChartToggle as Switch } from "@/components/chart-toggle";
import { createIntervention } from "@/services/intervention-service";
import { formatAPIDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";
import { validateIntervention, hasErrors, type InterventionErrors } from "@/utils/form-validation";
import { X, Check } from "lucide-react-native";
import { IconButton } from "@/components/icon-button";

export default function InterventionModal() {
	const navigation = useNavigation();
	const { profileId } = useProfile();
	const warningColour = useThemeColor({}, "warning");
	const accentColour = useThemeColor({}, "accent");
	const background = useThemeColor({}, "background");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [goals, setGoals] = useState("");
	const [success, setSuccess] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [errors, setErrors] = useState<InterventionErrors>({});

	// Create the intervention
	const handleCreateIntervention = useCallback(async () => {
		const validationErrors = validateIntervention({ name, description, goals, startDate, endDate });
		setErrors(validationErrors);
		if (hasErrors(validationErrors)) {
			return;
		}

		try {
			await createIntervention({
				profile_id: profileId,
				name: name.trim(),
				description: description.trim() || null,
				goals: goals.trim() || null,
				success,
				start_date: formatAPIDate(startDate),
				end_date: formatAPIDate(endDate),
			});
			
			router.back();
		} catch {
			Alert.alert("Cannot create intervention", "Please try again");
		}
	}, [name, description, goals, success, startDate, endDate, profileId]);

	// Save and cancel buttons
	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: { backgroundColor: background },
			headerLeft: () => (
				<IconButton icon={<X size={22} color={warningColour} />} onPress={() => router.back()} accessibilityLabel="Cancel" />
			),
			headerRight: () => (
				<IconButton icon={<Check size={22} color={accentColour} />} onPress={handleCreateIntervention} accessibilityLabel="Create" />
			),
		});
	}, [navigation, handleCreateIntervention, warningColour, accentColour, background]);

	return (
		<View style={[styles.container, { backgroundColor: background }]}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
					<TextField
						label="Name"
						value={name}
						onChangeText={setName}
						placeholder="Enter intervention name"
						error={errors.name}
					/>

					<TextField
						label="Goals"
						value={goals}
						onChangeText={setGoals}
						placeholder="Enter goals (optional)"
						multiline
						error={errors.goals}
					/>

					<TextField
						label="Description"
						value={description}
						onChangeText={setDescription}
						placeholder="Enter description (optional)"
						multiline
						error={errors.description}
					/>

					<Switch label="Success" value={success} onValueChange={setSuccess} />

					<Picker
						label="Start Date"
						value={startDate}
						onDateChange={setStartDate}
						maximumDate={endDate}
						error={errors.startDate}
					/>

					<Picker
						label="End Date"
						value={endDate}
						onDateChange={setEndDate}
						minimumDate={startDate}
						error={errors.endDate}
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
	}
});