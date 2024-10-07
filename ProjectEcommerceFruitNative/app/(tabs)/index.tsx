import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, Button } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
// import pathsPubilc from '@/path/publicpath';

const Container:any = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #f8f9fa;
  padding-top: 30px;
`;

const Header:any = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const HeaderText:any = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const IconButton = styled.TouchableOpacity`
  padding: 10px;
`;

const ProductCard = styled(TouchableOpacity)<{ numColumns: number }>`
  background-color: #ffffff;
  border-radius: 15px;
  margin: 10px;
  padding: 10px;
  flex: ${(props) => (props.numColumns === 1 ? '1 0 100%' : '1')};
  elevation: 2;
  position: relative;
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 150px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ProductName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const ProductPrice = styled.Text`
  font-size: 14px;
  color: #e74c3c;
  font-weight: bold;
  margin-top: 5px;
`;

const Badge = styled(LinearGradient).attrs({
  colors: ['#ff6f00', '#ff8f00'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: 5px;
`;

const BadgeText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;

export default function HomeScreen() {
  const router = useRouter();
  const [numColumns, setNumColumns] = useState(2); // ใช้สถานะสำหรับจำนวนคอลัมน์
  const [filterModalVisible, setFilterModalVisible] = useState(false); // ใช้สถานะสำหรับเปิดปิด modal ฟิลเตอร์

  const products = [
    { id: '1', name: 'Striped Maxi Dress', price: 'Rs. 1,299', image: 'https://via.placeholder.com/150', isNew: true },
    { id: '2', name: 'Envelope Sling Bag', price: 'Rs. 895', image: 'https://via.placeholder.com/150', isSale: true },
    { id: '3', name: 'Laser Cut Heeled Sandals', price: 'Rs. 2,295', image: 'https://via.placeholder.com/150' },
    { id: '4', name: 'Sunglasses', price: 'Rs. 1,150', image: 'https://via.placeholder.com/150' },
  ];

  // สลับระหว่างคอลัมน์ 1 และ 2
  const toggleColumns = () => {
    setNumColumns((prev) => (prev === 1 ? 2 : 1));
  };

  const renderProduct = ({ item }: any) => (
    // <ProductCard numColumns={numColumns} onPress={() => router.push(pathsPubilc.productDetails)}>
    <ProductCard numColumns={numColumns} >
      <ProductImage source={{ uri: item.image }} />
      <ProductName>{item.name}</ProductName>
      <ProductPrice>{item.price}</ProductPrice>

      {item.isNew && (
        <Badge>
          <BadgeText>สินค้าของคุณ</BadgeText>
        </Badge>
      )}
      {item.isSale && (
        <Badge>
          <BadgeText>Sale</BadgeText>
        </Badge>
      )}
    </ProductCard>
  );

  return (
    <Container>
      {/* ส่วนหัวสำหรับการปรับคอลัมน์ */}
      <HeaderText>รายการสินค้า</HeaderText>
      <Header>
        {/* ปุ่มฟิลเตอร์ */}
        <IconButton onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter-outline" size={24} color="#333" />
        </IconButton>
        <IconButton onPress={toggleColumns}>
          <Ionicons name={numColumns === 1 ? 'grid-outline' : 'list-outline'} size={24} color="#333" />
        </IconButton>
      </Header>

      {/* การใช้ key เพื่อบังคับให้ FlatList ทำการ re-render */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={numColumns}
        key={numColumns}  // เพิ่ม key เพื่อบังคับ re-render เมื่อเปลี่ยนคอลัมน์
      />

      {/* Modal สำหรับฟิลเตอร์ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>ฟิลเตอร์สินค้า</Text>
            <Button title="ฟิลเตอร์ตามราคา" onPress={() => alert('ฟิลเตอร์ตามราคา')} />
            <Button title="ฟิลเตอร์ตามหมวดหมู่" onPress={() => alert('ฟิลเตอร์ตามหมวดหมู่')} />
            <Button title="ปิด" onPress={() => setFilterModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </Container>
  );
}
