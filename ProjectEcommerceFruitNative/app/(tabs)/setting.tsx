import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import styled from "styled-components/native";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/store";

export const LoginButton: any = ({ children, onPress }: any) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={["#007bff", "#00d2ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        elevation: 5,
        marginHorizontal: 20,
      }}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

export const LogoutButton: any = ({ children, onPress }: any) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={["#007bff", "#00d2ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        elevation: 5,
      }}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

export default observer(function SettingScreen() {
  const { logout } = useStore().commonStore;
  const { user } = useStore().userStore;

  const handlePress = (screenName: string) => {
    console.log("Navigating to:", screenName);
  };

  const handleOrderhistory = async () => {
    router.push("/orderhistory");
  };

  const handleAddress = async () => {
    router.push("/editaddress");
  };

  const handleEarn = async () => {
    router.push("/earn");
  };

  const handleCart = async () => {
    router.push("/(tabs)/cart");
  };

  const handleDashboardAdmin = async () => {
    // router.push("../admin/dashboardadmin");
    router.push("/(tabs)/admin");
  };

  return !!user ? (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#6D5FFD", "#7A81FF"]}
        style={styles.headerContainer}
      >
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: "https://png.pngtree.com/png-vector/20210708/ourmid/pngtree-packed-meal-kawaii-illustration-png-image_3568607.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Test</Text>
          <Text style={styles.userDetails}>
            11/3 หมู่ 2 ต.ท่าล้อ อ.ท่าม่วง จ.กาญจนบุรี
          </Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem} onPress={handleCart}>
            <View style={styles.iconWrapper}>
              <Ionicons name="cart-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>ตะกร้าสินค้า</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleEarn}>
            <View style={styles.iconWrapper}>
              <Ionicons name="car-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>สร้างรายได้</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOrderhistory}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="basket-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>ประวัติคำสั่งซื้อ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleAddress}>
            <View style={styles.iconWrapper}>
              <Ionicons name="location-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>ที่อยู่ผู้ใช้งาน</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress("Stats")}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="stats-chart-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>สรุปข้อมูลการซื้อ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDashboardAdmin}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="settings-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>ผู้ดูแลระบบ</Text>
          </TouchableOpacity>
        </View>

        <LogoutButton onPress={() => logout()}>
          <SaveButtonText>ออกจากระบบ</SaveButtonText>
        </LogoutButton>
      </ScrollView>

      <View style={styles.containercolor}></View>
    </ScrollView>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <LoginButton onPress={() => router.push("/login")}>
        <SaveButtonText>เข้าสู่ระบบ</SaveButtonText>
      </LoginButton>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containercolor: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    position: "absolute",
    top: 325,
    left: 0,
    right: 0,
    height: 454,
    zIndex: -1,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 340,
    zIndex: -1,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
  },
  userDetails: {
    color: "#FFF",
    fontSize: 14,
  },
  menuContainer: {
    padding: 20,
    marginTop: 250,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    zIndex: 5,
  },
  menuItem: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 5, // ทำให้การ์ดอยู่ด้านบนสุด
  },
  menuItemText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  iconWrapper: {
    backgroundColor: "#F0F4FF",
    borderRadius: 50,
    padding: 15,
  },
});

export const SaveButtonText: any = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;
