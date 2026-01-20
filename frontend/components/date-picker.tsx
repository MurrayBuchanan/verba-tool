import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedView as View } from '@/components/themed-view';
import { ThemedText as Text } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatDisplayDate } from '@/utils/date-formatting';

export type DatePickerInputProps = {
	value: Date;
	onPress: () => void;
	placeholder?: string;
};

export function DatePickerInput({ value, onPress, placeholder = 'Select date' }: DatePickerInputProps) {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				<Text type='caption' style={!value && styles.placeholder}>{value ? formatDisplayDate(value) : placeholder}</Text>
				<IconSymbol name="calendar" size={20} color="#666" />
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		marginBottom: 4,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	placeholder: {
		opacity: 0.6,
	},
});