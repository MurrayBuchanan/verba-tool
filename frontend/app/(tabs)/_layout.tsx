import React from "react";
import { Tabs } from "expo-router";
import { ChartLine, ClipboardList, History, Mic } from "lucide-react-native";
import { HapticFeedback } from "@/components/haptic-feedback";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ToProfileButton, EditProfileButton } from "@/components/account-buttons";
import { Fonts } from "@/constants/theme";

export default function TabLayout() {
	const accent = useThemeColor({}, "accent");
	const background = useThemeColor({}, "background");
	const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
	const text = useThemeColor({}, "text");
	const tabIconDefault = useThemeColor({}, "tabIconDefault");

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
				tabBarStyle: { backgroundColor: backgroundSecondary, borderTopWidth: 0 },
				tabBarLabelStyle: { fontFamily: Fonts.sansSemiBold, fontSize: 12 }
			}}
		>
			<Tabs.Screen
				name="recordAudioScreen"
				options={{ title: "Record", tabBarIcon: ({ color }) => <Mic size={22} color={color} /> }}
			/>
			<Tabs.Screen
				name="metricsScreen"
				options={{ title: "Indicators", tabBarIcon: ({ color }) => <ChartLine size={22} color={color} /> }}
			/>
			<Tabs.Screen
				name="interventionScreen"
				options={{ title: "Interventions", tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} /> }}
			/>
			<Tabs.Screen
				name="conversationHistoryScreen"
				options={{ title: "Chat History", tabBarIcon: ({ color }) => <History size={22} color={color} /> }}
			/>
		</Tabs>
	);
}