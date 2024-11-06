import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import { Order } from "@/src/models/Order";
import { formatDateThaiNative } from "@/src/helper/components";
import MyCartItem from "@/components/product/MyCartItem";
import AntDesign from "@expo/vector-icons/AntDesign";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/store";

const TabOrderScreen = ({
  item,
  totalPrice: myTotalPrice,
}: {
  item: Order[];
  totalPrice: any;
}) => {
  const { setTotalPriceMyOrder } = useStore().orderStore;

  console.log("myTotalPrice", myTotalPrice);

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
                <OrderAmount>ไม่ใช่รหัส {item.id}</OrderAmount>
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

const TotalContainer = styled.View`
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
