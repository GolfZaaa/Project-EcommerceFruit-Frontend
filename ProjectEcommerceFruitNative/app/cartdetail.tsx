import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { formatDateThaiNative } from "@/src/helper/components";
import { useStore } from "@/src/store/store";
import { pathImagesApp } from "@/src/constants/RoutePath";
import { observer } from "mobx-react-lite";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";

import * as ImagePicker from "expo-image-picker";
import { SegmentedButtons } from "react-native-paper";
import { Mytoast } from "@/components/MyToast";

const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default observer(function CartDetailScreen() {
  const {
    cartStore: { selectMyCart },
    systemSettingStore: { systemSetting },
    addressStore: { myAddressgotoOrder },
    orderStore: { CreateUpdateOrderById },
  } = useStore();

  const [totalPrice, setTotalPrice] = useState<string>("");
  const [formattedTotalPrice, setFormattedTotalPrice] = useState<string>("");
  const [value, setValue] = React.useState("");

  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [paymentImage, setPaymentImage] = useState<any | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 7],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      let fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
      let fileUri = fileInfo.uri;
      let fileName = fileUri.split("/").pop();
      let fileType = "image/jpeg"; // ปรับปรุงประเภทไฟล์ตามความต้องการ

      setPaymentImage({
        uri: fileUri,
        name: fileName,
        type: fileType,
      });
    }
  };

  const calculateTotalPrice = () => {
    return selectMyCart.reduce((total: any, item: any) => {
      const storeTotal = item.products.reduce(
        (storeSum: number, product: any) => {
          return storeSum + product.quantityInCartItem * product.price;
        },
        0
      );
      return total + storeTotal;
    }, 0);
  };

  useEffect(() => {
    setTotalPrice(formatNumberWithCommas(calculateTotalPrice()));
    setFormattedTotalPrice(
      formatNumberWithCommas(
        calculateTotalPrice() + systemSetting[0]?.shippingCost
      )
    );
  }, []);

  // const handleCart = () => {
  //   router.replace("/(tabs)/cart");
  // };

  const RenderCartItem = ({ products }: any) => {
    const item = products;

    return (
      <CartItem
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity
          onPress={() => {
            getProductById(item.products[0].id).then(() => {
              router.push({
                pathname: "/productdetail",
                params: { id: item.products[0].id.toString() },
              });
            });
          }}
        > */}
        <ItemImage
          source={{
            uri: pathImagesApp.product + `${item.products[0].images}`,
          }}
          style={{ width: 100, height: 100, borderRadius: 8 }}
        />
        {/* </TouchableOpacity> */}
        <ItemDetails style={{ flex: 1, marginLeft: 10 }}>
          <ItemName style={{ fontSize: 16, fontWeight: "bold" }}>
            {item.productName}
          </ItemName>
          <ItemPrice style={{ color: "#2ecc71" }}>
            {item.products[0].price} ฿
          </ItemPrice>

          <Text style={{ fontSize: 18 }}>
            จำนวน {item.products[0].quantityInCartItem} ชิ้น
          </Text>
        </ItemDetails>
      </CartItem>
    );
  };

  const Segmented: any = {
    stripe: (
      <View>
        <Text>พื้นที่ทำ stripe</Text>
      </View>
    ),
    image: (
      <View style={styles.containerImage}>
        <Button
          title="เพิ่มรูปภาพ"
          onPress={pickImage}
          style={{
            marginBottom: 20,
          }}
        >
          <Text>เพิ่มรูปภาพ</Text>
        </Button>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
    ),
  };

  const onPayment = async () => {
    const findStoreId: any = selectMyCart[0];

    const Data = {
      paymentImage: paymentImage,
      tag: "",
      storeId: findStoreId?.storeId,
    };

    console.log("Data", Data);

    if (value === "") {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณาเลือกวิธีการชำระเงิน", [
        {
          text: "ตกลง",
        },
      ]);
      Mytoast("กรุณาเลือกวิธีการชำระเงิน");
    } else {
      if (value === "image") {
        if (image !== null) {
          const test = await CreateUpdateOrderById(Data);

          console.log("test", test);

          if (typeof test === "number") {
            router.push("/successscreen");
          } else {
            Alert.alert("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาด", [
              {
                text: "ตกลง",
              },
            ]);
            Mytoast("เกิดข้อผิดพลาด");
          }

          // alert("เริ่มการชำระเงินได้");
        } else {
          Alert.alert("เกิดข้อผิดพลาด", "กรุณาเพิ่มรูปภาพ", [
            {
              text: "ตกลง",
            },
          ]);
          Mytoast("กรุณาเพิ่มรูปภาพ");
        }
      }
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <BackButton onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </BackButton>

      <UserInfoContainer>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={styles.header}>ชำระเงิน</Text>
        </View>
        <View>
          <Text style={styles.content}>ที่อยู่ในการจัดส่ง</Text>

          <Card>
            <CardText>บ้านเลขที่ {myAddressgotoOrder?.detail}</CardText>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <CardDescription>
                จังหวัด{myAddressgotoOrder?.province}{" "}
              </CardDescription>
              <CardDescription>
                อำเภอ{myAddressgotoOrder?.district}{" "}
              </CardDescription>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <CardDescription>
                ตำบล{myAddressgotoOrder?.subDistrict}
              </CardDescription>
              <CardDescription> {myAddressgotoOrder?.postCode}</CardDescription>
            </View>
            {/* <Button onPress={() => alert(`${item.title} Button Pressed`)}>
              <ButtonText>รับหิ้ว</ButtonText>
            </Button> */}
          </Card>
        </View>
        <View>
          {/* <Text style={styles.content}>การชำระเงิน</Text> */}
          <Text style={styles.dateTime}>
            {formatDateThaiNative(new Date(), 0, 2)}
          </Text>
        </View>
        <FlatList
          data={Object.entries(selectMyCart)} // [['Store A', [product1, product2]], ...]
          keyExtractor={([storeName], index) => storeName + index}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item: [storeName, products] }) => (
            <RenderCartItem products={products} />
          )}
        />

        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={styles.content}>เลือกวิธีการชำระเงิน</Text>
        </View>

        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          style={{
            marginBottom: 20,
          }}
          buttons={[
            {
              value: "stripe",
              label: "บัตรเครดิต",
              disabled: !!image,
            },
            {
              value: "image",
              label: "แนบสลิป",
            },
          ]}
        />

        {Segmented[value]}

        <TotalContainer>
          <TotalRow>
            <TotalText>ยอดรวมสินค้า</TotalText>
            <TotalAmount>{totalPrice} ฿</TotalAmount>
          </TotalRow>
          <TotalRow>
            <TotalText>ค่าจัดส่ง</TotalText>
            <TotalAmount>{systemSetting[0].shippingCost} ฿</TotalAmount>
          </TotalRow>
          <TotalRow>
            <TotalText style={{ fontWeight: "bold", fontSize: 22 }}>
              ยอดรวมสุทธิ
            </TotalText>
            <TotalAmount style={{ fontWeight: "bold", fontSize: 22 }}>
              {formattedTotalPrice} ฿
            </TotalAmount>
          </TotalRow>
          <SaveButton onPress={() => onPayment()}>
            <SaveButtonText>ดำเนินการชำระเงิน</SaveButtonText>
          </SaveButton>
        </TotalContainer>
      </UserInfoContainer>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  content: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  dateTime: {
    fontSize: 15,
    marginBottom: 10,
    color: "#333",
  },
  containerImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 550,
  },
});

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

const Card: any = styled(LinearGradient).attrs({
  colors: ["#ffffff", "#f7f9fc"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 2;
`;

const CardText: any = styled.Text`
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardDescription: any = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Button: any = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const UserInfoContainer = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
  padding-top: 80px;
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
