import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-feedback';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="metricsScreen"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recordAudioScreen"
        options={{
          title: 'Record',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="record.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="conversationHistoryScreen"
        options={{
          title: 'All Conversations',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
