import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText as Text } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type Views = {
	label: string;
	value: string;
};

type Props = {
	options: Views[];
	selectedValue: string;
	onValueChange: (value: string) => void;
};

export function AnnotationSelector({ options, selectedValue, onValueChange }: Props) {
	const accentColour = useThemeColor({}, 'accent');
	const textColour = useThemeColor({}, 'text');
	const secondaryBackgroundColour = useThemeColor({}, 'backgroundSecondary');

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				{options.map((option) => (
					<TouchableOpacity key={option.value} onPress={() => onValueChange(option.value)} style={[styles.item, { backgroundColor: option.value === selectedValue ? accentColour : secondaryBackgroundColour }]}>
						<Text type="caption" style={{ color: option.value === selectedValue ? '#FFF' : textColour }} numberOfLines={1}>{option.label}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		paddingBottom: 10,
	},
	content: {
		flexDirection: 'row',
		paddingVertical: 10,
		gap: 10,
	},
	item: {
		flex: 1,
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
	}
});