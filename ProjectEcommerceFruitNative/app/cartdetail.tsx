import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const UserInfoContainer = styled.View`
  flex: 1;
  background-color: #f8f9fa;
  padding: 20px;
  padding-top: 80px;
`;

const InputField = styled.TextInput`
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
  elevation: 3;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #ff8c00;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
`;

const SaveButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 40px;
  left: 20px;
  z-index: 10;
`;

export default function CartDetailScreen() {
  const router = useRouter();

  const handleCart = () => {
    router.replace("/(tabs)/cart");
  }

  return (
    <ScrollView>

<BackButton onPress={handleCart}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </BackButton>

      <UserInfoContainer>
        

        <Text style={styles.header}>ข้อมูลผู้ใช้</Text>

        <InputField placeholder="ชื่อผู้ใช้" />
        <InputField placeholder="อีเมล" />
        <InputField placeholder="ที่อยู่จัดส่ง" />
        <InputField placeholder="เบอร์โทรศัพท์" />

        <SaveButton onPress={() => alert('Proceed to payment')}>
          <SaveButtonText>ดำเนินการชำระเงิน</SaveButtonText>
        </SaveButton>
      </UserInfoContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});
