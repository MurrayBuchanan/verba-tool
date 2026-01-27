import React from 'react';
import { Tabs } from 'expo-router';
import { HapticFeedback } from '@/components/haptic-feedback';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LogoutButton } from '@/components/logout-button';

// This file was generated and modified from the Expo boilerplate using 'npx create-expo-app'

export default function TabLayout() {
	const accentColour = useThemeColor({}, 'accent');

	return (
		<Tabs
			screenOptions={{
			tabBarActiveTintColor: accentColour,
			headerShown: true,
			tabBarButton: HapticFeedback,
			headerRight: () => (<LogoutButton />)
		}}>
			<Tabs.Screen
				name="recordAudioScreen"
				options={{
					title: 'Record',
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="record.circle" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="metricsScreen"
				options={{
					title: 'Metrics',
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.line.uptrend.xyaxis" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="interventionScreen"
				options={{
					title: 'Interventions',
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.line.text.clipboard" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="conversationHistoryScreen"
				options={{
					title: 'Chat History',
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock" color={color} />,
				}}
			/>
		</Tabs>
	);
}