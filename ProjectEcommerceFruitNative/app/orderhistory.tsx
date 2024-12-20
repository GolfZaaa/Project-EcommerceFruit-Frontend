import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import TabOrderScreen from "./order/TabOrder.screen";
import { useStore } from "@/src/store/store";
import { observer } from "mobx-react-lite";

const data = [
  {
    id: "1",
    title: "คำสั่งซื้อ #001",
    date: "10 ตุลาคม 2023",
    amount: "฿500",
    status: "completed",
  },
  {
    id: "2",
    title: "คำสั่งซื้อ #002",
    date: "15 ตุลาคม 2023",
    amount: "฿1,200",
    status: "cancelled",
  },
  {
    id: "3",
    title: "คำสั่งซื้อ #003",
    date: "20 ตุลาคม 2023",
    amount: "฿700",
    status: "completed",
  },
];

const OrderHistoryScreen = () => {
  const { order } = useStore().orderStore;

  // const [orders] = useState(data);
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "ทั้งหมด" },
    // { key: "second", title: "ที่ต้องชำระ" },
    { key: "third", title: "กำลังรออนุมัติ" },
    { key: "fourth", title: "อนุมัติแล้ว" },
    { key: "fifth", title: "ที่ต้องได้รับ" },
    { key: "sixth", title: "สำเร็จแล้ว" },
    { key: "seventh", title: "ยกเลิกแล้ว" },
  ]);

  const renderScene = SceneMap({
    first: () => <TabOrderScreen item={order} index={null} />, //ทั้งหมด
    // second: () => (
    //   <TabOrderScreen
    //     item={order?.filter((item) => item?.paymentImage === null)} //ที่ต้องชำระ
    //   />
    // ),
    third: () => (
      <TabOrderScreen
        item={order.filter(
          (item) => item?.paymentImage !== null && item?.status === 0 //กำลังรออนุมัติ
        )}
        index={null}
      />
    ),
    fourth: () => (
      <TabOrderScreen
        item={order.filter(
          (item) =>
            item?.paymentImage !== null &&
            item?.status === 1 &&
            item.confirmReceipt !== 1 && //อนุมัติแล้ว
            item.confirmReceipt !== 2
        )}
        index={null}
      />
    ),
    fifth: () => (
      <TabOrderScreen
        item={order.filter(
          (item) =>
            // item?.shippings[0]?.shippingStatus !== undefined
            //   ? item?.shippings[0]?.shippingStatus === 1 && //ที่ต้องได้รับ
            //     item?.confirmReceipt === 0
            //   : item?.tag !== "จัดส่งผ่านผู้รับหิ้ว" &&
            //     item?.tag !== null &&
            //     item?.confirmReceipt === 0 &&
            //     item?.status !== 2
            (item?.shippings[0].driverHistories.length > 0 ||
              item.shippingType !== "อื่น ๆ") &&
            item?.tag !== null &&
            item?.confirmReceipt !== 1 &&
            item?.confirmReceipt !== 2 &&
            item?.status !== 2
        )}
        index={5}
      />
    ),
    sixth: () => (
      <TabOrderScreen
        item={order.filter(
          (item) => item?.status === 1 && item?.confirmReceipt === 1 //สำเร็จแล้ว
        )}
        index={3}
      />
    ),
    seventh: () => (
      <TabOrderScreen
        item={order.filter(
          (item) => item?.status === 2 || item?.confirmReceipt === 2 //ยกเลิกแล้ว
        )}
        index={null}
      />
    ),
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "black" }} // สีของเส้นแสดงตำแหน่งปัจจุบัน
      style={{ backgroundColor: "white", marginBottom: 5 }} // สีพื้นหลังของ TabBar
      labelStyle={{ fontWeight: "bold", color: "black" }} // สไตล์ของตัวอักษรใน Tab
      scrollEnabled
      // onTabPress={(e) => [
      //   e.route.key === "ToShip" && readedaApprove(token?.userDto.userId),
      //   e.route.key === "Canceled" && readedCancel(token?.userDto.userId),
      //   e.route.key === "MyReviews" && getMyReviews(token?.userDto.userId),
      // ]}
      // renderBadge={(e) => [
      //   e.route.key === "ToShip"
      //     ? badgeOrder && (
      //         <Badge
      //           style={{
      //             fontSize: 20,
      //             top: 13,
      //             left: -20,
      //             backgroundColor: "red",
      //             padding: 2,
      //           }}
      //         ></Badge>
      //       )
      //     : null,
      //   e.route.key === "Canceled"
      //     ? badgeCancel && (
      //         <Badge
      //           style={{
      //             fontSize: 20,
      //             top: 13,
      //             left: -20,
      //             backgroundColor: "red",
      //             padding: 2,
      //           }}
      //         ></Badge>
      //       )
      //     : null,
      //   e.route.key === "ToPay"
      //     ? orders?.filter(
      //         (x) => x.orderStatus === 0 && x.paymentImage === "unpaid"
      //       ).length !== 0 && (
      //         <Badge
      //           style={{
      //             fontSize: 20,
      //             top: 13,
      //             left: -20,
      //             backgroundColor: "red",
      //             padding: 2,
      //           }}
      //         ></Badge>
      //       )
      //     : null,
      // ]}
    />
  );

  return (
    <Container>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 1,
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <Title>คำสั่งซื้อของฉัน</Title>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar} // เรียกใช้งาน TabBar ที่คุณปรับแต่ง
      />
      {/* <ScrollView
          horizontal={true}
          style={{
            marginBottom: 20,
          }}
        >
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            style={{
              height: 40,
            }}
            buttons={[
              {
                value: "0",
                label: "ทั้งหมด",
              },
              {
                value: "1",
                label: "กำลังรออนุมัติ",
              },
              {
                value: "2",
                label: "อนุมัติแล้ว",
              },
              {
                value: "3",
                label: "ที่ต้องได้รับ",
              },
              {
                value: "4",
                label: "สำเร็จแล้ว",
              },
              {
                value: "5",
                label: "ยกเลิกแล้ว",
              },
            ]}
          />
        </ScrollView> */}

      {/* <TotalContainer>
        <TotalRow>
          <TotalText style={{ fontWeight: "bold", fontSize: 22 }}>
            ยอดรวมสุทธิ
          </TotalText>
          <TotalAmount style={{ fontWeight: "bold", fontSize: 22 }}>
            {totalPrice.current} ฿
          </TotalAmount>
        </TotalRow>
      </TotalContainer> */}

      {/* <FlatList
        data={[]}
        renderItem={renderOrderItem}
        keyExtractor={(item, i) => "aa" + i}
        contentContainerStyle={{ paddingBottom: 20 }}
      /> */}
    </Container>
  );
};

export default observer(OrderHistoryScreen);

const Container: any = styled(LinearGradient).attrs({
  colors: ["#F7F9FC", "#F7F9FC"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
  padding-top: 60px;
`;

const Title: any = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
  margin-top: -10px;
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
