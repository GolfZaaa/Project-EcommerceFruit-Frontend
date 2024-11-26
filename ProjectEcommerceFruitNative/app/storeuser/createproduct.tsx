import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { router, useLocalSearchParams } from "expo-router";
import { Product } from "@/src/models/Product";
import { useStore } from "@/src/store/store";
import { observer } from "mobx-react-lite";
import { Badge } from "react-native-paper";
import { pathImagesApp } from "@/src/constants/RoutePath";
import { Images } from "@/src/models/ProductGI";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Label } from "./createproductgi";
import MyEditor from "@/components/MyEditor";
import { Mytoast } from "@/components/MyToast";

const MyImages = ({ imageName }: { imageName: string }) => {
  return (
    <Image
      source={{
        uri: pathImagesApp.product + imageName,
      }}
      style={styles.image}
    />
  );
};

const MyImagesShow = ({ imageName }: { imageName: string }) => {
  return (
    <Image
      source={{
        uri: imageName || "",
      }}
      style={styles.image}
    />
  );
};

export default observer(function CreateProduct() {
  const navigation = useNavigation();

  const { item }: any = useLocalSearchParams();

  let dataEdit: Product = JSON.parse(item);

  const { productGI, createUpdateProduct, getProductByStore } =
    useStore().productStore;
  const { user } = useStore().userStore;

  const [productGIId, setProductGIId] = useState(0);
  const [weight, setWeight] = useState(1);
  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  const [imagesOldShow, setImagesOldShow] = useState<string | null>(null);
  const [imagesShow, setImagesShow] = useState<string | null>(null);
  const [imagesSend, setImagesSend] = useState<any | null>(null);

  useEffect(() => {
    if (dataEdit.id !== undefined) {
      setProductGIId(dataEdit.productGIId);
      setWeight(dataEdit.weight);
      setPrice(dataEdit.price);
      setQuantity(dataEdit.quantity);
      setDescription(dataEdit.detail);

      setImagesOldShow(dataEdit.images);
    }
  }, []);

  const handleChangeImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      allowsMultipleSelection: false,
      aspect: [4, 7],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImagesShow(result.assets[0].uri);

      let fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
      let fileUri = fileInfo.uri;
      let fileName = fileUri.split("/").pop();
      let fileType = "image/jpeg"; // ปรับปรุงประเภทไฟล์ตามความต้องการ

      setImagesSend({
        uri: fileUri,
        name: fileName,
        type: fileType,
      });
    }
  };

  const handleSubmit = async () => {
    if (imagesSend && weight && quantity && price && productGIId) {
      const dataForm = {
        id: dataEdit?.id || 0,
        images: imagesSend || null,
        weight: weight,
        quantity: quantity,
        price: price,
        detail: description || "<p></p>",
        productGIId: productGIId,
      };

      await createUpdateProduct(dataForm).then((result) => {
        console.log("result", result);

        if (!!result === true) {
          getProductByStore(user?.stores[0].id || 0);
          router.back();
        }
      });
    } else {
      Alert.alert("เกิดข้อผิดพลาด", "กรอกข้อมูลไม่ครบถ้วน", [
        {
          text: "ตกลง",
        },
      ]);
      Mytoast("กรอกข้อมูลไม่ครบถ้วน");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>สร้างข้อมูลสินค้า</Text>
      </View>

      <Label name="ข้อมูลผลไม้ (GI)" valid />
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
          label: "ข้อมูลผลไม้ (GI) *",
          value: null,
          color: "#999",
        }}
        value={productGIId}
        onValueChange={(value) => setProductGIId(value)}
        items={
          productGI.map((item) => ({
            label: item.name,
            value: item.id,
          }))
          //   [
          //   { label: "ประเภท 1", value: "category1" },
          //   { label: "ประเภท 2", value: "category2" },
          //   { label: "ประเภท 3", value: "category3" },
          // ]
        }
      />

      <Label name="ราคา" valid />
      <TextInput
        value={String(price)}
        onChangeText={(value) => setPrice(Number(value === "" ? 1 : value))}
        style={styles.input}
        placeholder="ราคา *"
        placeholderTextColor="#999"
      />

      <Label name="น้ำหนัก" valid />
      <TextInput
        value={String(weight)}
        onChangeText={(value) => setWeight(Number(value === "" ? 1 : value))}
        keyboardType="numeric"
        style={styles.input}
        placeholder="น้ำหนัก *"
        placeholderTextColor="#999"
      />

      <Label name="จำนวน" valid />
      <TextInput
        value={String(quantity)}
        onChangeText={(value) => setQuantity(Number(value === "" ? 1 : value))}
        style={styles.input}
        placeholder="จำนวน *"
        placeholderTextColor="#999"
      />

      {/* <Label name="รายละเอียดสินค้า" valid />
      <TextInput
        value={description}
        onChangeText={(value) => setDescription(value)}
        style={styles.textArea}
        placeholder="รายละเอียดสินค้า"
        placeholderTextColor="#999"
        multiline={true}
      /> */}

      <Label name="รายละเอียด" valid={false} />
      <MyEditor value={description} setValue={setDescription} />

      <Label name="รูปภาพสินค้า" valid />
      <TouchableOpacity
        style={styles.uploadSection}
        onPress={handleChangeImage}
      >
        {imagesShow ? (
          <MyImagesShow imageName={imagesShow} />
        ) : imagesOldShow ? (
          <MyImages imageName={imagesOldShow} />
        ) : (
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text style={styles.uploadText}>ลากและวางไฟล์ที่นี่หรือคลิก</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleChangeImage}
            >
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>บันทึก</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
    color: "red",
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
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
});
