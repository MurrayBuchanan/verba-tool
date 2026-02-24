import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

// This file was generated and modified from the Expo boilerplate using "npx create-expo-app"
// To support static rendering, this value needs to be re-calculated on the client side for web

export function useColorScheme() {
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		setHasHydrated(true);
	}, []);

	const colorScheme = useRNColorScheme();

	if (hasHydrated) {
		return colorScheme;
	}

	return "light";
}