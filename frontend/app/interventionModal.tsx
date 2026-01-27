import { useState, useLayoutEffect, useCallback } from "react";
import { StyleSheet, Platform, ScrollView, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { router, useNavigation } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { TextField as TextField } from "@/components/textfield";
import { DatePicker as Picker } from "@/components/date-picker";
import { createIntervention } from "@/services/intervention-service";
import { formatAPIDate } from "@/utils/date-formatting";

export default function InterventionModal() {
	const navigation = useNavigation();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [isCreating, setIsCreating] = useState(false);

	const handleCreateIntervention = useCallback(async () => {
		if (!name.trim()) {
			return;
		}

		setIsCreating(true);
		try {
			await createIntervention({
				name: name.trim(),
				description: description.trim() || null,
				start_date: formatAPIDate(startDate),
				end_date: formatAPIDate(endDate),
			});
			
			router.back();
		} catch {
			console.error("Cannot create intervention");
		} finally {
			setIsCreating(false);
		}
	}, [name, description, startDate, endDate]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity style={styles.button} onPress={() => router.back()}>
					<ThemedText>Cancel</ThemedText>
				</TouchableOpacity>
			),
			headerRight: () => (
				<TouchableOpacity style={styles.button} onPress={handleCreateIntervention} disabled={isCreating || !name.trim()}>
					<ThemedText>{isCreating ? "Creating" : "Create"}</ThemedText>
				</TouchableOpacity>
			),
		});
	}, [navigation, handleCreateIntervention, isCreating]);

	return (
		<ThemedView style={styles.container}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
					<TextField
						label="Intervention Name"
						value={name}
						onChangeText={setName}
						placeholder="Enter intervention name"
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
		</ThemedView> 
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 20,
	},
	button: {
		padding: 10,
	},
});