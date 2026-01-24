import React from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Tabs, router } from 'expo-router';

import { HapticFeedback } from '@/components/haptic-feedback';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { signOut } from '@/services/authentication-service';

export function LogoutButton() {
	const colorScheme = useColorScheme();

	const handleLogout = () => {
		Alert.alert(
			"Logout",
			"Are you sure you want to logout?",
			[
				{
					text: "Cancel",
					style: "cancel"
				},
				{
					text: "Logout",
					style: "destructive",
					onPress: async () => {
						try {
							await signOut();
							router.replace("/");
						} catch (error) {
							console.error("Error signing out:", error);
						}
					}
				}
			]
		);
	};
	return (
		<TouchableOpacity onPress={handleLogout} style={styles.button}>
			<IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={Colors[colorScheme ?? 'light'].text} />
		</TouchableOpacity>
	);
}

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

const styles = StyleSheet.create({
	button: {
		marginRight: 20,
	},
});