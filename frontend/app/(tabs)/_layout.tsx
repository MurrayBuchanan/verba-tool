import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChartLine, ClipboardList, History, Mic, User } from "lucide-react-native";
import { HapticFeedback } from "@/components/haptic-feedback";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ToProfileButton, EditProfileButton } from "@/components/account-buttons";

export default function TabLayout() {
	const insets = useSafeAreaInsets();
	const accent = useThemeColor({}, "accent");
	const background = useThemeColor({}, "background");
	const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
	const backgroundTertiary = useThemeColor({}, "backgroundTertiary");
	const text = useThemeColor({}, "text");
	const tabIconDefault = useThemeColor({}, "tabIconDefault");

	const tabBarBottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 10 : 6);

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: accent,
				tabBarInactiveTintColor: tabIconDefault,
				headerShown: true,
				headerStyle: { backgroundColor: background },
				headerTintColor: text,
				tabBarButton: HapticFeedback,
				headerLeft: () => (<ToProfileButton />),
				headerRight: () => (<EditProfileButton />),
				headerShadowVisible: false,
				tabBarShowLabel: false,
				tabBarHideOnKeyboard: true,
				tabBarItemStyle: { paddingVertical: 4 },
				tabBarStyle: {
					backgroundColor: backgroundSecondary,
					borderTopWidth: StyleSheet.hairlineWidth,
					borderTopColor: backgroundTertiary,
					paddingTop: 6,
					paddingBottom: tabBarBottomInset,
					height: 42 + tabBarBottomInset,
					...Platform.select({
						ios: {
							shadowColor: "#000",
							shadowOffset: { width: 0, height: -2 },
							shadowOpacity: 0.06,
							shadowRadius: 6
						},
						android: { elevation: 10 }
					})
				}
			}}
		>
			<Tabs.Screen
				name="recordAudioScreen"
				options={{ title: "Record", tabBarIcon: ({ color }) => <Mic size={24} color={color} /> }}
			/>
			<Tabs.Screen
				name="metricsScreen"
				options={{ title: "Indicators", tabBarIcon: ({ color }) => <ChartLine size={24} color={color} /> }}
			/>
			<Tabs.Screen
				name="interventionScreen"
				options={{ title: "Interventions", tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} /> }}
			/>
			<Tabs.Screen
				name="conversationHistoryScreen"
				options={{ title: "Chat History", tabBarIcon: ({ color }) => <History size={24} color={color} /> }}
			/>
			<Tabs.Screen
				name="profileScreen"
				options={{ title: "Profile", tabBarIcon: ({ color }) => <User size={24} color={color} /> }}
			/>
		</Tabs>
	);
}