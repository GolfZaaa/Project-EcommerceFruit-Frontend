import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
// import pathsPubilc from '@/path/publicpath';

const Container = styled(LinearGradient).attrs({
  colors: ['#e0f7fa', '#ffffff'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  justify-content: center;
  padding: 20px;
  position: relative;
`;

const GraphicTopLeft = styled.View`
  position: absolute;
  top: -60px;
  left: -60px;
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: rgba(255, 183, 77, 0.7);
`;

const GraphicBottomRight = styled.View`
  position: absolute;
  bottom: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: rgba(156, 39, 176, 0.7);
`;

const Title = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  color: #777;
  text-align: center;
  margin-bottom: 30px;
`;

const Input = styled.TextInput`
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

const ButtonGradient = styled(LinearGradient).attrs({
  colors: ['#ff6f61', '#ff8965'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const LinkText = styled.Text`
  font-size: 16px;
  color: #007bff;
  text-align: center;
  margin-top: 20px;
`;

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (username && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        Alert.alert('ข้อผิดพลาด', 'รหัสผ่านไม่ตรงกัน');
      } else {
        Alert.alert('ลงทะเบียนสำเร็จ', `ยินดีต้อนรับ, ${username}!`);
        // ส่งผู้ใช้ไปหน้าอื่นตามต้องการ
      }
    } else {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Container>
        {/* องค์ประกอบกราฟิก */}
        <GraphicTopLeft />
        <GraphicBottomRight />

        <Title>สร้างบัญชี</Title>
        <SubTitle>ลงทะเบียนเพื่อเริ่มต้นใช้งาน</SubTitle>

        <Input
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Input
          placeholder="อีเมล"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="รหัสผ่าน"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Input
          placeholder="ยืนยันรหัสผ่าน"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        <ButtonGradient onPress={handleRegister}>
          <ButtonText>ลงทะเบียน</ButtonText>
        </ButtonGradient>

        <TouchableOpacity onPress={() => router.push(pathsPubilc.login)}>
          <LinkText>มีบัญชีแล้ว? เข้าสู่ระบบ</LinkText>
        </TouchableOpacity>
      </Container>
    </KeyboardAvoidingView>
  );
}
