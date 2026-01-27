import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';

// This file was generated and modified from the Expo boilerplate using 'npx create-expo-app'

export const unstable_settings = {
  	anchor: 'index',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="metricScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Metric", headerBackTitle: "Back" }} />
				<Stack.Screen name="conversationScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Chat", headerBackTitle: "Back" }} />
				<Stack.Screen name="interventionScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Intervention", headerBackTitle: "Back" }} />
				<Stack.Screen name="interventionModal" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Intervention' }} />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
  	);
}
