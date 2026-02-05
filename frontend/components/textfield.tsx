import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export type TextFieldProps = {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	multiline?: boolean;
	editable?: boolean;
};

export function TextField({ label, value, onChangeText, placeholder, multiline = false, editable = true }: TextFieldProps) {
	const [focused, setFocused] = useState(false);
	const accentColour = useThemeColor({}, 'accent');
	const textColour = useThemeColor({}, 'text');
	const backgroundColour = useThemeColor({}, 'backgroundSecondary');
	const placeholderColour = useThemeColor({}, 'backgroundTertiary');

	if (!editable) {
		return (
			<View style={styles.container}>
				<Text type="strong">{label}</Text>
				<Text>{value || placeholder || ""}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text type="strong">{label}</Text>
			<TextInput
				style={[ styles.input, multiline && styles.textArea,
					{
						borderColor: focused ? accentColour : 'transparent',
						color: textColour,
						backgroundColor: backgroundColour,
					}
				]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={placeholderColour}
				multiline={multiline}
				editable={editable}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
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
	},
	input: {
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
		marginVertical: 8,
		fontSize: 16,
		minHeight: 40,
	},
	textArea: {
		minHeight: 100,
		textAlignVertical: "top",
		borderRadius: 12,
	},
});