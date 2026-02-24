import { Theme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// This file was generated and modified from the Expo boilerplate using "npx create-expo-app"
// https://docs.expo.dev/guides/color-schemes/

export type ThemeColorProps = {
	light?: string;
	dark?: string;
};

export function useThemeColor(props: ThemeColorProps, colorName: keyof typeof Theme.light & keyof typeof Theme.dark) {
	const theme = useColorScheme() ?? "light";
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Theme[theme][colorName];
	}
}