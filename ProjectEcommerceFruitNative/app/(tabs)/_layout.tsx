import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/src/store/store";
import { LogBox, Text, TouchableOpacity, View } from "react-native";
import { observer } from "mobx-react-lite";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default observer(function TabLayout() {
  const { token, getToken, logout } = useStore().commonStore;
  const { getSystemSetting } = useStore().systemSettingStore;
  const { cartItemsStore } = useStore().cartStore;
  const { user } = useStore().userStore;
  const colorScheme = useColorScheme();
  const router = useRouter();

  useLayoutEffect(() => {
    const checkToken = async () => {
      try {
        const comeInStorage = await AsyncStorage.getItem("come-in-frist");
        // console.log("come-in-frist", comeInStorage);
        if (comeInStorage === null || comeInStorage === undefined) {
          // router.replace('/login');
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
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "หน้าหลัก",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
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
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earn"
        options={{
          title: "สร้างรายได้",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cash" : "cash-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: "relative" }}>
              <TabBarIcon
                name={focused ? "cart" : "cart-outline"}
                color={color}
              />

              {cartItemsStore.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -3,
                    backgroundColor: "red",
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10 }}>
                    {cartItemsStore.length}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "โปรไฟล์",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
});
