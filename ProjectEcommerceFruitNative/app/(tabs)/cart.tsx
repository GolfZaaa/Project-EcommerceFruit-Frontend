import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CartContainer = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Header = styled.View`
  padding: 25px;
  background-color: #ff8c00;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  elevation: 5;
`;

const HeaderTitle = styled.Text`
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  margin-left: 10px;
`;

const CartItem = styled.View`
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  margin: 15px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

const ItemImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 10px;
`;

const ItemDetails = styled.View`
  flex: 1;
  padding-left: 20px;
`;

const ItemName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const ItemPrice = styled.Text`
  font-size: 16px;
  color: #e74c3c;
  font-weight: bold;
  margin-top: 5px;
`;

const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
padding-top: 10px;
`;

const QuantityButton = styled.TouchableOpacity`
  background-color: #ff8c00;
  padding: 5px 12px;
  border-radius: 5px;
  margin: 0 8px;
  elevation: 3;
`;

const QuantityText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const TotalContainer = styled.View`
  background-color: #fff;
  padding: 25px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  elevation: 10;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const TotalText = styled.Text`
  font-size: 20px;
  color: #333;
`;

const TotalAmount = styled.Text`
  font-size: 20px;
  color: #333;
  font-weight: bold;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: #ff8c00;
  padding: 10px;
  border-radius: 15px;
  align-items: center;
  margin-top: 20px;
`;

const CheckoutButtonText = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'เงาะ',
      price: '200',
      image: 'https://hdmall.co.th/blog/wp-content/uploads/2024/04/%E0%B9%80%E0%B8%87%E0%B8%B2%E0%B8%B0-Rambutan-scaled.jpg',
      quantity: 2,
    },
    {
      id: '2',
      name: 'ทุเรียน',
      price: '500',
      image: 'https://s.isanook.com/wo/0/ud/50/250005/250005-thumbnail.jpg?ip/crop/w670h402/q80/jpg',
      quantity: 1,
    },
  ]);

  const increaseQuantity = (itemId:any) => {
    setCartItems(cartItems.map(item => item.id === itemId ? {...item, quantity: item.quantity + 1} : item));
  };

  const decreaseQuantity = (itemId:any) => {
    setCartItems(cartItems.map(item => item.id === itemId && item.quantity > 1 ? {...item, quantity: item.quantity - 1} : item));
  };

  const removeItem = (itemId:any) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };


  const handleCartDetail = () => {
    router.replace("/cartdetail");
  }

  const renderCartItem = ({ item }:any) => (
    <CartItem>
      <ItemImage source={{ uri: item.image }} />
      <ItemDetails>
        <ItemName>{item.name}</ItemName>
        <ItemPrice>{parseInt(item.price).toLocaleString()}฿</ItemPrice>
        <QuantityControl>
          <QuantityButton onPress={() => decreaseQuantity(item.id)}>
            <QuantityText>-</QuantityText>
          </QuantityButton>
          <Text style={{ fontSize: 18, marginHorizontal: 10 }}>{item.quantity}</Text>
          <QuantityButton onPress={() => increaseQuantity(item.id)}>
            <QuantityText>+</QuantityText>
          </QuantityButton>
        </QuantityControl>
      </ItemDetails>
      <RemoveButton onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-bin-outline" size={24} color="#e74c3c" />
      </RemoveButton>
    </CartItem>
  );

  const totalAmount = cartItems.reduce((total, item) => total + parseInt(item.price) * item.quantity, 0);

  return (
    <CartContainer>
      <Header>
        <Ionicons name="cart-outline" size={28} color="#fff" />
        <HeaderTitle>ตะกร้าสินค้า</HeaderTitle>
      </Header>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TotalContainer>
        <TotalRow>
          <TotalText>ยอดรวมสินค้า</TotalText>
          <TotalAmount>{totalAmount.toLocaleString()}฿</TotalAmount>
        </TotalRow>
        <TotalRow>
          <TotalText>ค่าจัดส่ง</TotalText>
          <TotalAmount>0฿</TotalAmount>
        </TotalRow>
        <TotalRow>
          <TotalText style={{ fontWeight: 'bold', fontSize: 22 }}>ยอดรวมสุทธิ</TotalText>
          <TotalAmount style={{ fontWeight: 'bold', fontSize: 22 }}>{totalAmount.toLocaleString()}฿</TotalAmount>
        </TotalRow>
        <CheckoutButton onPress={handleCartDetail}>
          <CheckoutButtonText>ชำระเงิน</CheckoutButtonText>
        </CheckoutButton>
      </TotalContainer>
    </CartContainer>
  );
}