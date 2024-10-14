import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useStore } from "@/src/store/store";

export default function LoginScreen() {
  const { login } = useStore().commonStore;

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (phone && password) {
      const loginData: any = {
        phoneNumber: phone,
        password: password,
      };

      // const convertdata = JSON.stringify(loginData);

      try {
        await login(loginData);

        // await AsyncStorage.setItem("token", convertdata);

        // console.log("loginData", loginData);
      } catch (error) {
        console.error("Error storing token:", error);
      }
    } else {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Container>
        <GraphicTopLeft />
        <GraphicBottomRight />

        <Title>ยินดีต้อนรับกลับมา!</Title>
        <SubTitle>เข้าสู่ระบบบัญชีของคุณ</SubTitle>

        <Input
          placeholder="เบอร์โทรศัพท์"
          value={phone}
          onChangeText={setPhone}
          autoCapitalize="none"
          maxLenght={10}
        />
        <Input
          placeholder="รหัสผ่าน"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <ButtonGradient onPress={handleLogin}>
          <ButtonText>เข้าสู่ระบบ</ButtonText>
        </ButtonGradient>

        <TouchableOpacity
          onPress={() => Alert.alert("ลืมรหัสผ่าน", "ไปที่หน้าลืมรหัสผ่าน")}
        >
          <LinkText>ลืมรหัสผ่าน?</LinkText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <LinkText>ยังไม่มีบัญชี? ลงทะเบียน</LinkText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <LinkText>ข้ามการลงทะเบียน</LinkText>
        </TouchableOpacity>
      </Container>
    </KeyboardAvoidingView>
  );
}

const Container: any = styled(LinearGradient).attrs({
  colors: ["#e0f7fa", "#ffffff"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  justify-content: center;
  padding: 20px;
  position: relative;
`;

const GraphicTopLeft: any = styled.View`
  position: absolute;
  top: -30px;
  left: -30px;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: rgba(255, 183, 77, 0.7);
`;

const GraphicBottomRight: any = styled.View`
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: rgba(156, 39, 176, 0.7);
`;

const Title: any = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

const SubTitle: any = styled.Text`
  font-size: 16px;
  color: #777;
  text-align: center;
  margin-bottom: 20px;
`;

const Input: any = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 25px;
  padding: 15px;
  font-size: 16px;
  margin-bottom: 15px;
  background-color: #fff;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 2;
`;

const ButtonGradient: any = ({ children, onPress }: any) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={["#ff6f61", "#ff8965"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
      }}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

const ButtonText: any = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const LinkText: any = styled.Text`
  font-size: 16px;
  color: #007bff;
  text-align: center;
  margin-top: 10px;
`;
