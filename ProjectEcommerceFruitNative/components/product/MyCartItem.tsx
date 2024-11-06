import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { pathImagesApp } from "@/src/constants/RoutePath";
import { router } from "expo-router";
import { useStore } from "@/src/store/store";

interface props {
  productId: number;
  image: string | null;
  name: string;
  price: number;
  quantity: number;
}

const MyCartItem = ({ productId, image, name, price, quantity }: props) => {
  const { getProductById } = useStore().productStore;

  return (
    <CartItem
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          getProductById(productId).then(() => {
            router.push({
              pathname: "/productdetail",
              params: { id: productId.toString() },
            });
          });
        }}
      >
        <ItemImage
          source={{
            uri: pathImagesApp.product + `${image}`,
          }}
          style={{ width: 100, height: 100, borderRadius: 8 }}
        />
      </TouchableOpacity>
      {/* </TouchableOpacity> */}
      <ItemDetails style={{ flex: 1, marginLeft: 10 }}>
        <ItemName style={{ fontSize: 16, fontWeight: "bold" }}>{name}</ItemName>
        <ItemPrice style={{ color: "#2ecc71" }}>{price} ฿</ItemPrice>

        <Text style={{ fontSize: 18 }}>จำนวน {quantity} ชิ้น</Text>
      </ItemDetails>
    </CartItem>
  );
};

export default MyCartItem;

const CartItem = styled.View`
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  margin: 5px 5px;
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
