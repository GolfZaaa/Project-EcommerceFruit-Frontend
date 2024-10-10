import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // สำหรับการนำทาง

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

const OrderHistoryScreen = () => {
  const [orders] = useState(data);
  const navigation = useNavigation(); 

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

      <Title>ประวัติคำสั่งซื้อ</Title>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </Container>
  );
};

export default OrderHistoryScreen;
