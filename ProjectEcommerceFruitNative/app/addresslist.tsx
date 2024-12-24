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
import { Switch } from "react-native-paper";

export const ExternalRenderItem = ({
  item,
  i,
  handleChangesModal,
}: {
  item: Address;
  i: number;
  handleChangesModal: Function;
}) => {
  const addressTitle = getAddressTitle(item);

  return (
    <ExtCard isStore={!(i % 2)}>
      <View
        style={{
          // flex: 1,
          alignItems: "flex-end",
        }}
      >
        {addressTitle && <CardTitle>{addressTitle}</CardTitle>}
      </View>

      <CardText>บ้านเลขที่ {item.detail}</CardText>

      <CardDescription>
        ตำบล {item.subDistrict} อำเภอ {item.district}
      </CardDescription>
      <CardDescription>
        จังหวัด {item.province} {item.postCode}
      </CardDescription>

      <View
        style={{
          width: "100%",
        }}
      >
        <ExtButton
          onPress={() => handleChangesModal(item, true)}
          isUsed_Store={item.isUsed_Store}
          disabled={item.isUsed_Store}
        >
          <ExtButtonText>
            {item.isUsed_Store ? "กำลังใช้งาน" : "ตั้งเป็นที่อยู่ร้านค้า"}
          </ExtButtonText>
        </ExtButton>
      </View>

      {/* <View
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
          <Button>
            <ButtonText>แก้ไข</ButtonText>
          </Button>
        </View>
        <View
          style={{
            width: 150,
          }}
        >
          <ButtonRemove>
            <ButtonText>ลบ</ButtonText>
          </ButtonRemove>
        </View>
      </View> */}
    </ExtCard>
  );
};

const getAddressTitle = (item: { isUsed: boolean; isUsed_Store: boolean }) => {
  if (item.isUsed) return "ที่อยู่สั่งซื้อ";
  if (item.isUsed_Store) return "ที่อยู่ร้านค้า";
  return null;
};

const AddressList = () => {
  const {
    myAddress,
    removeAddressById,
    isUsedAddress,
    getAddressByUserId,
    getAddressgotoOrderByUserId,
  } = useStore().addressStore;
  const { user } = useStore().userStore;

  const navigation = useNavigation();

  const onRemoveAddress = async (addressId: number) => {
    Alert.alert("ลบที่อยู่", "ยืนยันจะลบที่อยู่นี้ไหม", [
      {
        text: "ยกเลิก",
        // onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "ลบเลย",
        onPress: async () => {
          const res = await removeAddressById(addressId);

          // console.log("res", typeof res);

          if (res !== true) {
            Alert.alert(
              "ไม่สามารถลบได้",
              "ไม่สามารถลบได้ เนื่องจากที่อยู่นี้ถูกใช้งานแล้ว",
              [
                {
                  text: "ตกลง",
                  // onPress: () => console.log("ok Pressed"),
                },
              ]
            );
          }
        },
      },
    ]);
  };

  const RenderItem = ({ item }: { item: Address }) => {
    const onToggleSwitch = async (addressId: number, storeormine: boolean) => {
      await isUsedAddress({ addressId, storeormine });
      getAddressByUserId();
      getAddressgotoOrderByUserId();
    };

    const addressTitle = getAddressTitle(item);

    return (
      <Card isStore={item.isUsed_Store}>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          {addressTitle && <CardTitle>{addressTitle}</CardTitle>}
        </View>

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
            alignItems: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            {!!user?.stores.length === true && (
              <>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  ที่อยู่ร้านค้า
                </Text>

                <Switch
                  value={item.isUsed_Store}
                  onValueChange={() => onToggleSwitch(item.id, true)}
                />
              </>
            )}
          </View>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              ตั้งเป็นที่อยู่สั่งซื้อ
            </Text>

            <Switch
              value={item.isUsed}
              onValueChange={() => onToggleSwitch(item.id, false)}
            />
          </View>
        </View>

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
                    isStore: JSON.stringify(false),
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
  };

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
              title: "เพิ่มที่อยู่",
              data: JSON.stringify({ id: 0 }),
              setting: JSON.stringify(true),
              isStore: JSON.stringify(false),
            },
          })
        }
      >
        <ButtonText>เพิ่มที่อยู่</ButtonText>
      </ButtonAdd>

      <FlatList
        data={myAddress}
        keyExtractor={(item) => item.user.fullName + item.id}
        renderItem={({ item }) => <RenderItem item={item} />}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
              }}
            >
              ไม่มีข้อมูลที่อยู่
            </Text>
          </View>
        }
      />
    </Container>
  );
};

export default observer(AddressList);

const Card: any = styled(LinearGradient).attrs((props: any) => ({
  colors: ["#f7f9fc", props.isStore ? "powderblue" : "#ffffff"], // กำหนด colors ตาม props ถ้าไม่มีใช้ค่าเริ่มต้น
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 2;
`;

const ExtCard: any = styled(LinearGradient).attrs((props: any) => ({
  colors: ["#f7f9fc", props.isStore ? "#D9EAFD" : "#ffffff"], // กำหนด colors ตาม props ถ้าไม่มีใช้ค่าเริ่มต้น
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
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

const CardTitle: any = styled.Text`
  font-size: 25px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10px;
  background-color: red;
  padding: 5px 15px;
  border-radius: 20px;
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

const ExtButtonText: any = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

const ExtButton: any = styled.TouchableOpacity`
  background-color: ${(e: any) => (e.isUsed_Store ? "gray" : "#007bff")};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;
