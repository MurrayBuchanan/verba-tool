import { StyleSheet, Text, type TextProps } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Fonts } from "@/constants/theme";

// This file was generated and modified from the Expo boilerplate using "npx create-expo-app"

type Props = TextProps & {
	lightColour?: string;
	darkColour?: string;
	type?: "default" | "caption" | "strong" | "heading" | "title" | "button";
	align?: "left" | "center" | "right";
};

export function ThemedText({style, lightColour, darkColour, type = "default", align = "left", ...rest}: Props) {
	const textColour = useThemeColor({ light: lightColour, dark: darkColour }, "text");
	const textSecondaryColour = useThemeColor({}, "textSecondary");
	return (
		<Text style={[{ color: textColour },
			type === "default" ? styles.default : undefined,
			type === "caption" ? { ...styles.caption, color: textSecondaryColour } : undefined,
			type === "strong" ? styles.strong : undefined,
			type === "heading" ? styles.heading : undefined,
			type === "title" ? styles.title : undefined,
			type === "button" ? styles.button : undefined,

			align === "left" ? { textAlign: "left" } : undefined,
			align === "center" ? { textAlign: "center" } : undefined,
			align === "right" ? { textAlign: "right" } : undefined,

			style,
		]}
		{...rest}
		/>
	);
}

// Typography inspired by: https://m3.material.io/styles/typography/overview
const styles = StyleSheet.create({
	default: {
		fontFamily: Fonts.body,
		fontSize: 16,
		lineHeight: 24,
	},
	caption: {
		fontFamily: Fonts.body,
		fontSize: 14,
		lineHeight: 16,
	},
	strong: {
		fontFamily: Fonts.uiMedium,
		fontSize: 16,
		lineHeight: 24,
	},
	heading: {
		fontFamily: Fonts.uiSemiBold,
		fontSize: 20,
		lineHeight: 26,
	},
	title: {
		fontFamily: Fonts.uiSemiBold,
		fontSize: 28,
		lineHeight: 36,
	},
	button: {
		fontFamily: Fonts.uiMedium,
		fontSize: 16,
		lineHeight: 22,
		color: "#fff"
	}
});