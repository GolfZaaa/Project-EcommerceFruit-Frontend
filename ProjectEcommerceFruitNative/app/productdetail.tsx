import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutAnimation } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

const Container = styled(LinearGradient).attrs({
  colors: ['#ffffff', '#f0f0f0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 20px;
  margin-bottom: 20px;
`;

const ProductTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const ProductPrice = styled.Text`
  font-size: 22px;
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ProductDescription = styled.Text`
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
  line-height: 24px;
`;

const ProductInfo = styled.View`
  margin-bottom: 20px;
`;

const InfoText = styled.Text`
  font-size: 16px;
  color: #555;
  margin-bottom: 5px;
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const QuantityButton = styled.TouchableOpacity`
  background-color: #ff6f61;
  padding: 10px 20px;
  border-radius: 30px;
`;

const QuantityText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin: 0 20px;
`;

const AddToCartButton = styled(LinearGradient).attrs({
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

const DropdownButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: #007bff;
  border-radius: 10px;
  margin-top: 20px;
`;

const DropdownText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const IGInfoText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 10px;
`;

export default function ProductDetailsScreen() {
  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const toggleDropdown = () => {
    LayoutAnimation.easeInEaseOut(); // เพื่อทำให้ dropdown มีการแสดงผลแบบ animation
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <ScrollView>
      <Container>
        {/* รูปภาพสินค้า */}
        <ProductImage source={{ uri: 'https://via.placeholder.com/300' }} />

        {/* ชื่อสินค้า */}
        <ProductTitle>ชื่อสินค้าสวยๆ</ProductTitle>

        {/* ราคาสินค้า */}
        <ProductPrice>฿ 1,599</ProductPrice>

        {/* ข้อมูลสินค้าเพิ่มเติม */}
        <ProductInfo>
          <InfoText>ขายแล้ว: 6 ชิ้น</InfoText>
          <InfoText>ราคาต่อกิโลกรัม: 55 บาท</InfoText>
          <InfoText>คงเหลือ: 25 ชิ้น</InfoText>
        </ProductInfo>

        {/* คำอธิบายสินค้า */}
        <ProductDescription>
          นี่คือคำอธิบายสินค้าซึ่งอธิบายรายละเอียดของสินค้าอย่างละเอียด รวมถึงข้อมูลที่เกี่ยวข้อง
          เพื่อให้ผู้ใช้สามารถตัดสินใจซื้อได้ง่ายขึ้น คุณสามารถปรับเปลี่ยนข้อมูลเหล่านี้ตามสินค้าที่ต้องการได้
        </ProductDescription>

        {/* การเพิ่มหรือลดจำนวนสินค้า */}
        <QuantityContainer>
          <QuantityButton onPress={decreaseQuantity}>
            <Text style={{ color: '#fff', fontSize: 24 }}>-</Text>
          </QuantityButton>
          <QuantityText>{quantity}</QuantityText>
          <QuantityButton onPress={increaseQuantity}>
            <Text style={{ color: '#fff', fontSize: 24 }}>+</Text>
          </QuantityButton>
        </QuantityContainer>

        {/* ปุ่มเพิ่มในตะกร้า */}
        <AddToCartButton>
          <ButtonText>เพิ่มในตะกร้า ({quantity})</ButtonText>
        </AddToCartButton>

        {/* Dropdown ข้อมูล IG */}
        <DropdownButton onPress={toggleDropdown}>
          <DropdownText>{isDropdownOpen ? 'ซ่อนข้อมูล IG' : 'แสดงข้อมูล IG'}</DropdownText>
        </DropdownButton>

        {isDropdownOpen && (
          <IGInfoText>
            ติดตามสินค้านี้ได้ที่ IG: @product_ig_name
          </IGInfoText>
        )}
      </Container>
    </ScrollView>
  );
}
