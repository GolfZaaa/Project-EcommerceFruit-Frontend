import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useStore } from "@/src/store/store";
import { observer } from "mobx-react-lite";
import { Mytoast } from "@/components/MyToast";
import { router } from "expo-router";
import Editaddress from "../editaddress";
import { Label } from "./createproductgi";
import mockAddress from "../../assets/json/new_data.json";
import SelectDropdown from "react-native-select-dropdown";
import { ExternalRenderItem } from "../addresslist";
import { Address } from "@/src/models/Address";

const BackButton: any = styled.TouchableOpacity`
  position: absolute;
  top: 30px;
  left: 20px;
  z-index: 1;
  padding: 10px;
`;

export default observer(function EditName() {
  const { usershop, createandupdate } = useStore().shopUserStore;
  const {
    address: addresss,
    createUpdateAddress,
    getAddressByUserId,
    myAddress,
  } = useStore().addressStore;
  const { getUserDetailbyId, user } = useStore().userStore;

  const [name, setName] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [address, setAddress] = useState<string | undefined>("");
  const [postalCode, setPostalCode] = useState<string | undefined>("");
  const [subDistrict, setSubDistrict] = useState<string | undefined>("");
  const [district, setDistrict] = useState<string | undefined>("");
  const [province, setProvince] = useState<string | undefined>("");

  const [addressId, setAddressId] = useState<number | null | undefined>(0);

  const [openModel, setopenModel] = useState(false);

  const [data, setData]: any = useState([]);
  const [dataSelect, setdataSelect]: any = useState([]);

  // สร้าง state สำรอง
  const [backupState, setBackupState] = useState<any>({
    postCode: "",
    subDistrict: "",
    district: "",
    province: "",
  });

  const navigation = useNavigation();

  useEffect(() => {
    setName(usershop?.name || "");
    setDescription(usershop?.description || "");
    setAddress(addresss?.detail);

    setPostalCode(!!addresss?.postCode ? addresss?.postCode : "");
    setSubDistrict(!!addresss?.subDistrict ? addresss?.subDistrict : "");
    setDistrict(!!addresss?.district ? addresss?.district : "");
    setProvince(!!addresss?.province ? addresss?.province : "");
    setdataSelect({
      district: addresss?.district,
      province: addresss?.province,
      subDistrict: addresss?.subDistrict,
      zipCode: addresss?.postCode,
    });
  }, []);

  const handleSaveShop = async () => {
    if (
      name !== "" &&
      description !== "" &&
      subDistrict !== "" &&
      district !== "" &&
      province !== "" &&
      postalCode !== "" &&
      address !== ""
    ) {
      const dataForm = {
        id: usershop?.id || 0,
        name: name,
        description: description,
      };

      await createandupdate(dataForm).then(async (res) => {
        if (res) {
          const dataAddress = {
            id: addressId || addresss?.id,
            subDistrict: subDistrict,
            district: district,
            province: province,
            postCode: postalCode,
            detail: address,
            isUsed_Store: true,
            isUsed: false,
            gps: "",
          };

          console.log("dataAddress", dataAddress);

          await createUpdateAddress(dataAddress);
          Mytoast("ลงทะเบียนร้านค้าสำเร็จ");
          getUserDetailbyId();

          router.back();
        }
      });
    } else {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน", [
        {
          text: "ตกลง",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
      Mytoast("กรุณากรอกข้อมูลให้ครบถ้วน");
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
    searchByZipCode(Number(postalCode));
  }, [postalCode]);

  const handleEditAddress = () => {
    const item = {
      id: addresss?.id,
      detail: address,
      postCode: postalCode,
      subDistrict: subDistrict,
      district: district,
      province: province,
    };

    router.push({
      pathname: "/editaddress",
      params: {
        title: "แก้ไขที่อยู่ร้านค้า",
        data: JSON.stringify(item),
        setting: JSON.stringify(true),
        isStore: JSON.stringify(true),
      },
    });
  };

  const handleOpenModal = () => {
    setBackupState({
      postCode: postalCode,
      subDistrict: subDistrict,
      district: district,
      province: province,
    });
    setopenModel(true);
  };

  const handleCloseModal = (isConfirmed: boolean) => {
    if (!isConfirmed) {
      setdataSelect({
        district: backupState?.district,
        province: backupState?.province,
        subDistrict: backupState?.subDistrict,
        zipCode: backupState?.postCode,
      });
      setPostalCode(backupState.postCode);
      setSubDistrict(backupState.subDistrict);
      setDistrict(backupState.district);
      setProvince(backupState.province);
    }
    setopenModel(false);
  };

  const handleChangesModal = (item?: Address | null, isConfirmed = false) => {
    getAddressByUserId();

    if (isConfirmed && item) {
      setdataSelect({
        district: item?.district,
        province: item?.province,
        subDistrict: item?.subDistrict,
        zipCode: item?.postCode,
      });
      setAddressId(item?.id);
      setAddress(item?.detail);
      setPostalCode(item?.postCode);
      setSubDistrict(item?.subDistrict);
      setDistrict(item?.district);
      setProvince(item?.province);
    } else {
      // ถ้าผู้ใช้ไม่ยืนยัน ให้คืนค่าเดิม
      handleCloseModal(false);
    }
    setopenModel(!openModel);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={openModel}
        // visible={true}
        onRequestClose={() => {
          handleCloseModal(false);
          handleChangesModal(null, false);
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* ครึ่งบนสำหรับปิด Modal */}
          <TouchableWithoutFeedback
            onPress={() => {
              handleCloseModal(false);
              handleChangesModal(null, false);
              setopenModel(false);
            }}
          >
            <View
              style={{
                height: 300, // ครึ่งหน้าจอ
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                แตะที่นี่เพื่อออก
              </Text>
            </View>
          </TouchableWithoutFeedback>

          {/* ครึ่งล่างสำหรับแสดงข้อมูล */}
          <View
            style={{
              height: "100%", // ครึ่งหน้าจอ
              backgroundColor: "white",
              padding: 16,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View>
              {myAddress?.length ? (
                <View>
                  {myAddress?.map((item, index) => (
                    <ExternalRenderItem
                      handleChangesModal={handleChangesModal}
                      key={index}
                      item={item}
                      i={index}
                    />
                  ))}
                </View>
              ) : (
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
              )}
            </View>
          </View>
        </ScrollView>
      </Modal>

      <View style={styles.container}>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="#007bff" />
        </BackButton>
        <Text style={styles.drawerTitle}>แก้ไขข้อมูลร้านค้า</Text>

        <View style={styles.inputGroup}>
          <Label name="ชื่อร้านค้า" valid />
          {/* <Text style={styles.label}>ชื่อร้านค้า</Text> */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="ชื่อร้านค้า *"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Label name="รายละเอียด" valid />
          {/* <Text style={styles.label}>รายละเอียด</Text> */}
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="รายละเอียด *"
            style={styles.input}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.closeButton,
            // {
            //   backgroundColor: "yellow",
            //   borderWidth: 1,
            //   borderColor: "black",
            // },
          ]}
          onPress={() => {
            handleOpenModal();
            handleChangesModal(null, false);
          }}
        >
          <Text
            style={[
              styles.closeButtonText,
              // { color: "black" }
            ]}
          >
            เลือกจากที่อยู่ของฉัน
          </Text>
        </TouchableOpacity>

        <View>
          <Label name="บ้านเลขที่, หมู่, ซอย, ถนน" valid />
          <TextInput
            style={styles.input}
            placeholder="บ้านเลขที่, หมู่, ซอย, ถนน *"
            value={address}
            onChangeText={setAddress}
          />

          <Label name="รหัสไปรษณีย์" valid />
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TextInput
              style={[styles.input, data.length ? {} : { width: "100%" }]}
              placeholder="รหัสไปรษณีย์"
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="numeric"
              maxLength={5}
            />

            {data.length ? (
              <SelectDropdown
                data={data}
                onSelect={(selectedItem, index) => {
                  // console.log("selectedItem", selectedItem);
                  setdataSelect(selectedItem);

                  // setPostalCode(selectedItem?.postCode);
                  setSubDistrict(selectedItem?.subDistrict);
                  setDistrict(selectedItem?.district);
                  setProvince(selectedItem?.province);
                  // setdataSelect({
                  //   district: addresss?.district,
                  //   province: addresss?.province,
                  //   subDistrict: addresss?.subDistrict,
                  //   zipCode: addresss?.postCode,
                  // });
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

          <Label name="แขวง/ตำบล" valid />
          <TextInput
            style={styles.input}
            placeholder="แขวง/ตำบล"
            value={dataSelect ? dataSelect.subDistrict : ""}
            // onChangeText={setSubDistrict}
            readOnly
          />

          <Label name="เขต/อำเภอ" valid />
          <TextInput
            style={styles.input}
            placeholder="เขต/อำเภอ"
            value={dataSelect ? dataSelect.district : ""}
            // onChangeText={setDistrict}
            readOnly
          />

          <Label name="จังหวัด" valid />
          <TextInput
            style={styles.input}
            placeholder="จังหวัด"
            value={dataSelect ? dataSelect.province : ""}
            // onChangeText={setProvince}
            readOnly
          />
        </View>

        {/* 
        <Text style={styles.sectionTitle}>
          ที่อยู่ร้านค้า{" "}
          <Text
            style={{
              color: "red",
            }}
          >
            *กดปุ่มแก้ไขที่อยู่ร้านค้า
          </Text>
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.labelAdr}>บ้านเลขที่, หมู่, ซอย, ถนน</Text>
          <TextInput
            value={addresss?.detail || address}
            onChangeText={setAddress}
            placeholder="บ้านเลขที่, หมู่, ซอย, ถนน *"
            style={styles.input}
            readOnly
          />
        </View>

        <View style={styles.addressRow}>
          <View style={styles.halfWidth}>
            <Text style={styles.labelAdr}>รหัสไปรษณีย์</Text>
            <TextInput
              value={addresss?.postCode || postalCode}
              onChangeText={setPostalCode}
              placeholder="รหัสไปรษณีย์ *"
              style={styles.input}
              readOnly
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.labelAdr}>แขวง/ตำบล</Text>
            <TextInput
              value={addresss?.subDistrict || subDistrict}
              onChangeText={setSubDistrict}
              placeholder="แขวง/ตำบล *"
              style={styles.input}
              readOnly
            />
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={styles.halfWidth}>
            <Text style={styles.labelAdr}>เขต/อำเภอ</Text>
            <TextInput
              value={addresss?.district || district}
              onChangeText={setDistrict}
              placeholder="เขต/อำเภอ *"
              style={styles.input}
              readOnly
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.labelAdr}>จังหวัด</Text>
            <TextInput
              value={addresss?.province || province}
              onChangeText={setProvince}
              placeholder="จังหวัด *"
              style={styles.input}
              readOnly
            />
          </View>
        </View> */}

        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleEditAddress}
          >
            <Text style={styles.closeButtonText}>แก้ไขที่อยู่ร้านค้า</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: "yellow",
                borderWidth: 1,
                borderColor: "black",
              },
            ]}
            // onPress={handleEditAddress}
          >
            <Text style={[styles.closeButtonText, { color: "black" }]}>
              เลือกที่อยู่ของฉัน
            </Text>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveShop}>
          <Text style={styles.closeButtonText}>บันทึกข้อมูลร้านค้า</Text>
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
    paddingTop: 25,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  drawerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#007bff",
    textAlign: "center",
    marginTop: 10,
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
  labelAdr: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "gray",
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
  },
  saveButton: {
    padding: 15,
    backgroundColor: "green",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownButtonStyle: {
    width: 218,
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
