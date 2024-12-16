import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useStore } from "@/src/store/store";
import TabSearchOrderScreen from "./order/TabSearchOrder.screen";
import TabWantToForwardScreen from "./order/TabWantToForward.screen";

const SearchOrderToSend = () => {
  const { getMyOrderUserWantToTaketoSend } = useStore().orderStore;

  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "first", title: "ที่ต้องการรับ" },
    { key: "second", title: "ที่ต้องการส่ง" },
  ]);

  const renderScene = SceneMap({
    first: () => <TabSearchOrderScreen />,
    second: () => <TabWantToForwardScreen />,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "black" }} // สีของเส้นแสดงตำแหน่งปัจจุบัน
      style={{ backgroundColor: "#F7F9FC", marginBottom: 5 }} // สีพื้นหลังของ TabBar
      labelStyle={{ fontWeight: "bold", color: "black" }} // สไตล์ของตัวอักษรใน Tab
      scrollEnabled
      tabStyle={{
        width: 186,
      }}
      onTabPress={async (scene) => {
        if (scene.route.key === "second") {
          await getMyOrderUserWantToTaketoSend();
        }
      }}
    />
  );

  return (
    <Container>
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

      <Title>รับ-ส่งต่อ คำสั่งซื้อ</Title>

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

export default observer(SearchOrderToSend);

const Container: any = styled(LinearGradient).attrs({
  colors: ["#F7F9FC", "#F7F9FC"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 10px;
  padding-top: 60px;
`;

const Title: any = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
  margin-top: -20px;

`;
