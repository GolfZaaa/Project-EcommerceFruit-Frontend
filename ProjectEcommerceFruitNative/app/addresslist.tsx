import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import React, { useEffect } from "react";
import { Container, Title } from "./editaddress";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/src/store/store";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import { Address } from "@/src/models/Address";
import { observer } from "mobx-react-lite";

const AddressList = () => {
  const { myAddress, removeAddressById } = useStore().addressStore;

  const navigation = useNavigation();

  const onRemoveAddress = async (addressId: number) => {
    Alert.alert("ลบที่อยู่", "ยืนยันจะลบที่อยู่นี้ไหม", [
      {
        text: "ยกเลิก",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "ลบเลย",
        onPress: async () => {
          const res = await removeAddressById(addressId);

          console.log("res", typeof res);

          if (res !== true) {
            Alert.alert(
              "ไม่สามารถลบได้",
              "ไม่สามารถลบได้ เนื่องจากที่อยู่นี้ถูกใช้งานแล้ว",
              [
                {
                  text: "ตกลง",
                  onPress: () => console.log("ok Pressed"),
                },
              ]
            );
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Address }) => (
    <Card>
      <CardText>บ้านเลขที่ {item.detail}</CardText>
      <CardDescription>
        ตำบล {item.subDistrict} อำเภอ {item.district}
      </CardDescription>
      <CardDescription>
        จังหวัด {item.province} {item.postCode}
      </CardDescription>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: 150,
          }}
        >
          <Button
            onPress={() =>
              router.push({
                pathname: "/editaddress",
                params: {
                  title: "แก้ไขที่อยู่",
                  data: JSON.stringify(item),
                  setting: JSON.stringify(true),
                },
              })
            }
          >
            <ButtonText>แก้ไข</ButtonText>
          </Button>
        </View>
        <View
          style={{
            width: 150,
          }}
        >
          <ButtonRemove onPress={() => onRemoveAddress(item.id)}>
            <ButtonText>ลบ</ButtonText>
          </ButtonRemove>
        </View>
      </View>
    </Card>
  );

  console.log("myAddress", myAddress);

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

      <Title>รายการที่อยู่ของฉัน</Title>

      <ButtonAdd
        onPress={() =>
          router.push({
            pathname: "/editaddress",
            params: {
              title: "แก้ไขที่อยู่",
              data: JSON.stringify({ id: 0 }),
              setting: JSON.stringify(true),
            },
          })
        }
      >
        <ButtonText>เพิ่มที่อยู่</ButtonText>
      </ButtonAdd>

      <FlatList
        data={myAddress}
        keyExtractor={(item) => item.user.fullName + item.id}
        renderItem={renderItem}
      />
    </Container>
  );
};

export default observer(AddressList);

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
  font-size: 22px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardDescription: any = styled.Text`
  font-size: 19px;
  color: #666;
  margin-bottom: 20px;
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

const ButtonAdd: any = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonText: any = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
