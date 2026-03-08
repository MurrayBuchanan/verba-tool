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
	error?: string;
};

export function TextField({ label, value, onChangeText, placeholder, multiline = false, error }: Props) {
	const [focused, setFocused] = useState(false);
	const accent = useThemeColor({}, "accent");
	const text = useThemeColor({}, "text");
	const placeholderText = useThemeColor({}, "textSecondary");
	const background = useThemeColor({}, "backgroundSecondary");
	const warning = useThemeColor({}, "warning");
	const border = error ? warning : focused ? accent : "transparent";

	return (
		<View>
			<Text type="strong">{label}</Text>
			<TextInput
				style={[ styles.input, multiline && styles.textArea, { borderColor: border, color: text, backgroundColor: background }]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={placeholderText}
				multiline={multiline}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
			/>
			{ error ? <Text type="caption" style={{ color: warning }}>{error}</Text> : null }
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 12,
		marginTop: 16,
		marginBottom: 10
	},
	textArea: {
		minHeight: 100,
		textAlignVertical: "top",
		borderRadius: 12
	}
});