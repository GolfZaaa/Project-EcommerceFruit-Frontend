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
import { StripeProvider } from '@stripe/stripe-react-native';

import { useColorScheme } from "@/hooks/useColorScheme";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

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

  const stripePromise = 
    "pk_test_51NXzoLKP6BtYWFTXQF5bdWURW7JXVd4YNwaOQkxxh0xScmXG8Y4dhkOMM5GJRDnThjM2XRkVp53bHNufNNLOi9vD00AZ9d4O1n";

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StripeProvider publishableKey={stripePromise}>
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
        <Stack.Screen name="successscreen" />
        <Stack.Screen name="addresslist" />
        <Stack.Screen name="myearn" />
        <Stack.Screen name="searchordertosend" />
        <Stack.Screen name="dashboarduser" />
        <Stack.Screen name="dashboardtosend" />
        <Stack.Screen name="storedetail" />
      </Stack>
      </StripeProvider>
    </ThemeProvider>
  );
}
