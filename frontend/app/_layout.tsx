import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { IconButton } from '@/components/icon-button';
import { LogoutButton } from '@/components/account-buttons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SessionProvider, useAuthentication } from '@/context/SessionContext';
import { ProfileProvider } from '@/context/ProfileContext';

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

	// Show loading/splash screen until authentication is checked
	useEffect(() => {
		if (!isLoading) {
			SplashScreen.hideAsync();
		}
	}, [isLoading]);

	if (isLoading) {
		return null;
	}

	return (
		<ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{ headerShadowVisible: false, headerStyle: { backgroundColor: background }, headerTintColor: text }}>
				{/* Authenticated routes */}
				<Stack.Protected guard={!!session}>
					<Stack.Screen name="profilesScreen" options={{ headerShown: true, headerTitle: "Profiles", headerBackVisible: false, headerRight: () => <LogoutButton /> }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="metricScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Indicator", headerBackVisible: false, headerLeft: () => (<IconButton icon={<ArrowLeft size={22} color={icon} />} onPress={() => router.back()} accessibilityLabel="Go back" /> )}} />
					<Stack.Screen name="conversationScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Chat", headerBackVisible: false, headerLeft: () => (<IconButton icon={<ArrowLeft size={22} color={icon} />} onPress={() => router.back()} accessibilityLabel="Go back" /> )}} />
					<Stack.Screen name="interventionScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Intervention", headerBackVisible: false, headerLeft: () => (<IconButton icon={<ArrowLeft size={22} color={icon} />} onPress={() => router.back()} accessibilityLabel="Go back" /> )}} />
					<Stack.Screen name="createInterventionModal" options={{ presentation: 'modal', headerShown: true, headerTitle: 'New Intervention' }} />
					<Stack.Screen name="editInterventionModal" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Edit Intervention' }} />
					<Stack.Screen name="createProfileModal" options={{ presentation: 'modal', headerShown: true, headerTitle: 'New Profile' }} />
					<Stack.Screen name="editProfileModal" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Edit Profile' }} />
				</Stack.Protected>

				{/* Unauthenticated routes (launch screen) */}
				<Stack.Protected guard={!session}>
					<Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
				</Stack.Protected>
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
  	);
}

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SessionProvider>
			<ProfileProvider>
				<RootNavigator />
			</ProfileProvider>
		</SessionProvider>
	);
}