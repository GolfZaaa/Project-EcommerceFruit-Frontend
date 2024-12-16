import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useStore } from "@/src/store/store";
import TabEarnScreen from "./earn/TabEarn.screen";
import { Order } from "@/src/models/Order";

const MyEarn = () => {
  const { order, getMyOrderToSend } = useStore().orderStore;
  const { user } = useStore().userStore;

  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "ทั้งหมด" },
    { key: "second", title: "ที่ต้องส่ง" },
    { key: "third", title: "ส่งแล้ว" },
    { key: "fourth", title: "ส่งต่อให้ผู้จัดส่งคนอื่น" },
  ]);

  const dataForwardDriver: Order[] = order.filter((item) =>
    item.shippings[0].driverHistories.some(
      (history) => history.statusDriver === 3 && history.userId === user?.id
    )
  );

  const renderScene = SceneMap({
    first: () => <TabEarnScreen data={order} index={0} />,
    second: () => (
      <TabEarnScreen
        data={order.filter((item) => item?.shippings[0]?.shippingStatus === 0)}
        index={1}
      />
    ),
    third: () => (
      <TabEarnScreen
        data={order.filter((item) => item?.shippings[0]?.shippingStatus === 1)}
        index={2}
      />
    ),
    fourth: () => <TabEarnScreen data={dataForwardDriver} index={3} />,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "black" }} // สีของเส้นแสดงตำแหน่งปัจจุบัน
      style={{ backgroundColor: "white", marginBottom: 5 }} // สีพื้นหลังของ TabBar
      labelStyle={{ fontWeight: "bold", color: "black" }} // สไตล์ของตัวอักษรใน Tab
      scrollEnabled
      tabStyle={{
        width: 170,
      }}
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

      <Title>การสร้างรายได้ของฉัน</Title>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar} // เรียกใช้งาน TabBar ที่คุณปรับแต่ง
      />
    </Container>
  );
};

export default observer(MyEarn);

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
