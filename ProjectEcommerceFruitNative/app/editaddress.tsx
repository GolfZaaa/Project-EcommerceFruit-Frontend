import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

// สร้าง Styled Component สำหรับหน้าจอ
const Container: any = styled(LinearGradient).attrs({
  colors: ["#E8F0FF", "#F7F9FC"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
  padding-top: 60px;
`;

const Title: any = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const OrderCard: any = styled(TouchableOpacity)`
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  elevation: 5;
`;

const OrderInfo: any = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const OrderTitle: any = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const OrderDate: any = styled.Text`
  font-size: 14px;
  color: #666;
`;

const OrderAmount: any = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
`;

const OrderStatus: any = styled.Text`
  font-size: 14px;
  color: ${(props: any) => (props.status === "completed" ? "#28a745" : "#dc3545")};
`;

const data = [
  {
    id: "1",
    title: "คำสั่งซื้อ #001",
    date: "10 ตุลาคม 2023",
    amount: "฿500",
    status: "completed",
  },
  {
    id: "2",
    title: "คำสั่งซื้อ #002",
    date: "15 ตุลาคม 2023",
    amount: "฿1,200",
    status: "cancelled",
  },
  {
    id: "3",
    title: "คำสั่งซื้อ #003",
    date: "20 ตุลาคม 2023",
    amount: "฿700",
    status: "completed",
  },
];

export default function EditAddressScreen() {
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');

  const handleSave = () => {
    // Logic for saving address goes here
    console.log('Address saved:', { address, zipcode, subdistrict, district, province });
  };

  const renderOrderItem = ({ item }: any) => (
    <OrderCard>
      <OrderInfo>
        <View>
          <OrderTitle>{item.title}</OrderTitle>
          <OrderDate>{item.date}</OrderDate>
        </View>
        <View>
          <OrderAmount>{item.amount}</OrderAmount>
          <OrderStatus status={item.status}>
            {item.status === "completed" ? "สำเร็จ" : "ยกเลิก"}
          </OrderStatus>
        </View>
      </OrderInfo>
    </OrderCard>
  );

  return (
    <Container>
      {/* ปุ่มกลับ */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 1,
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <Title>แก้ไขที่อยู่</Title>

      {/* ฟอร์มแก้ไขที่อยู่ */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="บ้านเลขที่, หมู่, ซอย, ถนน *"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="รหัสไปรษณีย์"
          value={zipcode}
          onChangeText={setZipcode}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="แขวง/ตำบล"
          value={subdistrict}
          onChangeText={setSubdistrict}
        />
        <TextInput
          style={styles.input}
          placeholder="เขต/อำเภอ"
          value={district}
          onChangeText={setDistrict}
        />
        <TextInput
          style={styles.input}
          placeholder="จังหวัด"
          value={province}
          onChangeText={setProvince}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 10,
  },
  input: {
    height: 50,
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor:'#fff'
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
