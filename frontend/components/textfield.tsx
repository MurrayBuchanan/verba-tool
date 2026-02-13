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
	error?: string;
};

export function TextField({ label, value, onChangeText, placeholder, multiline = false, editable = true, error }: Props) {
	const [focused, setFocused] = useState(false);
	const accentColour = useThemeColor({}, 'accent');
	const textColour = useThemeColor({}, 'text');
	const placeholderColour = useThemeColor({}, 'textSecondary');
	const backgroundColour = useThemeColor({}, 'active');
	const warningColour = useThemeColor({}, 'warning');
	const borderColour = error ? warningColour : focused ? accentColour : 'transparent';

	if (!editable) {
		return (
			<View>
				<Text type="strong" style={styles.notEditableLabel}>{label}</Text>
				<Text type="caption">{ value || placeholder }</Text>
			</View>
		);
	}

	return (
		<View>
			<Text type="strong">{label}</Text>
			<TextInput
				style={[ styles.input, multiline && styles.textArea,
					{
						borderColor: borderColour,
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
			{ error ? <Text type="caption" style={{ color: warningColour }}>{error}</Text> : null }
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
		marginTop: 16,
		marginBottom: 10,
	},
	notEditableLabel: {
		marginBottom: 12,
	},
	textArea: {
		minHeight: 100,
		textAlignVertical: "top",
		borderRadius: 12,
	},
});