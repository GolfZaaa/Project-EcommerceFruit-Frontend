import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useLayoutEffect(() => {
    const checkToken = async () => {
      try {
        const tokenStorage  =  await AsyncStorage.getItem('token');
        console.log("Token", tokenStorage);
        if (tokenStorage === null || tokenStorage === undefined) {
          // router.replace('/login');
          router.replace('/first');
        }
      } catch (error) {
        console.log('Error fetching token:', error);
      }
    };
    checkToken();
  }, []);



  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="shop"
  options={{
    title: 'ร้านค้าของคุณ',
    tabBarIcon: ({ color, focused }) => (
      <Ionicons
        name={focused ? 'storefront' : 'storefront-outline'}
        size={24} // ขนาดไอคอน
        color={color} // สีไอคอน
      />
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
