import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/store";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import CardOrderSearch from "./CardOrderSearch";

const TabSearchOrderScreen = () => {
  const { orderSearch, searchOrderToSendByOrderId } = useStore().orderStore;

  const [value, setValue] = useState<string | null>("KRU-");
  const [showOrderEmpty, setShowOrderEmpty] = useState<boolean>(false);

  const handleSearch = () => {

    if (value === "KRU-") {
      setShowOrderEmpty(false);
    } else {
      searchOrderToSendByOrderId(value).then((res) => {
        if (res.length === 0) {
          setShowOrderEmpty(true);
        }
      });
    }
  };

  const handleOrderIdChange = (e: any) => {
    const value = e;

    if (value && value.startsWith("KRU-")) {
      setValue(value);
    }
  };

  return (
    <ContainerOne>
      <TitleOne>ค้นหาคำสั่งซื้อที่ต้องการรับ</TitleOne>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="รหัสคำสั่งซื้อสินค้า"
            value={value || ""}
            onChangeText={handleOrderIdChange}
          />
        </View>

        <View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSearch}>
            <Text style={styles.saveButtonText}>ค้นหา</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={orderSearch}
        renderItem={({ item }) => <CardOrderSearch item={item} />}
        keyExtractor={(item) => "item.id" + item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={() =>
          showOrderEmpty && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TitleNotFound>ไม่พบคำสั่งซื้อ</TitleNotFound>
            </View>
          )
        }
      />
    </ContainerOne>
  );
};

export default observer(TabSearchOrderScreen);

const styles = StyleSheet.create({
  input: {
    height: 55,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    width: 250,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const ContainerOne: any = styled(LinearGradient).attrs({
  colors: ["#F7F9FC", "#F7F9FC"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
  padding-top: 20px;
`;

const TitleOne: any = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const TitleNotFound: any = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: red;
  margin-bottom: 20px;
`;
