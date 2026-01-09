import { Tabs } from 'expo-router';
import React from 'react';

import { HapticFeedback } from '@/components/haptic-feedback';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticFeedback,
      }}>
      <Tabs.Screen
        name="metricsScreen"
        options={{
          title: 'Metrics',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recordAudioScreen"
        options={{
          title: 'Record Audio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="record.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="conversationHistoryScreen"
        options={{
          title: 'Chat History',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
