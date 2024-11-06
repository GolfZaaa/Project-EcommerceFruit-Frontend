import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import mockAddress from "../assets/json/new_data.json";
import SelectDropdown from "react-native-select-dropdown";
import { useStore } from "@/src/store/store";
import { Mytoast } from "@/components/MyToast";
import { observer } from "mobx-react-lite";

export const Container: any = styled(LinearGradient).attrs({
  colors: ["#E8F0FF", "#F7F9FC"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
  padding-top: 60px;
`;

export const Title: any = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

export default observer(function EditAddressScreen() {
  const params = useLocalSearchParams();
  const { title, data: dAtA, goto, setting }: any = params;

  const datA = JSON.parse(dAtA);

  const { createUpdateAddress, getAddressByUserId } = useStore().addressStore;

  const navigation = useNavigation();
  const [address, setAddress] = useState(datA ? datA.detail : "");
  const [postCode, setPostCode] = useState(datA ? datA.postCode : "");

  const [data, setData]: any = useState([]);
  const [dataSelect, setdataSelect]: any = useState(datA ? datA : []);

  const handleSave = async () => {
    if (
      address &&
      postCode &&
      dataSelect?.subDistrict &&
      dataSelect?.district &&
      dataSelect?.province
    ) {
      console.log("บันทึกได้ !!");

      const dataAddress = {
        id: datA.id,
        subDistrict: dataSelect.subDistrict,
        district: dataSelect.district,
        province: dataSelect.province,
        postCode: postCode,
        detail: address,
        isUsed_Store: false,
        isUsed: true,
        gps: "",
      };

      await createUpdateAddress(dataAddress).then(async (result) => {
        console.log("dataAddress", dataAddress);
        console.log("result", result);

        if (!!result) {
          Mytoast("เพิ่มที่อยู่สำเร็จ");
          await getAddressByUserId();

          console.log("setting", setting);

          if (JSON.parse(setting) === true) {
            router.back();
          } else {
            router.replace("/cartdetail");
          }
        } else {
          Mytoast("เกิดข้อผิดพลาด");
        }
      });
    } else {
      alert("กรอกข้อมูลไม่ถูกต้อง หรือ ไม่ครบทุกช่อง");

      console.log("Address saved:", {
        address,
        postCode,
        subDistrict: dataSelect?.subDistrict,
        district: dataSelect?.district,
        province: dataSelect?.province,
      });
    }
  };

  function searchByZipCode(zipCode: any) {
    const results = [];
    for (const [province, districts] of mockAddress) {
      for (const [district, subDistricts] of districts) {
        for (const [subDistrict, codes] of subDistricts) {
          for (const code of codes) {
            if (code === zipCode) {
              results.push({ zipCode, province, district, subDistrict });
            }
          }
        }
      }
    }

    setData(results);
  }

  useEffect(() => {
    searchByZipCode(Number(postCode));
  }, [postCode]);

  console.log("datA", datA);
  console.log("address", address);

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

      <Title>{title}</Title>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="บ้านเลขที่, หมู่, ซอย, ถนน *"
          value={address}
          onChangeText={setAddress}
        />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TextInput
            style={[styles.input, data.length ? {} : { width: "100%" }]}
            placeholder="รหัสไปรษณีย์"
            value={postCode}
            onChangeText={setPostCode}
            keyboardType="numeric"
          />

          {data.length ? (
            <SelectDropdown
              data={data}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem, index);
                setdataSelect(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.subDistrict) ||
                        "เลือกที่อยู่"}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item.subDistrict}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          ) : (
            <View></View>
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="แขวง/ตำบล"
          value={dataSelect ? dataSelect.subDistrict : ""}
          // onChangeText={setSubDistrict}
        />
        <TextInput
          style={styles.input}
          placeholder="เขต/อำเภอ"
          value={dataSelect ? dataSelect.district : ""}
          // onChangeText={setDistrict}
        />
        <TextInput
          style={styles.input}
          placeholder="จังหวัด"
          value={dataSelect ? dataSelect.province : ""}
          // onChangeText={setProvince}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
});

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 10,
  },
  input: {
    height: 50,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownButtonStyle: {
    width: 180,
    height: 50,
    // backgroundColor: "#E9ECEF",
    backgroundColor: "red",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    textAlign: "center",
    marginLeft: 10,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "500",
    // color: "#151E26",
    color: "white",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
