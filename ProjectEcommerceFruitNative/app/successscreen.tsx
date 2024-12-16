import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import { router } from "expo-router";
import styled from "styled-components/native";
import successOrder from "../assets/lotties/Success_order.json";
import LottieView from "lottie-react-native";

const SuccessScreen = () => {
  function handlegotohome() {
    router.push("/(tabs)");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F9FC",
      }}
    >
      {/* <Text>1</Text> */}
      <LottieView
        source={require("../assets/lotties/Success_order.json")}
        style={{
          width: 300,
          height: 300,
        }}
        autoPlay
        loop
      />

      <Title>ขอบคุณสำหรับการสั่งซื้อครับ!</Title>
      <Description>คำสั่งซื้อของคุณจะถูกดำเนินการ</Description>
      <DescriptionTwo>ภายใน 24 ชั่วโมงในวันทำการ</DescriptionTwo>

      <TouchableOpacity style={styles.saveButton} onPress={handlegotohome}>
        <Text style={styles.saveButtonText}>กลับไปยังหน้าเลือกสินค้า</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
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

const Title: any = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Description: any = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const DescriptionTwo: any = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;
