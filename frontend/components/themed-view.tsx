import { View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

// This file was generated and modified from the Expo boilerplate using "npx create-expo-app"

type Props = ViewProps & {
    lightColour?: string;
  	darkColour?: string;
};

export function ThemedView({ style, lightColour, darkColour, ...otherProps }: Props) {
  	const backgroundColour = useThemeColor({ light: lightColour, dark: darkColour }, "background");

  	return <View style={[{ backgroundColor: backgroundColour }, style]} {...otherProps} />;
}