import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText as Text } from '@/components/themed-text';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
    name: string;
    onPress: () => void;
};

export function ProfileItem({ name, onPress }: Props) {
	const iconColour = useThemeColor({}, 'icon');
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<Text type='strong' numberOfLines={2}>{name}</Text>
			<ChevronRight size={18} color={iconColour} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		paddingVertical: 10,
		flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
	}
});