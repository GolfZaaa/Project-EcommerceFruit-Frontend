import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "@/src/store/store";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default function TabLayout() {
  const { getToken } = useStore().commonStore;
  const { user } = useStore().userStore;
  const colorScheme = useColorScheme();
  const router = useRouter();

  useLayoutEffect(() => {
    const checkToken = async () => {
      try {
        const comeInStorage = await AsyncStorage.getItem("come-in-frist");
        // console.log("come-in-frist", comeInStorage);
        if (comeInStorage === null || comeInStorage === undefined) {
          router.replace("/first");
        }
      } catch (error) {
        console.log("Error fetching token:", error);
      }
    };
    checkToken();
    getToken();
    getSystemSetting();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "#888", 
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          paddingVertical: 10,
          height: 70, 
          borderTopWidth: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12, // ขนาดฟอนต์ของชื่อแท็บ
          fontWeight: "600", // ทำให้ตัวหนาขึ้น
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "หน้าหลัก",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 28 : 24} // ขนาดใหญ่ขึ้นเมื่อถูกเลือก
              color={color}
              style={{ transform: [{ scale: focused ? 1.2 : 1 }] }} // แอนิเมชันการขยาย
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "ร้านค้าของคุณ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "storefront" : "storefront-outline"}
              size={focused ? 28 : 24}
              color={color}
              style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "ผู้ดูแลระบบ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={focused ? 28 : 24}
              color={color}
              style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
            />
          ),
          // tabBarBadge: user.isAdmin ? 1 : null,
        }}
      />
      <Tabs.Screen
        name="earn"
        options={{
          title: "สร้างรายได้",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cash" : "cash-outline"}
              size={focused ? 28 : 24}
              color={color}
              style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "ตะกร้าสินค้า",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={focused ? 28 : 24}
              color={color}
              style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "โปรไฟล์",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={focused ? 28 : 24}
              color={color}
              style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
            />
          ),
        }}
      />
    </Tabs>
  );
});
