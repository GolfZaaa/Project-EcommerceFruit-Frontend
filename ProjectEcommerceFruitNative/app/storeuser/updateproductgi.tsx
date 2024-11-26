import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { useStore } from "@/src/store/store";
import { ProductGI } from "@/src/models/ProductGI";
import { useLocalSearchParams } from "expo-router";

export default function UpdateProductGI() {
  const { item }: any = useLocalSearchParams();

  const dataEdit: ProductGI = JSON.parse(item);

  const { category } = useStore().productStore;

  const navigation = useNavigation();

  const [name, setName] = useState(dataEdit.name || "");
  const [selectCategory, setSelectCategory] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState();

  console.log("category", category);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <Text style={styles.title}>สร้างข้อมูล GI</Text>

      <TextInput
        style={styles.input}
        placeholder="ชื่อ *"
        placeholderTextColor="#999"
      />

      <RNPickerSelect
        style={{
          inputIOS: {
            ...styles.dropdown,
          },
          inputAndroid: {
            ...styles.dropdown,
          },
          viewContainer: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            marginBottom: 20,
          },
        }}
        placeholder={{
          label: "เลือกประเภท *",
          value: null,
          color: "#999",
        }}
        onValueChange={(value) => console.log(value)}
        // items={[
        //   { label: "ประเภท 1", value: "category1" },
        //   { label: "ประเภท 2", value: "category2" },
        //   { label: "ประเภท 3", value: "category3" },
        // ]}
        items={category.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
      />

      {/* Description Text Area */}
      <TextInput
        style={styles.textArea}
        placeholder="รายละเอียดสินค้า"
        placeholderTextColor="#999"
        multiline={true}
      />

      <View style={styles.uploadSection}>
        <Text style={styles.uploadText}>กดเพื่ออัพโหลดรูปภาพ</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>บันทึก</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    paddingTop: 40,
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
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    height: 100,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: "top",
  },
  uploadSection: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
