import { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Collapsible from "react-native-collapsible";
import { ThemedText as Text } from "@/components/themed-text";
import { Calendar } from 'lucide-react-native';
import { formatDisplayDate } from "@/utils/date-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";

export type Props = {
	label: string;
	value: Date;
	onDateChange: (date: Date) => void;
	minimumDate?: Date;
	maximumDate?: Date;
	editable?: boolean;
};

export function DatePicker({ label, value, onDateChange, minimumDate, maximumDate, editable = true }: Props) {
	const [showPicker, setShowPicker] = useState(false);
	const accentColour = useThemeColor({}, 'accent');
	const iconColour = useThemeColor({}, 'icon');
	const backgroundColour = useThemeColor({}, 'backgroundSecondary');

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
				<Text type="strong">{label}</Text>
				<Text>{value.toLocaleDateString()}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text type="strong">{label}</Text>
			<TouchableOpacity onPress={handlePress} style={[styles.input, { borderColor: showPicker ? accentColour : 'transparent', backgroundColor: backgroundColour }]}>
				<View style={styles.row}>
					<Text>{formatDisplayDate(value)}</Text>
					<Calendar size={20} color={iconColour} />
				</View>
			</TouchableOpacity>
			{Platform.OS === "android" ? (
				showPicker && (
					<DateTimePicker
						value={value}
						mode="date"
						display="default"
						onChange={handleDateChange}
						minimumDate={minimumDate}
						maximumDate={maximumDate}
					/>
				)
			) : (
				<Collapsible collapsed={!showPicker}>
					<View style={[styles.collapsible, { backgroundColor: backgroundColour }]}>
						<DateTimePicker
							value={value}
							mode="date"
							display="spinner"
							onChange={handleDateChange}
							minimumDate={minimumDate}
							maximumDate={maximumDate}
						/>
						<TouchableOpacity onPress={() => setShowPicker(false)} style={styles.select}>
							<Text>Select</Text>
						</TouchableOpacity>
					</View>
				</Collapsible>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 20,
	},
	input: {
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	collapsible: {
		borderRadius: 16,
		overflow: 'hidden',
		marginTop: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
	},
	select: {
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
});