import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useStore } from "@/src/store/store";
import { ButtonGradient } from "./login";
import axios from "axios";
import { Label } from "./storeuser/createproductgi";
import { Mytoast } from "@/components/MyToast";
// import pathsPubilc from '@/path/publicpath';

export default function RegisterScreen() {
  const { register, login } = useStore().commonStore;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (fullName && phone && password && confirmPassword) {
      if (password !== confirmPassword) {
        Alert.alert("เกิดข้อผิดพลาด", "รหัสผ่านไม่ตรงกัน", [
          {
            text: "ตกลง",
          },
        ]);
        Mytoast("รหัสผ่านไม่ตรงกัน");
      } else {
        const result = await onRegister();

        if (result === 400) {
          Alert.alert("เกิดข้อผิดพลาด", "มีเบอร์โทรศัพท์นี้แล้ว", [
            {
              text: "ตกลง",
            },
          ]);
          Mytoast("มีเบอร์โทรศัพท์นี้แล้ว");
        } else {
          Alert.alert("ลงทะเบียนสำเร็จ", `ยินดีต้อนรับ, ${phone}!`, [
            {
              text: "ตกลง",
              onPress: () => {
                login({
                  phoneNumber: phone,
                  password: password,
                });
              },
            },
          ]);
        }
      }
    } else {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน", [
        {
          text: "ตกลง",
        },
      ]);
      Mytoast("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  const onRegister = async () => {
    return await register({
      fullName,
      phoneNumber: phone,
      password,
      roleId: 2,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Container>
        <GraphicTopLeft />
        <GraphicBottomRight />

        <Title>สร้างบัญชี</Title>
        <SubTitle>ลงทะเบียนเพื่อเริ่มต้นใช้งาน</SubTitle>

        <Label name="ชื่อผู้ใช้" valid={false} />
        <Input
          placeholder="ชื่อผู้ใช้"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="none"
        />

        <Label name="เบอร์โทรศัพท์" valid={false} />
        <Input
          placeholder="เบอร์โทรศัพท์"
          value={phone}
          onChangeText={(text: string) => {
            // ตรวจสอบให้รับเฉพาะตัวเลข และจำกัดความยาวไม่เกิน 10 ตัวอักษร
            const numericText = text.replace(/[^0-9]/g, "");
            if (numericText.length <= 10) {
              setPhone(numericText);
            }
          }}
          autoCapitalize="none"
          keyboardType="phone-pad"
        />

        <Label name="รหัสผ่าน" valid={false} />
        <Input
          placeholder="รหัสผ่าน"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <Label name="ยืนยันรหัสผ่าน" valid={false} />
        <Input
          placeholder="ยืนยันรหัสผ่าน"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        <ButtonGradient onPress={handleRegister}>
          <ButtonText>ลงทะเบียน</ButtonText>
        </ButtonGradient>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <LinkText>มีบัญชีแล้ว? เข้าสู่ระบบ</LinkText>
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
  top: -60px;
  left: -60px;
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: rgba(255, 183, 77, 0.7);
`;

const GraphicBottomRight: any = styled.View`
  position: absolute;
  bottom: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: rgba(156, 39, 176, 0.7);
`;

const Title: any = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

const SubTitle: any = styled.Text`
  font-size: 16px;
  color: #777;
  text-align: center;
  margin-bottom: 30px;
`;

const Input: any = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 25px;
  padding: 15px;
  font-size: 16px;
  margin-bottom: 20px;
  background-color: #fff;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 2;
`;

const ButtonText: any = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const LinkText: any = styled.Text`
  font-size: 16px;
  color: #007bff;
  text-align: center;
  margin-top: 20px;
`;
