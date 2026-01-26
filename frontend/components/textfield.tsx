import { StyleSheet, TextInput } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type TextFieldProps = {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	multiline?: boolean;
	editable?: boolean;
};

export function TextField({ label, value, onChangeText, placeholder, multiline = false, editable = true }: TextFieldProps) {
	const colorScheme = useColorScheme() ?? 'light';

	if (!editable) {
		return (
			<View style={styles.container}>
				<Text style={styles.label}>{label}</Text>
				<Text type="caption">{value || placeholder || ""}</Text>
			</View>
		);
	}

	const borderColour = Colors[colorScheme].tertiary;

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				style={[ styles.input, multiline && styles.textArea,
					{
						borderColor: borderColour,
						color: Colors[colorScheme].text,
						backgroundColor: Colors[colorScheme].background,
					}
				]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={Colors[colorScheme].text + '60'}
				multiline={multiline}
				editable={editable}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	label: {
		marginBottom: 8,
		fontSize: 16,
		fontWeight: '500',
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		minHeight: 40,
	},
	textArea: {
		minHeight: 100,
		textAlignVertical: "top",
	},
});