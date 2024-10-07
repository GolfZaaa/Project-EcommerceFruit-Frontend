import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
          name="earn"
          options={{
            title: 'สร้างรายได้',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'cash' : 'cash-outline'} color={color} /> // ใช้ไอคอนเงิน
            ),
          }}
        />

      <Tabs.Screen
          name="setting"
          options={{
            title: 'ตั้งค่า',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? "settings" : "settings-outline"} color={color} /> // ใช้ไอคอนเงิน
            ),
          }}
        />

    </Tabs>
  );
}
