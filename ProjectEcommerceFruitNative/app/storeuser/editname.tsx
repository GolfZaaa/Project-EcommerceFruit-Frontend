import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useStore } from "@/src/store/store";
import { observer } from "mobx-react-lite";
import { Mytoast } from "@/components/MyToast";
import { router } from "expo-router";

const BackButton: any = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  padding: 10px;
`;

export default observer(function EditName() {
  const { usershop, createandupdate } = useStore().shopUserStore;
  const { address: addresss, createUpdateAddress } = useStore().addressStore;
  const { getUserDetailbyId } = useStore().userStore;

  const [name, setName] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [address, setAddress] = useState<string | undefined>("");
  const [postalCode, setPostalCode] = useState<string | undefined>("");
  const [subDistrict, setSubDistrict] = useState<string | undefined>("");
  const [district, setDistrict] = useState<string | undefined>("");
  const [province, setProvince] = useState<string | undefined>("");

  const navigation = useNavigation();

  useEffect(() => {
    setName(usershop?.name);
    setDescription(usershop?.description);
    setAddress(addresss?.detail);
    setPostalCode(addresss?.postCode);
    setSubDistrict(addresss?.subDistrict);
    setDistrict(addresss?.district);
    setProvince(addresss?.province);
  }, [usershop]);

  console.log("addresss", addresss);
  console.log("usershop", usershop);

  const handleSaveShop = async () => {
    const dataForm = {
      id: usershop?.id || 0,
      name: name,
      description: description,
    };

    await createandupdate(dataForm).then(async (res) => {
      if (res) {
        const dataAddress = {
          id: addresss?.id || 0,
          subDistrict: subDistrict,
          district: district,
          province: province,
          postCode: postalCode,
          detail: address,
          isUsed_Store: true,
          isUsed: false,
          gps: "",
        };

        await createUpdateAddress(dataAddress);
        Mytoast("ลงทะเบียนร้านค้าสำเร็จ");
        getUserDetailbyId();

        router.back();
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#333" />
        </BackButton>

        <Text style={styles.drawerTitle}>แก้ไขข้อมูลร้านค้า</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ชื่อร้านค้า</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="ชื่อร้านค้า *"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>รายละเอียด</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="รายละเอียด *"
            style={styles.input}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <Text style={styles.sectionTitle}>ที่อยู่ร้านค้า</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>บ้านเลขที่, หมู่, ซอย, ถนน</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="บ้านเลขที่, หมู่, ซอย, ถนน *"
            style={styles.input}
          />
        </View>

        <View style={styles.addressRow}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>รหัสไปรษณีย์</Text>
            <TextInput
              value={postalCode}
              onChangeText={setPostalCode}
              placeholder="รหัสไปรษณีย์ *"
              style={styles.input}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>แขวง/ตำบล</Text>
            <TextInput
              value={subDistrict}
              onChangeText={setSubDistrict}
              placeholder="แขวง/ตำบล *"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>เขต/อำเภอ</Text>
            <TextInput
              value={district}
              onChangeText={setDistrict}
              placeholder="เขต/อำเภอ *"
              style={styles.input}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>จังหวัด</Text>
            <TextInput
              value={province}
              onChangeText={setProvince}
              placeholder="จังหวัด *"
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={handleSaveShop}>
          <Text style={styles.closeButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
    paddingTop: 60,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    fontSize: 18,
  },
  drawerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007bff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfWidth: {
    width: "48%",
  },
  closeButton: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
