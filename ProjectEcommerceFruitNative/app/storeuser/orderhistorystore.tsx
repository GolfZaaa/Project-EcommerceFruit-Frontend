import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/store";
import { Order } from "@/src/models/Order";
import { formatDateThaiNative } from "@/src/helper/components";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { pathImagesApp } from "@/src/constants/RoutePath";
import MyCartItem from "@/components/product/MyCartItem";
import {
  TotalAmount,
  TotalContainer,
  TotalRow,
  TotalText,
} from "../order/TabOrder.screen";
import { Mytoast } from "@/components/MyToast";
import { Dropdown } from "react-native-element-dropdown";

const categorySend = [
  {
    value: 1,
    label: "ส่งไปรษณีย์แบบลงทะเบียน",
  },
  {
    value: 2,
    label: "ส่งแบบไปรษณีย์ด่วนพิเศษ ( EMS )",
  },
  {
    value: 3,
    label: "เคอรี่ เอ็กซ์เพรส (Kerry Express)",
  },
  {
    value: 4,
    label: "เจแอนด์ที เอ็กซ์เพรส (J&T Express) ",
  },
  {
    value: 5,
    label: "แฟลช เอ็กซ์เพรส (Flash Express) ",
  },
  {
    value: 6,
    label: "เบสท์ เอ็กซ์เพรส (Best Express)",
  },
  {
    value: 7,
    label: "นินจา แวน (Ninja Van)",
  },
  {
    value: 8,
    label: "อื่น ๆ",
  },
];

const OrderHistoryStoreScreen = () => {
  const { order, getOrderByStore, cancelOrder, confirmOrder } =
    useStore().orderStore;
  const { user } = useStore().userStore;
  const layout = useWindowDimensions();

  const navigation = useNavigation();

  const handleCancel = async (values: any) => {
    Alert.alert("ยกเลิกคำสั่งซื้อนี้", "ยืนยันเพื่อยกเลิกคำสั่งซื้อนี้", [
      {
        text: "ยกเลิก",
        // onPress: () => console.log("cancel successfully"),
      },
      {
        text: "ยืนยัน",
        onPress: async () =>
          await cancelOrder(values).then((res) => {
            if (!!res) {
              Mytoast("ยกเลิกคำสั่งซื้อสำเร็จ");
              getOrderByStore(user?.stores[0].id || 0);
            }
          }),
      },
    ]);
  };

  const RenderOrderItem = ({
    item,
    index,
  }: {
    item: Order;
    index: number | null;
  }) => {
    const [totalPrice, setTotalPrice] = useState<string>("");
    const [more, setMore] = useState(false);

    const [tracking, setTracking] = useState("จัดส่งผ่านผู้รับหิ้ว");

    const [selectCate, setSelectCate] = useState("อื่น ๆ");

    const [value, setValue] = useState(8);

    const handleMore = (item: Order) => {
      // Calculate total price
      const total = item.orderItems.reduce(
        (acc: number, orderItem: any) =>
          acc + orderItem.product.price * orderItem.quantity,
        0
      );

      if (!more) {
        setTotalPrice((total + item.shippings[0].shippingFee).toString());
        setMore((prev) => !prev);
      } else {
        setTotalPrice("");
        setMore((prev) => !prev);
      }
    };

    const handleSubmit = async (item: any) => {
      const dataForm = {
        orderId: item?.id || 0,
        trackingId: item?.status === 1 ? tracking : null,
        shippingType: !!selectCate ? selectCate : null,
      };

      if (item?.status === 1 && item?.tag === null) {
        if (selectCate === "อื่น ๆ") {
          Alert.alert("ยืนยันคำสั่งซื้อนี้", "ยืนยันเพื่อยืนยันคำสั่งซื้อนี้", [
            {
              text: "ยกเลิก",
              // onPress: () => console.log("cancel successfully"),
            },
            {
              text: "ยืนยัน",
              onPress: async () =>
                await confirmOrder(dataForm).then((res) => {
                  if (!!res) {
                    Mytoast("ยืนยันคำสั่งซื้อสำเร็จ");
                    getOrderByStore(user?.stores[0].id || 0);
                  }
                }),
            },
          ]);
        } else {
          if (tracking === "") {
            Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกหมายเลขพัสดุ", [
              {
                text: "ตกลง",
              },
            ]);
            Mytoast("กรุณากรอกหมายเลขพัสดุ");
          } else {
            Alert.alert(
              "ยืนยันคำสั่งซื้อนี้",
              "ยืนยันเพื่อยืนยันคำสั่งซื้อนี้",
              [
                {
                  text: "ยกเลิก",
                  // onPress: () => console.log("cancel successfully"),
                },
                {
                  text: "ยืนยัน",
                  onPress: async () =>
                    await confirmOrder(dataForm).then((res) => {
                      if (!!res) {
                        Mytoast("ยืนยันคำสั่งซื้อสำเร็จ");
                        getOrderByStore(user?.stores[0].id || 0);
                      }
                    }),
                },
              ]
            );
          }
        }
      } else {
        Alert.alert("ยืนยันคำสั่งซื้อนี้", "ยืนยันเพื่อยืนยันคำสั่งซื้อนี้", [
          {
            text: "ยกเลิก",
            // onPress: () => console.log("cancel successfully"),
          },
          {
            text: "ยืนยัน",
            onPress: async () =>
              await confirmOrder(dataForm).then((res) => {
                if (!!res) {
                  Mytoast("ยืนยันคำสั่งซื้อสำเร็จ");
                  getOrderByStore(user?.stores[0].id || 0);
                }
              }),
          },
        ]);
      }
    };

    const onSelectCate = (name: string) => {
      if (name === "อื่น ๆ") {
        setTracking("จัดส่งผ่านผู้รับหิ้ว");
      } else {
        setTracking("");
      }
      setSelectCate(name);
    };

    return (
      <OrderCard>
        <View>
          <OrderInfo>
            <View>
              <OrderTitle>{item.orderId}</OrderTitle>
              <OrderDate>
                {formatDateThaiNative(item.createdAt, 0, 1)}
              </OrderDate>
            </View>
            <View>
              <View
                style={{
                  backgroundColor: `${
                    item.status === 0 ||
                    (item.status === 1 && item.tag === null)
                      ? "red"
                      : "white"
                  }`,
                  paddingVertical:
                    item.status === 0 ||
                    (item.status === 1 && item.tag === null)
                      ? 5
                      : 0,
                  paddingHorizontal:
                    item.status === 0 ||
                    (item.status === 1 && item.tag === null)
                      ? 12
                      : 0,
                  borderRadius: 50,
                }}
              >
                <OrderStatus status={item.status} tag={item.tag}>
                  {item.status === 0
                    ? "กำลังรออนุมัติ"
                    : item.status === 1 && item.tag === null
                    ? "กรอกหมายเลขพัสดุ"
                    : item.status === 1
                    ? "ยืนยันคำสั่งซื้อแล้ว"
                    : item.status === 2
                    ? "ยกเลิกคำสั่งซื้อแล้ว"
                    : "เพิ่มสถานะด้วย"}
                </OrderStatus>
              </View>
            </View>
          </OrderInfo>

          <Image
            source={{ uri: pathImagesApp.paymentImage + item.paymentImage }}
            style={more ? styles.imageMore : styles.image}
          />

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
                  ค่าส่ง
                </TotalText>
                <TotalAmount style={{ fontWeight: "bold", fontSize: 22 }}>
                  {item.shippings[0].shippingFee} ฿
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

          {index === 1 && item?.status === 1 && (
            <View>
              {more && (
                // <TextInput
                //   value={selectCate}
                //   onChangeText={setSelectCate}
                //   style={styles.input}
                //   placeholder="จำนวน *"
                //   placeholderTextColor="#999"
                //   readOnly={
                //     item?.status === 0 || !!item?.tag || item?.status == 2
                //   }
                // />

                <View
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Dropdown
                    style={[
                      styles.dropdown,
                      // isFocus && { borderColor: "blue" },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={categorySend}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="เลือกขนส่ง"
                    dropdownPosition="auto"
                    // placeholder={!isFocus ? "Select item" : "..."}
                    searchPlaceholder="ค้นหา..."
                    value={value}
                    // onFocus={() => setIsFocus(true)}
                    // onBlur={() => setIsFocus(false)}
                    onChange={(item: any) => {
                      setValue(item.value);
                      onSelectCate(item.label);
                      // setIsFocus(false);
                    }}
                    // renderLeftIcon={() => (
                    //   <AntDesign
                    //     style={styles.icon}
                    //     color={isFocus ? "blue" : "black"}
                    //     name="Safety"
                    //     size={20}
                    //   />
                    // )}
                  />
                </View>
              )}

              {more && (
                <TextInput
                  value={tracking}
                  onChangeText={setTracking}
                  style={styles.input}
                  placeholder="หมายเลขพัสดุ (tracking)"
                  placeholderTextColor="#999"
                  readOnly={
                    // item?.status === 0 || !!item?.tag || selectCate === "อื่น ๆ"
                    !!item?.tag || selectCate === "อื่น ๆ"
                  }
                />
              )}
            </View>
          )}

          {((more === true && index === 1) ||
            (more === true && index === 2)) && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  width: 150,
                }}
              >
                {item.status === 0 ? (
                  <Button onPress={() => handleSubmit(item)}>
                    <ButtonText>ยืนยันคำสั่งซื้อ</ButtonText>
                  </Button>
                ) : (
                  <Button
                    onPress={() => handleSubmit(item)}
                    disabled={!!item?.tag || item?.status == 2}
                  >
                    <ButtonText>
                      {!!item?.tag
                        ? "เสร็จสิ้น"
                        : selectCate === "อื่น ๆ"
                        ? "บันทึก"
                        : "บันทึก"}
                    </ButtonText>
                  </Button>
                )}
              </View>

              <View
                style={{
                  width: 150,
                }}
              >
                <ButtonRemove
                  onPress={() => handleCancel({ orderId: item?.id })}
                  disabled={item?.status == 1 || item?.status == 2}
                >
                  <ButtonText>ยกเลิกคำสั่งซื้อ</ButtonText>
                </ButtonRemove>
              </View>
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
        </View>
      </OrderCard>
    );
  };

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "ทั้งหมด" },
    { key: "second", title: "กำลังรออนุมัติ" },
    // { key: "secondary", title: "กรอกหมายเลขพัสดุ" },
    { key: "third", title: "ยืนยันคำสั่งซื้อแล้ว" },
    { key: "fourth", title: "ยกเลิกคำสั่งซื้อแล้ว" },
  ]);

  const TabOrderScreen = ({
    items,
    index,
  }: {
    items: Order[];
    index: number | null;
  }) => {
    return (
      <FlatList
        data={items}
        renderItem={({ item }) => <RenderOrderItem item={item} index={index} />}
        keyExtractor={(item) => "item.id" + item.id}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OrderTitle>ไม่พบคำสั่งซื้อ</OrderTitle>
          </View>
        }
      />
    );
  };

  const renderScene = SceneMap({
    first: () => (
      <TabOrderScreen
        items={order} //ทั้งหมด
        index={null}
      />
    ),
    second: () => (
      <TabOrderScreen
        items={order.filter(
          (item) =>
            (item?.status === 0 || item?.status === 1) && item.tag === null
        )} //กำลังรออนุมัติ
        index={1}
      />
    ),
    // secondary: () => (
    //   <TabOrderScreen
    //     items={order.filter((item) => item?.status === 1 && item.tag === null)} //กำลังรออนุมัติ
    //     index={2}
    //   />
    // ),
    third: () => (
      <TabOrderScreen
        items={order.filter((item) => item?.status === 1 && item.tag !== null)} //ยืนยันคำสั่งซื้อแล้ว
        index={null}
      />
    ),
    fourth: () => (
      <TabOrderScreen
        items={order.filter((item) => item?.status === 2)} //ยกเลิกคำสั่งซื้อแล้ว
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
      tabStyle={{
        width: 160,
      }}
      scrollEnabled
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

      <Title>ประวัติรายการคำสั่งซื้อ</Title>
      

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

export default observer(OrderHistoryStoreScreen);

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 87,
    borderRadius: 10,
  },
  imageMore: {
    width: 300,
    height: 600,
    borderRadius: 10,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

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

const OrderCard: any = styled(View)`
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
  font-size: 16px;
  font-weight: bold;
  color: ${(props: any) =>
    props.status === 0 || (props.status === 1 && props.tag === null)
      ? "yellow"
      : props.status === 1
      ? "green"
      : props.status === 2
      ? "red"
      : "blue"};
`;

const Button: any = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonRemove: any = styled.TouchableOpacity`
  background-color: ${(props) => (props.disabled ? "gray" : "red")};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText: any = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
