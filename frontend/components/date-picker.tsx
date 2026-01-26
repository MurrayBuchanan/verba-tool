import { useState } from "react";
import { TouchableOpacity, StyleSheet, Platform, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Collapsible from "react-native-collapsible";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { BlockButton } from "@/components/block-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { formatDisplayDate } from "@/utils/date-formatting";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type DatePickerProps = {
	label: string;
	value: Date;
	onDateChange: (date: Date) => void;
	minimumDate?: Date;
	maximumDate?: Date;
	editable?: boolean;
};

export function DatePicker({ label, value, onDateChange, minimumDate, maximumDate, editable = true }: DatePickerProps) {
	const [showPicker, setShowPicker] = useState(false);
	const colorScheme = useColorScheme() ?? 'light';

	const handleDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") {
			setShowPicker(false);
			if (event.type === "dismissed" || !selectedDate) {
				return;
			}
		}

		if (selectedDate) {
			onDateChange(selectedDate);
		}
	};

	const handlePress = () => {
		if (!editable) return;
		Keyboard.dismiss();
		setShowPicker(!showPicker);
	};

	if (!editable) {
		return (
			<View style={styles.container}>
				<Text style={styles.label}>{label}</Text>
				<Text type="caption">{value.toLocaleDateString()}</Text>
			</View>
		);
	}

	const borderColour = Colors[colorScheme].tertiary;

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TouchableOpacity onPress={handlePress} style={[styles.input, { borderColor: borderColour }]}>
				<View style={styles.row}>
					<Text type='caption'>{formatDisplayDate(value)}</Text>
					<IconSymbol name="calendar" size={20} color={Colors[colorScheme].icon} />
				</View>
			</TouchableOpacity>
			<Collapsible collapsed={!showPicker}>	
				<DateTimePicker
					value={value}
					mode="date"
					display={Platform.OS === "ios" ? "spinner" : "default"}
					onChange={handleDateChange}
					minimumDate={minimumDate}
					maximumDate={maximumDate}
				/>
				{Platform.OS === "ios" && (
					<BlockButton 
						onPress={() => setShowPicker(false)} 
						title="Select"
						lightBackgroundColour={Colors.light.secondaryBackground}
						darkBackgroundColour={Colors.dark.secondaryBackground}
					/>
				)}
			</Collapsible>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 20,
	},
	label: {
		marginBottom: 8,
		fontSize: 16,
		fontWeight: '500',
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});