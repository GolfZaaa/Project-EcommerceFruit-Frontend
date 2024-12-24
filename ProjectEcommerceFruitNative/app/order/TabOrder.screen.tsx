import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import { Order } from "@/src/models/Order";
import { formatDateThaiNative } from "@/src/helper/components";
import MyCartItem from "@/components/product/MyCartItem";
import AntDesign from "@expo/vector-icons/AntDesign";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/store";
import { Label } from "../storeuser/createproductgi";
import { pathImagesApp } from "@/src/constants/RoutePath";
import * as Clipboard from "expo-clipboard";
import { Mytoast } from "@/components/MyToast";

const TabOrderScreen = ({
  item,
  index,
}: {
  item: Order[];
  index: number | null;
}) => {
  const { changeConfirmReceiptOrder } = useStore().orderStore;

  const handleConfirm = (values: any) => {
    Alert.alert(
      "ท่านแน่ใจหรือไม่ว่าได้รับสินค้าแล้ว",
      "หากยืนยันแล้ว จะไม่สามารถเปลี่ยนกลับได้",
      [
        {
          text: "ยกเลิก",
          // onPress: () => console.log("cancel successfully"),
        },
        {
          text: "ยืนยัน",
          onPress: async () =>
            await changeConfirmReceiptOrder(values).then((res) => {
              // console.log("res as : ", res);
            }),
        },
      ]
    );
  };

  const copyToClipboard = (item: string) => {
    Clipboard.setString(item);
    Mytoast("คัดลอกหมายเลขติดตามพัสดุแล้ว");
  };

  return item.length ? (
    <ScrollView>
      {item.map((item) => {
        const [totalPrice, setTotalPrice] = useState<string>("");
        const [more, setMore] = useState(false);

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

        // console.log(
        //   "image " + index,
        //   pathImagesApp.sendedOrder + item?.shippings[0]?.sendedOrderImage
        // );

        return (
          <OrderCard key={item.id}>
            <OrderInfo>
              <View>
                <OrderTitle>{item.orderId}</OrderTitle>
                <OrderDate>
                  {formatDateThaiNative(item.createdAt, 0, 1)}
                </OrderDate>
              </View>
              <View>
                {/* <OrderAmount>ไม่ใช่รหัส {item.id}</OrderAmount> */}
                <View
                  style={{
                    backgroundColor: `${item.status === 0 ? "red" : "white"}`,
                    paddingVertical: item.status === 0 ? 5 : 0,
                    paddingHorizontal: item.status === 0 ? 12 : 0,
                    borderRadius: 50,
                    width: "100%",
                  }}
                >
                  <OrderStatus
                    status={item.status}
                    confirmReceipt={item.confirmReceipt}
                  >
                    {item.confirmReceipt === 2
                      ? "ยกเลิกโดยคุณ"
                      : item.status === 0
                      ? "กำลังรออนุมัติ"
                      : item.status === 1
                      ? "ยืนยันคำสั่งซื้อแล้ว"
                      : item.status === 2
                      ? "ยกเลิกคำสั่งซื้อแล้ว"
                      : "เพิ่มสถานะด้วย"}
                  </OrderStatus>
                </View>
                <OrderStatus
                  status={item.status}
                  confirmReceipt={item.confirmReceipt}
                >
                  {item.confirmReceipt === 1 && "ได้รับสินค้าแล้ว"}
                  {(item.status === 2 && "ยกเลิกแล้ว โดยร้านค้า") ||
                    (item.confirmReceipt === 2 && "ยกเลิกแล้ว โดยคุณ")}
                </OrderStatus>
              </View>
            </OrderInfo>

            {item.shippingType !== "อื่น ๆ" &&
              item.shippingType !== null &&
              item.confirmReceipt !== 1 &&
              item.confirmReceipt !== 2 &&
              item.status !== 2 && (
                <View>
                  <ShippTitle>
                    {item.shippingType !== "อื่น ๆ" && item.shippingType}
                  </ShippTitle>
                  {/* <ShippTagTitle onPress={() => copyToClipboard(item.tag)}> */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <ShippTagTitle>หมายเลขติดตามพัสดุ</ShippTagTitle>

                    <Button onPress={() => copyToClipboard(item.tag)}>
                      <ButtonText>คัดลอก</ButtonText>
                    </Button>
                  </View>
                  <TagTitle>{item.tag}</TagTitle>
                </View>
              )}

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

            {((more === true && index === 5) ||
              (more === true && index === 3)) &&
            !!item?.shippings[0]?.sendedOrderImage ? (
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
            ) : (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                {((more === true && index === 5) ||
                  (more === true && index === 3)) &&
                  item.confirmReceipt !== 1 &&
                  item.confirmReceipt !== 2 && (
                    <Label name="กำลังจัดส่ง" valid={false} />
                  )}
              </View>
            )}

            {more === true && index === 5 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 20,
                }}
              >
                <View
                  style={{
                    width: 150,
                  }}
                >
                  <Button
                    onPress={() =>
                      handleConfirm({ orderId: item.id, status: 1 })
                    }
                    status={
                      item.shippingType !== "อื่น ๆ"
                        ? false
                        : !item?.shippings[0]?.sendedOrderImage
                    }
                    disabled={
                      item.shippingType !== "อื่น ๆ"
                        ? false
                        : !item?.shippings[0]?.sendedOrderImage
                    }
                  >
                    <ButtonText>ได้รับสินค้าแล้ว</ButtonText>
                  </Button>
                </View>
                <View
                  style={{
                    width: 150,
                  }}
                >
                  <ButtonRemove
                    onPress={() =>
                      handleConfirm({ orderId: item.id, status: 2 })
                    }
                    status={
                      item.shippingType !== "อื่น ๆ"
                        ? false
                        : !item?.shippings[0]?.sendedOrderImage
                    }
                    disabled={
                      item.shippingType !== "อื่น ๆ"
                        ? false
                        : !item?.shippings[0]?.sendedOrderImage
                    }
                  >
                    <ButtonText>ไม่ได้รับสินค้า</ButtonText>
                  </ButtonRemove>
                </View>
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
      })}
    </ScrollView>
  ) : (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <OrderTitle>ไม่มีคำสั่งซื้อ</OrderTitle>
    </View>
  );
};

export default observer(TabOrderScreen);

const styles = StyleSheet.create({
  imageSended: {
    width: 300,
    height: 550,
    marginVertical: 10,
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

const ShippTitle: any = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #333;
`;

const ShippTagTitle: any = styled.Text`
  font-size: 19px;
  color: #333;
  margin-right: 10px;
`;

const TagTitle: any = styled.Text`
  font-size: 18px;
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
  background-color: ${(e: any) => (e.status ? "gray" : "#007bff")};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonRemove: any = styled.TouchableOpacity`
  background-color: ${(e: any) => (e.status ? "gray" : "red")};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText: any = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
