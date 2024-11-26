import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Dimensions,
  ToastAndroid,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useStore } from "@/src/store/store";
import { pathImagesApp } from "@/src/constants/RoutePath";
import RenderHTML from "react-native-render-html";
import { htmlToText } from "html-to-text";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mytoast } from "@/components/MyToast";

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const { productDetail, getProductById } = useStore().productStore;
  const { AddToCart, setselectMyCart } = useStore().cartStore;
  const { user } = useStore().userStore;

  const params = useLocalSearchParams();
  const { id } = params;

  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [preViewImage, setPreViewImage] = useState<any>(null);

  const myProduct =
    user?.id !== undefined &&
    user?.id === productDetail?.productGI?.store?.user?.id;

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const plainText = htmlToText(
    productDetail?.productGI.description || "<p></p>",
    {
      wordwrap: false, // Optional: Prevents wrapping text
    }
  );

  const onAddtoCart = () => {
    if (!!user) {
      AddToCart({
        ProductId: productDetail?.id,
        Quantity: quantity,
      });
      setselectMyCart([]);
      showToastWithGravityAndOffset();
      // console.log("add - ", {
      //   ProductId: productDetail?.id,
      //   Quantity: quantity,
      // });
    } else {
      Alert.alert(
        "เกิดข้อผิดพลาด",
        "กรุณาเข้าสู่ระบบก่อนทำการเพิ่มสินค้าลงตะกร้า",
        [
          {
            text: "ตกลง",
          },
        ]
      );
      Mytoast("กรุณาเข้าสู่ระบบก่อนทำการเพิ่มสินค้าลงตะกร้า");
    }
  };

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      "เพิ่มสินค้าลงตะกร้าสำเร็จ!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  return (
    <SafeAreaView>
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

      <ScrollView>
        <Container>
          <ProductImage
            source={{
              uri: !!preViewImage
                ? preViewImage
                : pathImagesApp.product + productDetail?.images,
            }}
          />

          <ScrollView
            horizontal
            style={{
              flexDirection: "row",
            }}
          >
            {productDetail?.productGI.images.map((item, i) => (
              <TouchableWithoutFeedback
                onPress={() =>
                  setPreViewImage(
                    preViewImage === pathImagesApp.product_GI + item.imageName
                      ? pathImagesApp.product + productDetail?.images
                      : pathImagesApp.product_GI + item.imageName
                  )
                }
              >
                <ProductImages
                  isMarginRight={
                    productDetail?.productGI.images.length === i + 1
                  }
                  isImageMain={
                    preViewImage === pathImagesApp.product_GI + item.imageName
                  }
                  source={{
                    uri: pathImagesApp.product_GI + item.imageName,
                  }}
                />
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>

          <ProductTitle>{productDetail?.productGI.name}</ProductTitle>

          <ProductPrice>฿ {productDetail?.price}</ProductPrice>

          <ProductInfo>
            <InfoText>ขายแล้ว: {productDetail?.sold} ชิ้น</InfoText>
            <InfoText>ราคาต่อกิโลกรัม: {productDetail?.price} บาท</InfoText>
            <InfoText>คงเหลือ: {productDetail?.quantity} ชิ้น</InfoText>
          </ProductInfo>

          <ProductDescription>{plainText}</ProductDescription>

          {!myProduct && (
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
          )}

          <TouchableOpacity
            style={{
              backgroundColor: myProduct ? "gray" : "#ff6f61",
              padding: 15,
              borderRadius: 30,
              alignItems: "center",
              marginTop: 20,
            }}
            activeOpacity={myProduct ? 1 : 0}
            onPress={() => !myProduct && onAddtoCart()}
          >
            <ButtonText>
              {myProduct
                ? "นี่คือสินค้าในร้านของคุณ"
                : `เพิ่มในตะกร้า (${quantity})`}
            </ButtonText>
          </TouchableOpacity>

          {/* <DropdownButton onPress={toggleDropdown}>
          <DropdownText>{isDropdownOpen ? 'ซ่อนข้อมูล IG' : 'แสดงข้อมูล IG'}</DropdownText>
        </DropdownButton> */}

          {isDropdownOpen && (
            <IGInfoText>ติดตามสินค้านี้ได้ที่ IG: @product_ig_name</IGInfoText>
          )}
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  margin-top: 70px;
`;

const ProductImages: any = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 20px;
  margin-right: ${(prop: any) => (prop.isMarginRight ? "0" : "20px")};
  border-width: 2px;
  border-color: ${(prop: any) => (prop.isImageMain ? "red" : "white")};
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

const BackButton: any = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  padding: 10px;
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

const IGInfoText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 10px;
`;
