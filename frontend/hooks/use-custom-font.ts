import { useFont } from "@shopify/react-native-skia";

// Hook used to load font for Victory charts (Skia)
export function useCustomFont(weight: '400' | '500' | '600' | '700' = '400', size: number = 18) {
	const fontMap = {
		'400': require("@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
		'500': require("@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf"),
		'600': require("@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf"),
		'700': require("@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf")
	};

	return useFont(fontMap[weight], size);
}