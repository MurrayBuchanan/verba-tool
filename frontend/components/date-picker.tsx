import { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Collapsible from "react-native-collapsible";
import { ThemedText as Text } from "@/components/themed-text";
import { Calendar } from "lucide-react-native";
import { formatDisplayDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
	label: string;
	value: Date;
	onDateChange: (date: Date) => void;
	minimumDate?: Date;
	maximumDate?: Date;
	error?: string;
};

export function DatePicker({ label, value, onDateChange, minimumDate, maximumDate, error }: Props) {
	const [showPicker, setShowPicker] = useState(false);
	const accent = useThemeColor({}, "accent");
	const icon = useThemeColor({}, "icon");
	const background = useThemeColor({}, "backgroundSecondary");
	const warning = useThemeColor({}, "warning");
	const border = error ? warning : showPicker ? accent : "transparent";

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
		Keyboard.dismiss();
		setShowPicker(!showPicker);
	};

	// Different date pickers for iOS and Android due to using the native component
	return (
		<View>
			<Text type="strong">{label}</Text>
			<TouchableOpacity onPress={handlePress} style={[styles.input, { borderColor: border, backgroundColor: background }]}>
				<View style={styles.row}>
					<Text type="caption">{formatDisplayDate(value)}</Text>
					<Calendar size={20} color={icon} />
				</View>
			</TouchableOpacity>
			{ error ? <Text type="caption" style={{ color: warning }}>{error}</Text> : null}
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
					<View style={[styles.collapsible, { backgroundColor: background }]}>
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
		borderRadius: 12,
		padding: 12,
		marginTop: 16,
		marginBottom: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	collapsible: {
		borderRadius: 16,
		overflow: "hidden",
		marginTop: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	select: {
		alignItems: "center",
		paddingVertical: 12,
	}
});