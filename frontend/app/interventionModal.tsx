import { useState, useLayoutEffect, useCallback } from "react";
import { StyleSheet, TextInput, Platform, ScrollView, TouchableOpacity, KeyboardAvoidingView, Keyboard } from "react-native";
import { router, useNavigation } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DatePickerInput } from "@/components/date-picker";
import { BlockButton } from "@/components/block-button";
import { createIntervention } from "@/services/intervention-service";
import { formatAPIDate } from "@/utils/date-formatting";

export default function InterventionModal() {
	const navigation = useNavigation();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [isCreating, setIsCreating] = useState(false);


	const handleStartChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") {
			setShowStartPicker(false);
			if (event.type === "dismissed" || !selectedDate) {
				return;
			}
		}
		
		if (selectedDate) {
			setStartDate(selectedDate);
		}
	};

	const handleEndChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") {
			setShowEndPicker(false);
			if (event.type === "dismissed" || !selectedDate) {
				return;
			}
		}
		
		if (selectedDate) {
			setEndDate(selectedDate);
		}
	};

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

					<ThemedText style={styles.label}>Intervention Name</ThemedText>
					<TextInput
						style={styles.input}
						value={name}
						onChangeText={setName}
						placeholder="Enter intervention name"
					/>

					<ThemedText style={styles.label}>Description</ThemedText>
					<TextInput
						style={[styles.input, styles.textArea]}
						value={description}
						onChangeText={setDescription}
						placeholder="Enter description (optional)"
						multiline
						numberOfLines={4}
					/>

					<ThemedText style={styles.label}>Start Date</ThemedText>
					<DatePickerInput
						value={startDate}
						onPress={() => {
							Keyboard.dismiss();
							setShowEndPicker(false);
							setShowStartPicker(!showStartPicker); }}
					/>
					{ showStartPicker && (
						<ThemedView style={styles.picker}>
							<DateTimePicker
								value={startDate}
								mode="date"
								display={Platform.OS === "ios" ? "spinner" : "default"}
								onChange={handleStartChange}
								maximumDate={endDate}
							/>
							{Platform.OS === "ios" && (
								<BlockButton onPress={() => setShowStartPicker(false)} title="Done" />
							)}
						</ThemedView>
					)}

					<ThemedText style={styles.label}>End Date</ThemedText>
					<DatePickerInput
						value={endDate}
						onPress={() => {
							Keyboard.dismiss();
							setShowStartPicker(false);
							setShowEndPicker(!showEndPicker);
						}}
					/>
					{ showEndPicker && (
						<ThemedView style={styles.picker}>
							<DateTimePicker
								value={endDate}
								mode="date"
								display={Platform.OS === "ios" ? "spinner" : "default"}
								onChange={handleEndChange}
								minimumDate={startDate}
							/>
							{Platform.OS === "ios" && (
								<BlockButton onPress={() => setShowEndPicker(false)} title="Done" />
							)}
						</ThemedView>
					)}

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
	label: {
		marginVertical: 10,
	},
	input: {
		borderWidth: 1,
		padding: 10,
		marginBottom: 10,
	},
	textArea: {
		minHeight: 100,
	},
	picker: {
		marginTop: 10,
		marginBottom: 10,
	},
	button: {
		padding: 10,
	},
});