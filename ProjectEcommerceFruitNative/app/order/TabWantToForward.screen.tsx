import { View, Text, FlatList, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/store";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import CardOrderSearch from "./CardOrderSearch";
import MyActivityIndicator from "@/components/MyActivityIndicator";
import CardOrderForward from "./CardOrderForward";
import {
  Button,
  Dialog,
  Portal,
  PaperProvider,
  Text as TextP,
} from "react-native-paper";
import { Mytoast } from "@/components/MyToast";

const TabWantToForwardScreen = () => {
  const { orderForward, loadingOrder, confirmOrderToForward } =
    useStore().orderStore;

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [driverId, setDriverId] = useState<number | null>(null);
  const [shippingId, setShippingId] = useState<number | null>(null);
  const [shippingFee, setShippingFee] = useState<number | null>(null);

  const [value, setValue] = useState("");

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    setValue("");
    setErrorMessage("");
  };

  const onSelectToForward = async () => {
    const numberValue = parseFloat(value);
    // setErrorMessage(
    //   isNaN(numberValue)
    //     ? "กรุณาใส่จำนวนเงินที่เป็นตัวเลข!"
    //     : numberValue < 0
    //     ? "จำนวนเงินต้องไม่ติดลบ!"
    //     : shippingFee && numberValue > shippingFee
    //     ? "เงินเกินจำนวนที่กำหนด!"
    //     : ""
    // );

    if (isNaN(numberValue)) {
      setErrorMessage("กรุณาใส่จำนวนเงินที่เป็นตัวเลข!");
    } else if (numberValue < 0) {
      setErrorMessage("จำนวนเงินต้องไม่ติดลบ!");
    } else if (numberValue === 0) {
      setErrorMessage("จำนวนเงินต้องไม่เท่ากับศูนย์!");
    } else if (shippingFee && numberValue > shippingFee) {
      setErrorMessage("เงินเกินจำนวนที่กำหนด!");
    } else {
      setErrorMessage("");

      console.log("driverId", driverId);
      console.log("shippingId", shippingId);
      console.log("numberValue", numberValue);

      await confirmOrderToForward({
        driverId: driverId,
        shippingId: shippingId,
        shippingFee: numberValue,
      }).then(() => {
        Mytoast("ส่งต่อคำสั่งซื้อเรียบร้อยแล้ว");
        hideDialog();
      });
    }
  };

  const handleShowDialog = (
    driverId: number,
    shippingId: number,
    shippingFee: number
  ) => {
    setDriverId(driverId);
    setShippingId(shippingId);
    setShippingFee(shippingFee);
    showDialog();
  };

  const onChangeValue = (e: string) => {
    setValue(e);
  };

  return (
    <PaperProvider>
      <Container>
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={hideDialog}
            style={{
              backgroundColor: "white",
            }}
          >
            <Dialog.Title>
              ท่านแน่ใจหรือไม่ว่าต้องการส่งต่อคำสั่งซื้อ?
            </Dialog.Title>
            <Dialog.Content>
              <TextP>กรุณาใส่จำนวนเงินค่าจัดส่ง ไม่เกิน {shippingFee}</TextP>
            </Dialog.Content>

            <TextInput
              value={value}
              onChangeText={onChangeValue}
              style={[
                styles.input,
                errorMessage !== "" && { borderColor: "red" },
              ]}
              placeholder={"กรุณาใส่จำนวนเงินค่าจัดส่ง ไม่เกิน " + shippingFee}
              placeholderTextColor="#999"
              autoFocus
              keyboardType="number-pad"
            />

            {errorMessage !== "" && (
              <Dialog.Content>
                <TextP
                  style={{
                    color: "red",
                  }}
                >
                  {errorMessage}
                </TextP>
              </Dialog.Content>
            )}

            <Dialog.Actions>
              <Button onPress={hideDialog}>ยกเลิก</Button>
              <Button onPress={onSelectToForward}>ยืนยัน</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {loadingOrder ? (
          <MyActivityIndicator size="large" />
        ) : (
          <FlatList
            data={orderForward}
            renderItem={({ item }) => (
              <CardOrderForward
                item={item}
                handleShowDialog={handleShowDialog}
              />
            )}
            keyExtractor={(item) => "item.id" + item.id}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TitleNotFound>ไม่มีคำร้องขอส่งต่อคำสั่งซื้อ</TitleNotFound>
              </View>
            )}
          />
        )}
      </Container>
    </PaperProvider>
  );
};

export default observer(TabWantToForwardScreen);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    marginHorizontal: 23,
  },
});

const Container: any = styled(LinearGradient).attrs({
  colors: ["#E8F0FF", "#F7F9FC"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding: 10px;
  padding-top: 10px;
`;

const TitleNotFound: any = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: red;
  margin-bottom: 20px;
`;
