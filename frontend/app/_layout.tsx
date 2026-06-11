import { useEffect } from "react";
import { isRunningInExpoGo } from "expo";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
	useFonts,
	InterTight_400Regular,
	InterTight_500Medium,
	InterTight_600SemiBold,
	InterTight_700Bold,
} from "@expo-google-fonts/inter-tight";
import { SourceSerif4_400Regular, SourceSerif4_500Medium } from "@expo-google-fonts/source-serif-4";
import { IconButton } from "@/components/icon-button";
import { LogoutButton } from "@/components/account-buttons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { SessionProvider, useAuthentication } from "@/context/SessionContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { FocusAreaProvider, useFocusArea } from "@/context/FocusAreaContext";
import { FocusAreaSelectionScreen } from "@/components/focus-area-selection-screen";
import { LaunchScreen } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();
if (!isRunningInExpoGo()) {
	SplashScreen.setOptions({ fade: true, duration: 380 });
}

export const unstable_settings = {
  	anchor: "index",
};

function RootNavigator() {
	const { session, isLoading: authLoading } = useAuthentication();
	const { focusAreaId, isLoading: focusLoading } = useFocusArea();
	const theme = useColorScheme() === "dark" ? "dark" : "light";
	const background = useThemeColor({}, "background");
	const text = useThemeColor({}, "text");
	const icon = useThemeColor({}, "icon");

	const bootLoading = authLoading || focusLoading;

	useEffect(() => {
		if (bootLoading) {
			return;
		}
		let cancelled = false;
		const frame = requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!cancelled) {
					void SplashScreen.hideAsync();
				}
			});
		});
		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
		};
	}, [bootLoading]);

	if (bootLoading) {
		return null;
	}

	if (session && !focusAreaId) {
		return (
			<ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
				<FocusAreaSelectionScreen />
				<StatusBar style="auto" />
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{ headerShadowVisible: false, headerStyle: { backgroundColor: background }, headerTintColor: text }}>
				{/* Authenticated routes */}
				<Stack.Protected guard={!!session}>
					<Stack.Screen name="profilesScreen" options={{ headerShown: true, headerTitle: "Profiles", headerBackVisible: false, headerRight: () => <LogoutButton /> }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="metricScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Indicator", headerBackVisible: false, headerLeft: () => (<IconButton icon={<ArrowLeft size={22} color={icon} />} onPress={() => router.back()} accessibilityLabel="Go back" /> )}} />
					<Stack.Screen name="conversationScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Chat", headerBackVisible: false, headerLeft: () => (<IconButton icon={<ArrowLeft size={22} color={icon} />} onPress={() => router.back()} accessibilityLabel="Go back" /> )}} />
					<Stack.Screen name="interventionScreen/[id]" options={{ headerShown: true, headerTitle: "Viewing Intervention", headerBackVisible: false, headerLeft: () => (<IconButton icon={<ArrowLeft size={22} color={icon} />} onPress={() => router.back()} accessibilityLabel="Go back" /> )}} />
					<Stack.Screen name="createInterventionModal" options={{ presentation: "modal", headerShown: true, headerTitle: "New Intervention" }} />
					<Stack.Screen name="editInterventionModal" options={{ presentation: "modal", headerShown: true, headerTitle: "Edit Intervention" }} />
					<Stack.Screen name="createProfileModal" options={{ presentation: "modal", headerShown: true, headerTitle: "New Profile" }} />
					<Stack.Screen name="editProfileModal" options={{ presentation: "modal", headerShown: true, headerTitle: "Edit Profile" }} />
				</Stack.Protected>

				{/* Unauthenticated routes (launch screen) */}
				<Stack.Protected guard={!session}>
					<Stack.Screen
						name="index"
						options={{
							headerShown: false,
							animation: "none",
							contentStyle: { backgroundColor: LaunchScreen[theme].background },
						}}
					/>
				</Stack.Protected>
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
  	);
}

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		InterTight_400Regular,
		InterTight_500Medium,
		InterTight_600SemiBold,
		InterTight_700Bold,
		SourceSerif4_400Regular,
		SourceSerif4_500Medium,
	});

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SessionProvider>
			<ProfileProvider>
				<FocusAreaProvider>
					<RootNavigator />
				</FocusAreaProvider>
			</ProfileProvider>
		</SessionProvider>
	);
}