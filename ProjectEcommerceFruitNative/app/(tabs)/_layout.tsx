import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "@/src/store/store";
import {
  LogBox,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { observer } from "mobx-react-lite";
import { SafeAreaView } from "react-native-safe-area-context";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

//#D9EAFD

export default observer(function TabLayout() {
  const { getToken } = useStore().commonStore;
  const { getSystemSetting } = useStore().systemSettingStore;
  const { cartItemsStore } = useStore().cartStore;
  const { user, loadingUser } = useStore().userStore;
  const colorScheme = useColorScheme();
  const router = useRouter();

  useLayoutEffect(() => {
    const checkComeFirt = async () => {
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
    checkComeFirt();
    getToken();
    getSystemSetting();
  }, []);

  // if (!!user?.stores?.length === false) {
  //   return router.push("../storeuser/editname");
  // }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor: "#888",
          tabBarStyle: {
            backgroundColor: "#f8f9fa",
            paddingVertical: 10,
            height: 70,
            borderTopWidth: 3,
            display: loadingUser ? "none" : "flex",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
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
                size={focused ? 28 : 24}
                color={color}
                style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
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
                style={{
                  transform: [{ scale: focused ? 1.2 : 1 }],
                  // backgroundColor: "powderblue",
                  // position: "absolute",
                  // padding: 25,
                  // borderRadius: 50,
                  // borderWidth: 1,
                }}
              />
            ),
            // tabBarButton: (props) => {
            //   return !!user ? <Pressable {...props} /> : null;
            // },
            tabBarButton: (props) => {
              return !!user ? (
                !!user?.stores?.length === false ? null : (
                  <Pressable {...props} />
                )
              ) : null;
            },
          }}
        />
        {/* <Tabs.Screen
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
      /> */}
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
            tabBarButton: (props) => (!!user ? <Pressable {...props} /> : null),
            // tabBarStyle: {
            //   display: "none",
            // },
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "ตะกร้า",
            tabBarIcon: ({ color, focused }) => (
              <View style={{ position: "relative" }}>
                <Ionicons
                  name={focused ? "cart" : "cart-outline"}
                  size={focused ? 28 : 24}
                  color={color}
                  style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
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
            tabBarButton: (props) => (!!user ? <Pressable {...props} /> : null),
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
    </SafeAreaView>
  );
});
