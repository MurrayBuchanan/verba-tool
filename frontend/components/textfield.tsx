import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";;
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	multiline?: boolean;
	editable?: boolean;
};

export function TextField({ label, value, onChangeText, placeholder, multiline = false, editable = true }: Props) {
	const [focused, setFocused] = useState(false);
	const accentColour = useThemeColor({}, 'accent');
	const textColour = useThemeColor({}, 'text');
	const backgroundColour = useThemeColor({}, 'active');
	const placeholderColour = useThemeColor({}, 'textSecondary');

	if (!editable) {
		return (
			<View>
				<Text type="strong">{label}</Text>
				<Text type="caption" style={styles.text}>{ value || placeholder }</Text>
			</View>
		);
	}

	return (
		<View>
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
	input: {
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
		marginTop: 16,
		minHeight: 40,
	},
	text: {
		marginTop: 12,
	},
	textArea: {
		minHeight: 100,
		textAlignVertical: "top",
		borderRadius: 12,
	},
});