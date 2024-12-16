import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import styled from "styled-components/native";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/store";
import { pathImagesApp } from "@/src/constants/RoutePath";

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
  const {
    getAddressByUserId,
    getAddressgotoOrderByUserId,
    myAddressgotoOrder,
  } = useStore().addressStore;
  const { searchOrdersWantToReceipt, getOrdersByUser, getMyOrderToSend } =
    useStore().orderStore;
  const { systemSetting } = useStore().systemSettingStore;

  useEffect(() => {
    getAddressgotoOrderByUserId();
  }, []);

  const handlePress = (screenName: string) => {
    console.log("Navigating to:", screenName);
  };

  const handleOrderhistory = async () => {
    getOrdersByUser();
    router.push("/orderhistory");
  };

  const handleMyShop = async () => {
    getOrdersByUser();
    router.push("/shop");
  };

  const handleAddress = async () => {
    await getAddressByUserId().then(() => {
      router.push("/addresslist");
    });
    // router.push("/editaddress");
  };

  const handleMyEarn = async () => {
    // searchOrdersWantToReceipt(new URLSearchParams());
    await getMyOrderToSend();
    router.push("/myearn");
  };

  const handleCart = async () => {
    router.push("/(tabs)/cart");
  };

  const handleSearchOrderToSend = async () => {
    // router.push("../admin/dashboardadmin");
    router.push("/searchordertosend");
  };

  const backgroundImage = {
    uri: pathImagesApp.image_web + systemSetting[0]?.image,
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
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userDetails}>
            {myAddressgotoOrder
              ? `${myAddressgotoOrder?.detail} ต.${myAddressgotoOrder?.subDistrict} อ.${myAddressgotoOrder?.district} จ.${myAddressgotoOrder?.province}`
              : "ยังไม่ได้เพิ่มที่อยู่"}
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

          <TouchableOpacity style={styles.menuItem} onPress={handleMyEarn}>
            <View style={styles.iconWrapper}>
              <Ionicons name="cash-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>สร้างรายได้</Text>
            <Text style={styles.menuItemText}>ของฉัน</Text>
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
            <Text style={styles.menuItemText}>คำสั่งซื้อของฉัน</Text>
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
            onPress={() => handleSearchOrderToSend()}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="mail-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>รับ-ส่งต่อ คำสั่งซื้อ</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDashboardAdmin}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="settings-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>ผู้ดูแลระบบ</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDashboardDelivery}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="settings-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>ผู้ดูแลระบบ</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem} onPress={handleMyShop}>
            <View style={styles.iconWrapper}>
              <Ionicons name="basket-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>ร้านค้าของคุณ</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.menuItem} onPress={handleAddress}>
            <View style={styles.iconWrapper}>
              <Ionicons name="location-outline" size={30} color="#5A67F2" />
            </View>
            <Text style={styles.menuItemText}>ที่อยู่ผู้ใช้งาน</Text>
          </TouchableOpacity> */}
        </View>

        <LogoutButton onPress={() => logout()}>
          <SaveButtonText>ออกจากระบบ</SaveButtonText>
        </LogoutButton>
      </ScrollView>

      <View style={styles.containercolor}></View>
    </ScrollView>
  ) : (
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: "center",
    //     backgroundColor: "white",
    //   }}
    // >
    //   <LoginButton onPress={() => router.push("/login")}>
    //     <SaveButtonText>เข้าสู่ระบบ</SaveButtonText>
    //   </LoginButton>
    // </View>
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundUnlogin}
      resizeMode="cover"
    >
      <View style={styles.containerUnlogin}>
        <TitleLogin>คุณยังไม่ได้เข้าสู่ระบบ</TitleLogin>
        <DesLogin>กรุณาเข้าสู่ระบบก่อนใช้งาน</DesLogin>
        {/* <TouchableOpacity
          style={styles.loginButtonUnlogin}
          onPress={() => router.push("/login")}
        > */}
        {/* <Text style={styles.buttonTextUnlogin}>เข้าสู่ระบบ</Text> */}

        <LoginButton onPress={() => router.push("/login")}>
          <SaveButtonText>เข้าสู่ระบบ</SaveButtonText>
        </LoginButton>
        {/* </TouchableOpacity> */}
      </View>
    </ImageBackground>
  );
});

export const TitleLogin: any = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

export const DesLogin: any = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const styles = StyleSheet.create({
  backgroundUnlogin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerUnlogin: {
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "white", // Semi-transparent white background
    // backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
    width: 300,
    height: 300,
    borderRadius: 15,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  loginButtonUnlogin: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonTextUnlogin: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
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
