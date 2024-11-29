import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Order } from "./../../../ProjectEcommerceFruitClientVite/src/models/Order";
import styled from "styled-components/native";
import { formatDateThaiNative } from "@/src/helper/components";
import MyCartItem from "@/components/product/MyCartItem";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useStore } from "@/src/store/store";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Label } from "../storeuser/createproductgi";
import { pathImagesApp } from "@/src/constants/RoutePath";

const TabEarnScreen = ({
  data,
  index,
}: {
  data: Order[];
  index: number | null;
}) => {
  const { user } = useStore().userStore;
  const { changeConfirmSendOrder } = useStore().orderStore;

  const RenderItemEarn = ({ item }: { item: Order }) => {
    const [totalPrice, setTotalPrice] = useState<string>("");
    const [more, setMore] = useState(false);

    const [image, setImage] = useState<string | null>(null);
    const [paymentImage, setPaymentImage] = useState<any | null>(null);

    const handleMore = (item: Order) => {
      // Calculate total price
      const total = item.orderItems.reduce(
        (acc: number, orderItem: any) =>
          acc + orderItem.product.price * orderItem.quantity,
        0
      );

      if (!more) {
        setTotalPrice((total + item.shippings[0].shippingFee).toString());
        // setTotalPriceMyOrder(total);
        // myTotalPrice.current = total;
        setMore((prev) => !prev);
      } else {
        setTotalPrice("");
        setMore((prev) => !prev);
      }
    };

    const myDriverFee = item.shippings[0].driverHistories.find(
      (x) => x.userId === user?.id
    );

    const myDriver = item.shippings[0].driverHistories.find(
      (x) => x.statusDriver === 3 && x.userId === user?.id
    );

    const status = item?.shippings[0]?.shippingStatus;

    const handleSended = (id: number) => {
      const data = {
        orderId: id,
        ImageFile: paymentImage,
      };

      Alert.alert("", "ท่านแน่ใจหรือไม่ว่าส่งสินค้าถึงมือลูกค้าแล้ว?", [
        {
          text: "ยืนยัน",
          onPress: () => {
            changeConfirmSendOrder(data);
          },
        },
      ]);
    };

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

    return (
      <OrderCard key={item.id}>
        <OrderInfo>
          <View>
            <OrderTitle>{item.orderId}</OrderTitle>
            <OrderDate>{formatDateThaiNative(item.createdAt, 0, 1)}</OrderDate>

            <OrderAmount>
              ได้รับค่าจัดส่ง : {myDriverFee?.shippingFee} บาท
            </OrderAmount>
            <OrderStatus
              status={item.status}
              //   confirmReceipt={item.confirmReceipt}
            >
              {!!myDriver && "(" + "ส่งต่อให้ผู้จัดส่งคนอื่นแล้ว" + ")"}
            </OrderStatus>
          </View>
          <View>
            {/* <OrderAmount>ไม่ใช่รหัส {item.id}</OrderAmount> */}

            <View
              style={{
                backgroundColor: `${status === 0 ? "red" : "white"}`,
                paddingVertical: status === 0 ? 5 : 0,
                paddingHorizontal: status === 0 ? 12 : 0,
                borderRadius: 50,
                width: "100%",
              }}
            >
              <OrderStatus
                status={status}
                //   confirmReceipt={item.confirmReceipt}
              >
                {status === 0
                  ? "กำลังจัดส่ง"
                  : status === 1
                  ? "จัดส่งสำเร็จ"
                  : status === 2
                  ? "จัดส่งไม่สำเร็จ"
                  : "เพิ่มสถานะด้วย"}
              </OrderStatus>
            </View>
          </View>
        </OrderInfo>

        {more && (
          <View>
            {item.orderItems.map((orderItem) => (
              <MyCartItem
                key={orderItem.id}
                productId={orderItem.productId}
                image={orderItem.product.images}
                name={orderItem.product.productGI.name}
                price={orderItem.product.price}
                quantity={orderItem.quantity}
              />
            ))}
          </View>
        )}

        {totalPrice !== "" && (
          <TotalContainer>
            <TotalRow>
              <TotalText style={{ fontWeight: "bold", fontSize: 22 }}>
                ยอดรวมสุทธิ
              </TotalText>
              <TotalAmount style={{ fontWeight: "bold", fontSize: 22 }}>
                {totalPrice} ฿
              </TotalAmount>
            </TotalRow>
          </TotalContainer>
        )}

        {more && (
          <Card isStore={false}>
            <View
              style={{
                padding: 20,
              }}
            >
              <CardText>
                ชื่อ-ที่อยู่ลูกค้า : {item?.address?.user?.fullName}
              </CardText>
              <CardText>เบอร์ : {item?.address?.user?.phoneNumber}</CardText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CardText>บ้านเลขที่ {item?.address.detail}</CardText>
              </View>

              <CardAddress>
                ตำบล {item?.address.subDistrict} อำเภอ {item?.address.district}
              </CardAddress>
              <CardAddress>
                จังหวัด {item?.address.province} {item?.address.postCode}
              </CardAddress>
            </View>
          </Card>
        )}

        {more === true && index === 1 && !myDriver && (
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Label name="แนบรูปภาพหลักฐานการส่ง" valid={false} />
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <TouchableOpacity
                style={styles.uploadSection}
                onPress={pickImage}
              >
                <Text style={styles.uploadText}>กดเพื่ออัพโหลดรูปภาพ</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickImage}
                >
                  <Text style={styles.uploadButtonText}>อัพโหลด</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          </View>
        )}

        {((more === true && index === 2) || (more === true && index === 3)) &&
          !!item?.shippings[0]?.sendedOrderImage && (
            <View>
              <Label name="รูปภาพหลักฐานการส่ง" valid={false} />
              <Image
                source={{
                  uri:
                    pathImagesApp.sendedOrder +
                    item?.shippings[0]?.sendedOrderImage,
                }}
                style={styles.imageSended}
              />
            </View>
          )}

        {more === true && index === 1 && !myDriver && (
          <View
            style={{
              marginBottom: 5,
            }}
          >
            <Button
              onPress={() => handleSended(item.id)}
              disabled={!paymentImage}
            >
              <ButtonText>ยืนยันการส่งสินค้า</ButtonText>
            </Button>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleMore(item)}
          style={{
            alignItems: "center",
            marginBottom: -10,
          }}
        >
          {more ? (
            <AntDesign name="up" size={24} color="black" />
          ) : (
            <AntDesign name="down" size={24} color="black" />
          )}
        </TouchableOpacity>
      </OrderCard>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <RenderItemEarn item={item} />}
      keyExtractor={(item) => "item.id" + item.id}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <OrderTitle>ไม่พบคำสั่งซื้อ</OrderTitle>
        </View>
      }
    />
  );
};

export default observer(TabEarnScreen);

const styles = StyleSheet.create({
  containerImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 550,
  },
  imageSended: {
    width: 300,
    height: 550,
    marginVertical: 10,
  },
  uploadSection: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

const OrderCard: any = styled.View`
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  elevation: 5;
  margin: 5px 2px;
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

export const OrderStatus: any = styled.Text`
  font-size: 17px;
  color: ${(props: any) =>
    props.confirmReceipt === 2
      ? "red"
      : props.status === 0
      ? "yellow"
      : props.status === 1
      ? "green"
      : props.status === 2
      ? "red"
      : "gray"};
`;

export const TotalContainer = styled.View`
  background-color: #ff8c00;
  padding: 25px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  elevation: 10;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
  margin: 10px;
`;

export const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const TotalText = styled.Text`
  font-size: 20px;
  color: #333;
`;

export const TotalAmount = styled.Text`
  font-size: 20px;
  color: #333;
  font-weight: bold;
`;

const Button: any = styled.TouchableOpacity`
  background-color: ${(props: any) => (props.disabled ? "gray" : "#007bff")};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonRemove: any = styled.TouchableOpacity`
  background-color: red;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText: any = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const Card: any = styled(LinearGradient).attrs((props: any) => ({
  colors: props.isStore ? ["#f7f9fc", "powderblue"] : ["powderblue", "#f7f9fc"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  border-radius: 15px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 2;
  margin-top: 10px;
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

const CardAddress: any = styled.Text`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;

const ButtonSelect: any = styled.TouchableOpacity`
  background-color: red;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;
