import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/store";
// import pathsPubilc from '@/path/publicpath';

export default observer(function HomeScreen() {
  const { product, getProduct } = useStore().productStore;
  const router = useRouter();
  const [numColumns, setNumColumns] = useState(2); // ใช้สถานะสำหรับจำนวนคอลัมน์
  const [filterModalVisible, setFilterModalVisible] = useState(false); // ใช้สถานะสำหรับเปิดปิด modal ฟิลเตอร์

  const products = [
    {
      id: "1",
      name: "เงาะ",
      price: "200฿",
      image:
        "https://hdmall.co.th/blog/wp-content/uploads/2024/04/%E0%B9%80%E0%B8%87%E0%B8%B2%E0%B8%B0-Rambutan-scaled.jpg",
      isNew: true,
    },
    {
      id: "2",
      name: "ทุเรียน",
      price: "500฿",
      image:
        "https://s.isanook.com/wo/0/ud/50/250005/250005-thumbnail.jpg?ip/crop/w670h402/q80/jpg",
      isSale: true,
    },
    {
      id: "3",
      name: "มังคุด",
      price: "50฿",
      image: "https://medthai.com/wp-content/uploads/2013/07/Mangosteen-1.jpg",
    },
    {
      id: "4",
      name: "ส้ม",
      price: "40฿",
      image:
        "https://image.makewebeasy.net/makeweb/m_1920x0/qeb9oj2Lg/Ingradian/shutterstock_2053015835.jpg?v=202012190947",
    },
  ];

  const toggleColumns = () => {
    setNumColumns((prev) => (prev === 1 ? 2 : 1));
  };

  const renderProduct = ({ item }: any) => (
    <ProductCard
      numColumns={numColumns}
      onPress={() => router.push("/productdetail")}
    >
      {/* <ProductCard numColumns={numColumns} > */}
      <ProductImage source={{ uri: item.image }} />
      <ProductName>{item.name}</ProductName>
      <ProductPrice>{item.price}</ProductPrice>

      {item.isNew && (
        <Badge>
          <BadgeText>สินค้าของคุณ</BadgeText>
        </Badge>
      )}
      {item.isSale && (
        // <Badge>
        //   <BadgeText>Sale</BadgeText>
        // </Badge>
        <View></View>
      )}
    </ProductCard>
  );

  return (
    <Container>
      <HeaderText>รายการสินค้า</HeaderText>
      <Header>
        <IconButton onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter-outline" size={24} color="#333" />
        </IconButton>
        <IconButton onPress={toggleColumns}>
          <Ionicons
            name={numColumns === 1 ? "grid-outline" : "list-outline"}
            size={24}
            color="#333"
          />
        </IconButton>
      </Header>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={numColumns}
        key={numColumns}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
            >
              ฟิลเตอร์สินค้า
            </Text>
            <Button
              title="ฟิลเตอร์ตามราคา"
              onPress={() => alert("ฟิลเตอร์ตามราคา")}
            />
            <Button
              title="ฟิลเตอร์ตามหมวดหมู่"
              onPress={() => alert("ฟิลเตอร์ตามหมวดหมู่")}
            />
            <Button title="ปิด" onPress={() => setFilterModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </Container>
  );
});

const Container: any = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #f8f9fa;
  padding-top: 60px;
`;

const Header: any = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const HeaderText: any = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  padding-left: 10px;
`;

const IconButton: any = styled.TouchableOpacity`
  padding: 10px;
`;

const ProductCard: any = styled(TouchableOpacity)<{ numColumns: number }>`
  background-color: #ffffff;
  border-radius: 15px;
  margin: 10px;
  padding: 10px;
  flex: ${(props) => (props.numColumns === 1 ? "1 0 100%" : "1")};
  elevation: 2;
  position: relative;
`;

const ProductImage: any = styled(Image)`
  width: 100%;
  height: 150px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ProductName: any = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const ProductPrice: any = styled.Text`
  font-size: 14px;
  color: #e74c3c;
  font-weight: bold;
  margin-top: 5px;
`;

const Badge: any = styled(LinearGradient).attrs({
  colors: ["#ff6f00", "#ff8f00"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: 5px;
`;

const BadgeText: any = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;
