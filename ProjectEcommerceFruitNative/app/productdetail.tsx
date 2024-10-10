import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

const Container: any = styled(LinearGradient).attrs({
  colors: ["#ffffff", "#f0f0f0"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
`;

const ProductImage: any = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 20px;
  margin-bottom: 20px;
`;

const ProductTitle: any = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const ProductPrice: any = styled.Text`
  font-size: 22px;
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ProductDescription: any = styled.Text`
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
  line-height: 24px;
`;

const ProductInfo: any = styled.View`
  margin-bottom: 20px;
`;

const InfoText: any = styled.Text`
  font-size: 16px;
  color: #555;
  margin-bottom: 5px;
`;

const QuantityContainer: any = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const QuantityButton: any = styled.TouchableOpacity`
  background-color: #ff6f61;
  padding: 10px 20px;
  border-radius: 30px;
`;

const QuantityText: any = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin: 0 20px;
`;

const AddToCartButton: any = styled(LinearGradient).attrs({
  colors: ["#ff6f61", "#ff8965"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-top: 20px;
`;

const ButtonText: any = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const DropdownButton: any = styled.TouchableOpacity`
  padding: 15px;
  background-color: #007bff;
  border-radius: 10px;
  margin-top: 20px;
`;

const DropdownText: any = styled.Text`
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
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const toggleDropdown = () => {
    LayoutAnimation.easeInEaseOut();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <ScrollView>
      <Container>
        <ProductImage
          source={{
            uri: "https://hdmall.co.th/blog/wp-content/uploads/2024/04/%E0%B9%80%E0%B8%87%E0%B8%B2%E0%B8%B0-Rambutan-scaled.jpg",
          }}
        />

        <ProductTitle>เงาะ</ProductTitle>

        <ProductPrice>฿ 1,599</ProductPrice>

        <ProductInfo>
          <InfoText>ขายแล้ว: 6 ชิ้น</InfoText>
          <InfoText>ราคาต่อกิโลกรัม: 55 บาท</InfoText>
          <InfoText>คงเหลือ: 25 ชิ้น</InfoText>
        </ProductInfo>

        <ProductDescription>
          ป็นผลไม้เมืองร้อน ที่ลักษณะต้นเป็นไม้ยืนต้นขนาดกลางถึงใหญ่
          มีถิ่นกำเนิดมาจากแถบอินโดนีเซีย
          เจริญเติบโตได้ดีในพื้นดินที่มีความชื้นค่อนข้างสูง ประมาณ 25-30
          องศาเซลเซียส นิยมปลูกกันมากบริเวณภาคตะวันออกและภาคใต้ของไทย
          เป็นพืชเศรษฐกิจ มีการส่งออกผลเงาะไปยังต่างประเทศ
          ทำรายได้ให้เกษตรกรอย่างมาก
        </ProductDescription>

        <QuantityContainer>
          <QuantityButton onPress={decreaseQuantity}>
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                width: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              -
            </Text>
          </QuantityButton>
          <QuantityText>{quantity}</QuantityText>
          <QuantityButton onPress={increaseQuantity}>
            <Text style={{ color: "#fff", fontSize: 24 }}>+</Text>
          </QuantityButton>
        </QuantityContainer>

        <AddToCartButton>
          <ButtonText>เพิ่มในตะกร้า ({quantity})</ButtonText>
        </AddToCartButton>

        {/* <DropdownButton onPress={toggleDropdown}>
          <DropdownText>{isDropdownOpen ? 'ซ่อนข้อมูล IG' : 'แสดงข้อมูล IG'}</DropdownText>
        </DropdownButton> */}

        {isDropdownOpen && (
          <IGInfoText>ติดตามสินค้านี้ได้ที่ IG: @product_ig_name</IGInfoText>
        )}
      </Container>
    </ScrollView>
  );
}
