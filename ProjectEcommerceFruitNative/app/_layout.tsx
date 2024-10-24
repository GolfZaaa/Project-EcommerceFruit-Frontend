import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="first" />
        <Stack.Screen name="orderhistory" />
        <Stack.Screen name="orderhistorystore" />
        <Stack.Screen name="editaddress" />
        <Stack.Screen name="createproductgi" />
        <Stack.Screen name="createproduct" />
        <Stack.Screen name="earn" />
        <Stack.Screen name="cartdetail" />
        <Stack.Screen name="editname" />
        <Stack.Screen name="listproductgi" />
        <Stack.Screen name="listproduct" />
        <Stack.Screen name="../(tabs)" />
        <Stack.Screen name="+not-found" />

        <Stack.Screen name="listuser" />

      </Stack>
    </ThemeProvider>
  );
  
}
