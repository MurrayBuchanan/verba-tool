import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { IconButton } from '@/components/icon-button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SessionProvider, useAuthentication } from '@/hooks/use-authentication';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  	anchor: 'index',
};

function RootNavigator() {
	const { session, isLoading } = useAuthentication();
	const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
	const background = useThemeColor({}, 'background');
	const text = useThemeColor({}, 'text');
	const icon = useThemeColor({}, 'icon');

	const headerBack = () => (
		<IconButton icon={<ArrowLeft size={22} color={icon} />} onPress={() => router.back()} accessibilityLabel="Go back" />
	);

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
		<ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{ headerShadowVisible: false, headerStyle: { backgroundColor: background }, headerTintColor: text }}>
				<Stack.Protected guard={!!session}>
					<Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
					<Stack.Screen name="metricScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Metric", headerBackVisible: false, headerLeft: headerBack }} />
					<Stack.Screen name="conversationScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Chat", headerBackVisible: false, headerLeft: headerBack }} />
					<Stack.Screen name="interventionScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Annotation", headerBackVisible: false, headerLeft: headerBack }} />
					<Stack.Screen name="interventionModal" options={{ presentation: 'modal', headerShown: true, headerTitle: 'New Annotation' }} />
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