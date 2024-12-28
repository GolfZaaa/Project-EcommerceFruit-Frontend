import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Order } from "@/src/models/Order";
import { useStore } from "@/src/store/store";
import { formatDateThaiNative } from "@/src/helper/components";
import MyCartItem from "@/components/product/MyCartItem";
import { AntDesign } from "@expo/vector-icons";
import MyActivityIndicator from "@/components/MyActivityIndicator";
import { observer } from "mobx-react-lite";

const CardOrderSearch = ({ item }: { item: Order }) => {
  const { user } = useStore().userStore;
  const { iWantToTakeOrdertoSend, loadingOrderWantToTake } =
    useStore().orderStore;

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

  const myDriver = item.shippings[0].driverHistories.find(
    (x) => x.statusDriver === 3 && x.userId === user?.id
  );

  const status = item?.shippings[0]?.shippingStatus;

  const handleSended = (id: number) => {
    Alert.alert(
      "",
      "ท่านแน่ใจหรือไม่ว่าจะขอรับคำสั่งซื้อนี้เพื่อส่งต่อให้สำเร็จ?",
      [
        {
          text: "ยกเลิก",
          // onPress: () => console.log("cancel passed"),
        },
        {
          text: "ยืนยัน",
          onPress: async () => {
            await iWantToTakeOrdertoSend([id]).then((res) => {
              // console.log("res : ", res);
            });
          },
        },
      ]
    );
  };

  const testHaha = item.shippings[0].driverHistories.find(
    (c) => c.userId !== user?.id
  );

  return (
    <OrderCard key={item.id}>
      <OrderInfo>
        <View>
          <OrderTitle>{item.orderId}</OrderTitle>
          <OrderDate>{formatDateThaiNative(item.createdAt, 0, 1)}</OrderDate>
        </View>
        <View>
          {/* <OrderAmount>ไม่ใช่รหัส {item.id}</OrderAmount> */}

          <View
            style={{
              backgroundColor: `${status === 0 ? "red" : "white"}`,
              paddingVertical: status === 0 ? 5 : 0,
              paddingHorizontal: status === 0 ? 12 : 0,
              borderRadius: 50,
              width: 89,
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
          <OrderStatus
            status={item.status}
            //   confirmReceipt={item.confirmReceipt}
          >
            {!!myDriver && "(" + "ส่งต่อให้ผู้จัดส่งคนอื่นแล้ว" + ")"}
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

      {more === true && (
        <View
          style={{
            marginBottom: 5,
          }}
        >
          <Button
            onPress={() => handleSended(item.id)}
            disabled={loadingOrderWantToTake}
          >
            <ButtonText>
              {loadingOrderWantToTake ? (
                <MyActivityIndicator size="small" />
              ) : (
                "ยืนยันการเลือก"
              )}
            </ButtonText>
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

export default observer(CardOrderSearch);

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
  background-color: #007bff;
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

const CardAddress: any = styled.Text`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;
