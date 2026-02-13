import { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Collapsible from "react-native-collapsible";
import { ThemedText as Text } from "@/components/themed-text";
import { Calendar } from 'lucide-react-native';
import { formatDisplayDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
	label: string;
	value: Date;
	onDateChange: (date: Date) => void;
	minimumDate?: Date;
	maximumDate?: Date;
	editable?: boolean;
	error?: string;
};

export function DatePicker({ label, value, onDateChange, minimumDate, maximumDate, editable = true, error }: Props) {
	const [showPicker, setShowPicker] = useState(false);
	const accentColour = useThemeColor({}, 'accent');
	const iconColour = useThemeColor({}, 'icon');
	const backgroundColour = useThemeColor({}, 'active');
	const warningColour = useThemeColor({}, 'warning');
	const borderColour = error ? warningColour : showPicker ? accentColour : 'transparent';

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

	return !editable ? (
		<View>
			<Text type="strong" style={styles.notEditableLabel}>{label}</Text>
			<Text type="caption">{formatDisplayDate(value)}</Text>
		</View>
	) : (
		<View>
			<Text type="strong">{label}</Text>
			<TouchableOpacity onPress={handlePress} style={[styles.input, { borderColor: borderColour, backgroundColor: backgroundColour }]}>
				<View style={styles.row}>
					<Text type="caption">{formatDisplayDate(value)}</Text>
					<Calendar size={20} color={iconColour} />
				</View>
			</TouchableOpacity>
			{ error ? <Text type="caption" style={{ color: warningColour }}>{error}</Text> : null}
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
	input: {
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
		marginTop: 16,
		marginBottom: 10,
	},
	notEditableLabel: {
		marginBottom: 12,
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
		alignItems: "center",
		justifyContent: "center",
	},
	select: {
		alignItems: 'center',
		paddingVertical: 12,
	}
});