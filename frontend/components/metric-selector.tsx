import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText as Text } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

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
	const backgroundColour = useThemeColor({}, 'background');
	const accentColour = useThemeColor({}, 'accent');
	const iconColour = useThemeColor({}, 'icon');
	const textColour = useThemeColor({}, 'text');

	return (
		<View style={styles.container}>
			<Text type="heading" style={styles.heading}>Filter by Metric</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
				{options.map((option) => {
					const isSelected = option.value === selectedValue;
					return (
						<TouchableOpacity
							key={option.value}
							onPress={() => onValueChange(option.value)}
							style={[styles.item, { backgroundColor: isSelected ? accentColour : backgroundColour, borderColor: isSelected ? accentColour : iconColour }]}
                        >
							<Text type="caption" style={[styles.text, { color: isSelected ? '#FFF' : textColour, fontWeight: isSelected ? '500' : '400' }]}>
								{option.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		paddingBottom: 10,
	},
	heading: {
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	content: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		gap: 10,
	},
	item: {
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 14,
		borderWidth: 1,
	},
	text: {
		fontSize: 14,
	},
});
