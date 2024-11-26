import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "@/src/store/store";
import { Mytoast } from "@/components/MyToast";
import { observer } from "mobx-react-lite";
import { IconButton } from "react-native-paper";
import MyActivityIndicator from "@/components/MyActivityIndicator";
import MyCartItem from "@/components/product/MyCartItem";
import { Order } from "@/src/models/Order";
import {
  TotalAmount,
  TotalContainer,
  TotalRow,
  TotalText,
} from "../order/TabOrder.screen";

export default observer(function TabTwoScreen() {
  const {
    orderWantToReceipt,
    searchOrdersWantToReceipt,
    loadingOrder,
    createOrderToReceipt,
  } = useStore().orderStore;
  const { token } = useStore().commonStore;

  const navigation = useNavigation();

  const [subDistrict, setSubDistrict] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const [select, setSelect] = useState<number[]>([]);

  // const data = [
  //   {
  //     id: "1",
  //     title: "KRU-1-1",
  //     description: "ที่อยู่ผู้รับ : 11/3 หมู่ 2 ต.ท่าล้อ อ.ท่าม่วง จ.กาญจนบุรี",
  //   },
  //   {
  //     id: "2",
  //     title: "KRU-1-2",
  //     description: "ที่อยู่ผู้รับ : 11/3 หมู่ 2 ต.ท่าล้อ อ.ท่าม่วง จ.กาญจนบุรี",
  //   },
  //   {
  //     id: "3",
  //     title: "KRU-1-3",
  //     description: "ที่อยู่ผู้รับ : 11/3 หมู่ 2 ต.ท่าล้อ อ.ท่าม่วง จ.กาญจนบุรี",
  //   },
  //   {
  //     id: "4",
  //     title: "KRU-1-4",
  //     description: "ที่อยู่ผู้รับ : 11/3 หมู่ 2 ต.ท่าล้อ อ.ท่าม่วง จ.กาญจนบุรี",
  //   },
  // ];

  const data = orderWantToReceipt?.map((item: any, i) => ({
    order: item?.order,
    address: item?.address,
    i: i,
  }));

  useEffect(() => {
    searchOrdersWantToReceipt(new URLSearchParams());
  }, []);

  const onSelect = (id: number) => {
    if (select.find((x) => x === id) !== undefined) {
      setSelect(select.filter((x) => x !== id));
    } else {
      setSelect([...select, id]);
    }
  };

  const RenderItem = ({ items }: any) => {
    const item = items.item;

    const [totalPrice, setTotalPrice] = useState<string>("");
    const [more, setMore] = useState(false);

    const handleMore = (item: any) => {
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

    console.log("item", item.order.address);

    return (
      <Card>
        <View
          style={{
            padding: 20,
            borderRadius: 15,
            borderWidth: 1,
            backgroundColor: item.i % 2 ? "#D4F6FF" : "#ffffff",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <CardText>รหัสคำสั่งซื้อ</CardText>
              <CardText>{item.order.orderId}</CardText>
            </View>
            <View>
              <IconButton
                icon={
                  select.find((x) => x === item?.order?.id) !== undefined
                    ? "checkbox-marked"
                    : "checkbox-blank-outline"
                }
                size={50} // Set custom size
                onPress={() => onSelect(item.order.id)}
              />
            </View>
          </View>

          {/* <CardDescription>{item.description}</CardDescription> */}

          {more && (
            <View
              style={{
                marginBottom: 20,
              }}
            >
              {item.order.orderItems.map((orderItem: any) => (
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
            <TotalContainer
              style={{
                marginTop: -15,
              }}
            >
              <TotalRow>
                <TotalText style={{ fontWeight: "bold", fontSize: 22 }}>
                  ค่าส่ง
                </TotalText>
                <TotalAmount style={{ fontWeight: "bold", fontSize: 22 }}>
                  {item.order.shippings[0].shippingFee} ฿
                </TotalAmount>
              </TotalRow>
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
            <Card isStore={true}>
              <View
                style={{
                  padding: 20,
                }}
              >
                <CardText>
                  ชื่อ-ที่อยู่ร้านค้า : {item.address.user?.fullName}
                </CardText>
                <CardText>เบอร์ : {item.address.user?.phoneNumber}</CardText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CardText>บ้านเลขที่ {item.address.detail}</CardText>
                </View>

                <CardAddress>
                  ตำบล {item.address.subDistrict} อำเภอ {item.address.district}
                </CardAddress>
                <CardAddress>
                  จังหวัด {item.address.province} {item.address.postCode}
                </CardAddress>
              </View>
            </Card>
          )}

          {more && (
            <View
              style={{
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                ส่งที่
              </Text>
            </View>
          )}

          {more && (
            <Card isStore={false}>
              <View
                style={{
                  padding: 20,
                }}
              >
                <CardText>
                  ชื่อ-ที่อยู่ลูกค้า : {item?.order?.address?.user?.fullName}
                </CardText>
                <CardText>
                  เบอร์ : {item?.order?.address?.user?.phoneNumber}
                </CardText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CardText>บ้านเลขที่ {item?.order?.address.detail}</CardText>
                </View>

                <CardAddress>
                  ตำบล {item?.order?.address.subDistrict} อำเภอ{" "}
                  {item?.order?.address.district}
                </CardAddress>
                <CardAddress>
                  จังหวัด {item?.order?.address.province}{" "}
                  {item?.order?.address.postCode}
                </CardAddress>
              </View>
            </Card>
          )}

          <Button onPress={() => handleMore(item.order)}>
            <ButtonText>{!more ? "เพิ่มเติม" : "ปิด"}</ButtonText>
          </Button>
        </View>
      </Card>
    );
  };

  const handleSearch = () => {
    if (district === "" && subDistrict === "") {
      Mytoast("กรุณากรอก อำเภอ หรือ ตำบล");
    } else {
      let params = new URLSearchParams();

      if (district && district !== "") {
        params.append("district", district);
      }

      if (subDistrict && subDistrict !== "") {
        params.append("subDistrict", subDistrict);
      }

      searchOrdersWantToReceipt(params);
    }
  };

  const handleSelect = () => {
    Alert.alert("ยืนยันการเลือก", "คุณยืนยันที่จะรับคำสั่งซื้อนี้ใช่ไหม", [
      {
        text: "ยกเลิก",
        onPress: () => console.log("Cancelled passed"),
      },
      {
        text: "ยืนยัน",
        onPress: () => createOrderToReceipt({ ...select.map((item) => item) }),
      },
    ]);
  };

  console.log("select AA ", typeof select[0]);

  return (
    <Container>
      {/* <BackButton onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#333" />
      </BackButton> */}

      <Title>คำสั่งซื้อที่สามารถรับหิ้วได้</Title>

      <ScrollView>
        <TitleSearch>ค้นหาพื้นที่ที่คุณกำลังจะไป</TitleSearch>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <View>
            <TextInput
              style={styles.input}
              placeholder="ตำบล"
              value={subDistrict}
              onChangeText={setSubDistrict}
            />

            <TextInput
              style={styles.input}
              placeholder="อำเภอ"
              value={district}
              onChangeText={setDistrict}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSearch}>
              <Text style={styles.saveButtonText}>ค้นหา</Text>
            </TouchableOpacity>
          </View>
        </View>

        {select.length !== 0 && (
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <ButtonSelect onPress={() => handleSelect()}>
              <ButtonText>ยืนยันการเลือก</ButtonText>
            </ButtonSelect>
          </View>
        )}

        {loadingOrder ? (
          <View
            style={{
              alignItems: "center",
            }}
          >
            <MyActivityIndicator size="large" />
            <Text>กำลังโหลด</Text>
          </View>
        ) : (
          <>
            {data.length ? (
              <FlatList
                data={data}
                keyExtractor={(_, i) => "order" + i}
                renderItem={(res) => <RenderItem items={res} />}
              />
            ) : (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: "red",
                  }}
                >
                  ไม่มีสินค้าที่รับหิ้วได้
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Container>
  );
});

const styles = StyleSheet.create({
  input: {
    height: 50,
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
    height: 115,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const Container: any = styled(LinearGradient).attrs({
  colors: ["#e0f7fa", "#ffffff"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  justify-content: flex-start;
  padding: 20px;
  background-color: #f8f9fa;
  padding-top: 60px;
  margin-top: -20;
`;

const Title: any = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const TitleSearch: any = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: red;
  text-align: center;
  margin-bottom: 20px;
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
`;

const CardText: any = styled.Text`
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardDescription: any = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const CardAddress: any = styled.Text`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;

const Button: any = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonSelect: any = styled.TouchableOpacity`
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

const BackButton: any = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  padding: 10px;
`;
