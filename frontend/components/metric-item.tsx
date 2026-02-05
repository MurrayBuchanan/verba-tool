import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText as Text } from '@/components/themed-text';
import { METRIC_DEFINITIONS } from '@/constants/metrics';

type Props = {
    metricId: string;
    onPress: () => void;
};

export function MetricItem({ metricId, onPress }: Props) {
	const metric = METRIC_DEFINITIONS[metricId];

	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<Text type='strong' numberOfLines={2}>{metric.name}</Text>
			<Text type='caption' numberOfLines={2}>{metric.alias}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		paddingVertical: 10,
		flexDirection: 'column',
	}
});