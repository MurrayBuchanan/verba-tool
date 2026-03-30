import { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { StyleSheet, Platform, ScrollView, KeyboardAvoidingView, Alert, ActivityIndicator } from "react-native";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { TextField as TextField } from "@/components/textfield";
import { DatePicker as Picker } from "@/components/date-picker";
import { ChartToggle as Switch } from "@/components/chart-toggle";
import { getIntervention, updateIntervention } from "@/services/intervention-service";
import { formatAPIDate, dateToMidnight } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";
import { validateIntervention, hasErrors, type InterventionErrors } from "@/utils/form-validation";
import { X, Check } from "lucide-react-native";
import { IconButton } from "@/components/icon-button";

export default function EditInterventionModal() {
	const { id } = useLocalSearchParams<{ id: string }>();
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

	// Fetch the intervention when the screen is focused
	useEffect(() => {
		async function getData() {
			try {
				const data = await getIntervention(parseInt(id, 10));
				setName(data.name ?? "");
				setDescription(data.description ?? "");
				setGoals(data.goals ?? "");
				setSuccess(data.success ?? false);
				setStartDate(new Date(data.start_date));
				setEndDate(new Date(data.end_date));
			} catch {
				Alert.alert("Failed to load intervention", "Please try again");
				router.back();
			}
		}
		getData();
	}, [id]);

	// Update the intervention
	const handleUpdateIntervention = useCallback(async () => {
		const validationErrors = validateIntervention({ name, description, startDate, endDate });
		setErrors(validationErrors);
		if (hasErrors(validationErrors)) {
			return;
		}

		try {
			await updateIntervention(parseInt(id, 10), {
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
			Alert.alert("Failed to update intervention", "Please try again");
		}
	}, [id, name, description, goals, success, startDate, endDate, profileId]);

	// Save and cancel buttons
	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: { backgroundColor: background },
			headerLeft: () => (
				<IconButton icon={<X size={22} color={warningColour} />} onPress={() => router.back()} accessibilityLabel="Cancel" />
			),
			headerRight: () => (
				<IconButton icon={<Check size={22} color={accentColour} />} onPress={handleUpdateIntervention} accessibilityLabel="Save" />
			),
		});
	}, [navigation, handleUpdateIntervention, warningColour, accentColour, background]);

	return (
		<View style={[styles.container, { backgroundColor: background }]}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
					<TextField
						label="Intervention Name"
						value={name}
						onChangeText={setName}
						placeholder="Enter intervention name"
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

					<TextField
						label="Goals"
						value={goals}
						onChangeText={setGoals}
						placeholder="Enter goals (optional)"
						multiline
						error={errors.goals}
					/>

					<Switch label="Success" value={success} onValueChange={setSuccess} />

					<Picker
						label="Start Date"
						value={startDate}
						onDateChange={setStartDate}
						maximumDate={dateToMidnight(endDate)}
						error={errors.startDate}
					/>

					<Picker
						label="End Date"
						value={endDate}
						onDateChange={setEndDate}
						minimumDate={dateToMidnight(startDate)}
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
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
	}
});
