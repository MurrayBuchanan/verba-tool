import { StyleSheet } from 'react-native';
import { ThemedText as Text } from '@/components/themed-text';
import { ThemedView as View } from '@/components/themed-view';
import { Lightbulb } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export function Explaination({ text }: { text: string }) {
	const textSecondary = useThemeColor({}, 'textSecondary');
	const backgroundColor = useThemeColor({}, 'backgroundSecondary');

	return (
		<View style={[styles.container, { backgroundColor }]} lightColour={backgroundColor} darkColour={backgroundColor}>
			<View style={styles.content} lightColour={backgroundColor} darkColour={backgroundColor}>
				<Lightbulb size={18} color={textSecondary} />
				<Text type="caption">About this</Text>
			</View>
			<Text>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 8,
	},
});