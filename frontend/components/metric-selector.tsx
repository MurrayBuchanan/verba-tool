import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText as Text } from '@/components/themed-text';

export type MetricOption = {
	label: string;
	value: string;
};

export type MetricSelectorProps = {
	options: MetricOption[];
	selectedValue: string;
	onValueChange: (value: string) => void;
};

export function MetricSelector({ options, selectedValue, onValueChange }: MetricSelectorProps) {
	const textColor = useThemeColor({}, 'text');
	const backgroundColor = useThemeColor({}, 'background');
	const tintColor = useThemeColor({}, 'tint');
	const iconColor = useThemeColor({}, 'icon');

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
			{options.map((option) => {
				const isSelected = option.value === selectedValue;
				return (
					<TouchableOpacity
						key={option.value}
						onPress={() => onValueChange(option.value)}
						style={[styles.item, { backgroundColor: isSelected ? tintColor : backgroundColor, borderColor: isSelected ? tintColor : iconColor }]}
                        >
						<Text type="caption" style={[styles.text, { color: isSelected ? '#FFF' : textColor, fontWeight: isSelected ? '600' : '400' }]}>
							{option.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		gap: 8,
	},
	item: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		borderWidth: 1,
		marginRight: 8,
	},
	text: {
		fontSize: 14,
	},
});
