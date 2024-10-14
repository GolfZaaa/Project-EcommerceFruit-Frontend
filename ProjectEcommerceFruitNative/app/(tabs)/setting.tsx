import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Container: any = styled(View)`
  flex: 1;
  background-color: #f7f9fc;
`;

const HeaderSection: any = styled(ImageBackground)`
  height: 250px;
  justify-content: center;
  align-items: center;
`;

const UserInfoSection: any = styled.View`
  align-items: center;
  margin-top: -50px;
`;

const UserAvatar: any = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const UserNameContainer: any = styled.View`
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const UserName: any = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const UserRole: any = styled.View`
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 15px;
  margin-top: 5px;
`;

const UserRoleText: any = styled.Text`
  font-size: 12px;
  color: #666;
`;

const MenuContainer: any = styled(ScrollView)`
  padding: 20px;
`;

const ButtonCard = styled(TouchableOpacity)`
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
`;

const ButtonText = styled.Text`
  color: #333;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

const SaveButton: any = ({ children, onPress }: any) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={["#007bff", "#00d2ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 30,
        elevation: 5,
      }}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

const SaveButtonText: any = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

const StyledDropdownButton = styled(TouchableOpacity)`
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
  align-items: center;
  justify-content: flex-start;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 2;
  flex-direction: row;
`;

const DropdownButtonText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-left: 10px; /* เพิ่มระยะห่างระหว่างไอคอนกับข้อความ */
`;

const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    router.push("/login");
  } catch (error) {
    console.error("Error removing token", error);
  }
};

export default function SettingScreen() {
  const [userName, setUserName] = useState("TT");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownAnim] = useState(new Animated.Value(0));

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsDropdownOpen(false));
    } else {
      setIsDropdownOpen(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
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
  
  return ( 
    <Container>
      <HeaderSection
        source={{ uri: "https://your-background-image-url.com" }}
        resizeMode="cover"
      >
        <UserInfoSection>
          <UserAvatar
            source={{
              uri: "https://your-avatar-url.com",
            }}
          />
          <UserNameContainer>
            <UserName>{userName}</UserName>
            <UserRole>
              <UserRoleText>admin</UserRoleText>
            </UserRole>
          </UserNameContainer>
        </UserInfoSection>
      </HeaderSection>

      <MenuContainer>
        <ButtonCard onPress={toggleDropdown}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <ButtonText>ข้อมูลส่วนตัว</ButtonText>
          <Ionicons
            name={
              isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"
            }
            size={24}
            color="#333"
            style={{ marginLeft: "auto" }}
          />
        </ButtonCard>

        {isDropdownOpen && (
          <Animated.View
            style={{
              height: dropdownAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 220],
              }),
              overflow: "hidden",
            }}
          >
            <StyledDropdownButton>
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <DropdownButtonText>สรุปข้อมูลการซื้อ</DropdownButtonText>
            </StyledDropdownButton>

            <StyledDropdownButton onPress={handleAddress}>
              <Ionicons name="location-outline" size={24} color="#333" />
              <DropdownButtonText>ที่อยู่ผู้ใช้งาน</DropdownButtonText>
            </StyledDropdownButton>

            <StyledDropdownButton onPress={handleOrderhistory}>
              <Ionicons name="receipt-outline" size={24} color="#333" />
              <DropdownButtonText>ประวัติคำสั่งซื้อ</DropdownButtonText>
            </StyledDropdownButton>

          </Animated.View>
        )}
        <ButtonCard onPress={handleEarn}>
          <Ionicons name="cash-outline" size={24} color="#333" />
          <ButtonText>สร้างรายได้</ButtonText>
        </ButtonCard>

        <ButtonCard onPress={handleCart}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <ButtonText>ตะกร้าสินค้า</ButtonText>
        </ButtonCard>

        <SaveButton onPress={logout}>
          <SaveButtonText>Logout</SaveButtonText>
        </SaveButton>
      </MenuContainer>
    </Container>
  );
}
