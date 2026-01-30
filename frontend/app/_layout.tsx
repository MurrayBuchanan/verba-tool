import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SessionProvider, useAuthentication } from '@/hooks/use-authentication';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  	anchor: 'index',
};

function RootNavigator() {
	const { session, isLoading } = useAuthentication();
	const colorScheme = useColorScheme();

	useEffect(() => {
		if (!isLoading) {
			SplashScreen.hideAsync();
		}
	}, [isLoading]);

	// Show splash until authentication is loaded
	if (isLoading) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Protected guard={!!session}>
					<Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
					<Stack.Screen name="metricScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Metric", headerBackTitle: "Back" }} />
					<Stack.Screen name="conversationScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Chat", headerBackTitle: "Back" }} />
					<Stack.Screen name="interventionScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Intervention", headerBackTitle: "Back" }} />
					<Stack.Screen name="interventionModal" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Intervention' }} />
				</Stack.Protected>

				<Stack.Protected guard={!session}>
					<Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
				</Stack.Protected>
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
  	);
}

export default function RootLayout() {
	return (
		<SessionProvider>
			<RootNavigator />
		</SessionProvider>
	);
}