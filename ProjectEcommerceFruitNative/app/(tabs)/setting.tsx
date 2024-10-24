import React, { useEffect, useState } from "react";
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
import { useStore } from "@/src/store/store";

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
        marginTop: 30,
        elevation: 5,
        marginHorizontal: 20,
      }}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

// const logout = async () => {
//   try {
//     await AsyncStorage.removeItem("token");
//     router.push("/login");
//   } catch (error) {
//     console.error("Error removing token", error);
//   }
// };

export default function SettingScreen() {
  const { user } = useStore().userStore;
  const { logout } = useStore().commonStore;
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

  return !!user ? (
    <Container>
      <HeaderSection
        source={{
          uri: "https://i0.wp.com/picjumbo.com/wp-content/uploads/autumn-background-with-space-for-text-and-leaves-around-free-image.jpeg?w=600&quality=80",
        }}
        resizeMode="cover"
      >
        <UserInfoSection>
          <UserAvatar
            source={{
              uri: "https://play-lh.googleusercontent.com/jA5PwYqtmoFS7StajBe2EawN4C8WDdltO68JcsrvYKSuhjcTap5QMETkloXSq5soqRBqFjuTAhh28AYrA6A",
            }}
          />
          <UserNameContainer>
            <UserName>{user?.fullName}</UserName>
            <UserRole>
              <UserRoleText>{user?.role?.name}</UserRoleText>
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
}

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

export const SaveButtonText: any = styled.Text`
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
  margin-left: 10px;
`;

const Card: any = styled(LinearGradient).attrs({
  colors: ["#ffffff", "#f7f9fc"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 2;
`;

const CardText: any = styled.Text`
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardDescription: any = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Button: any = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonTextAddress: any = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
