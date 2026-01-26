import React from 'react';
import { Tabs } from 'expo-router';
import { HapticFeedback } from '@/components/haptic-feedback';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LogoutButton } from '@/components/logout-button';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
			tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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