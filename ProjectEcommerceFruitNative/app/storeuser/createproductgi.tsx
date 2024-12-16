import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { useStore } from "@/src/store/store";
import { router, useLocalSearchParams } from "expo-router";
import { Images, ProductGI } from "@/src/models/ProductGI";
import { htmlToText } from "html-to-text";
import { pathImagesApp } from "@/src/constants/RoutePath";
import { Badge, Icon, MD3Colors } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { observer } from "mobx-react-lite";
import MyEditor from "@/components/MyEditor";
import { Mytoast } from "@/components/MyToast";

const MyImages = ({ item, func }: { item: Images; func: any }) => {
  return (
    <View>
      <Badge
        style={{
          fontSize: 20,
        }}
        size={25}
        onPress={() =>
          Alert.alert("ลบรูปภาพนี้ออกจากฐานข้อมูล", "ยืนยันเพื่อลบ", [
            {
              text: "ยกเลิก",
              // onPress: () => console.log("cancel successfully"),
            },
            {
              text: "ยืนยัน",
              onPress: () => func(item.id),
            },
          ])
        }
      >
        {/* <Icon source="camera" color={MD3Colors.error50} size={20} /> */}X
      </Badge>
      <Image
        source={{
          uri: pathImagesApp.product_GI + item.imageName,
        }}
        style={styles.image}
      />
    </View>
  );
};

const MyImagesShow = ({
  itemName,
  func,
  i,
}: {
  itemName: string;
  func: any;
  i: number;
}) => {
  return (
    <View>
      <Badge
        style={{
          fontSize: 20,
        }}
        size={25}
        onPress={() =>
          Alert.alert("ลบรูปภาพ", "ยืนยันเพื่อลบ", [
            {
              text: "ยกเลิก",
              // onPress: () => console.log("cancel successfully"),
            },
            {
              text: "ยืนยัน",
              onPress: () => func(i),
            },
          ])
        }
      >
        {/* <Icon source="camera" color={MD3Colors.error50} size={20} /> */}X
      </Badge>
      <Image
        source={{
          uri: itemName || "",
        }}
        style={styles.image}
      />
    </View>
  );
};

interface sizeProps {
  smaller: string;
  small: string;
  normal: string;
  large: string;
  larger: string;
}

export const Label = ({
  name,
  valid,
  size = "small",
}: {
  name: string;
  valid: boolean;
  size?: keyof sizeProps;
}) => {
  const ConvertSize: any = {
    smaller: 15,
    small: 18,
    normal: 25,
    large: 35,
    larger: 50,
  };

  return (
    <Text style={{ fontSize: ConvertSize[size] }}>
      {name}{" "}
      {valid && (
        <Text
          style={{
            color: "red",
          }}
        >
          {" "}
          *
        </Text>
      )}
    </Text>
  );
};

export default observer(function CreateProductGI() {
  const { item }: any = useLocalSearchParams();

  let dataEdit: ProductGI = JSON.parse(item);

  const { category, removeImage, getProductGI, createUpdateProductGI } =
    useStore().productStore;

  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [selectCategory, setSelectCategory] = useState(0);

  const [imagesOldShow, setImagesOldShow] = useState<Images[] | []>();
  const [imagesShow, setImagesShow] = useState<string[] | null>([]);
  const [imagesSend, setImagesSend] = useState<any | null>(null);

  useEffect(() => {
    if (dataEdit.id !== undefined) {
      setName(dataEdit.name);
      setSelectCategory(dataEdit.category.id);
      setDescription(
        dataEdit.description
        // htmlToText()
        // "<p>กำลังปรับปรุง</p>"
        //   {
        //     wordwrap: false, // Optional: Prevents wrapping text
        //   }
        // )
      );

      setImagesOldShow(dataEdit.images);
    }
  }, []);

  useEffect(() => {}, [imagesShow, imagesSend]);

  const pickImage = async () => {
    if (
      imagesOldShow &&
      imagesShow &&
      imagesOldShow?.length + imagesShow?.length === 5
    ) {
      Alert.alert(
        "จำนวนรูปภาพของคุณเกินที่กำหนด",
        "จำนวนที่กำหนดคือ 5 รูปภาพ",
        [
          {
            text: "ตกลง",
          },
        ]
      );
      Mytoast("จำนวนที่กำหนดคือ 5 รูปภาพ");
    } else {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        allowsMultipleSelection: false,
        aspect: [4, 7],
        quality: 1,
      });

      if (!result.canceled) {
        setImagesShow((prev) => [...(prev || []), result.assets[0].uri]);

        let fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
        let fileUri = fileInfo.uri;
        let fileName = fileUri.split("/").pop();
        let fileType = "image/jpeg"; // ปรับปรุงประเภทไฟล์ตามความต้องการ

        setImagesSend((prev: any) => [
          ...(prev || []),
          {
            uri: fileUri,
            name: fileName,
            type: fileType,
          },
        ]);
      }
    }
  };

  const handleRemoveOldImages = async (id: number) => {
    removeImage(id).then(() => {
      setImagesOldShow(imagesOldShow?.filter((file: any) => file.id !== id));
      dataEdit = {
        ...dataEdit,
        images: dataEdit.images?.filter((file: any) => file.id !== id),
      };
    });
    await getProductGI(1);
  };

  const handleRemoveImageShow = async (indexToRemove: number) => {
    if (imagesShow !== null) {
      setImagesShow((prev) =>
        prev ? prev.filter((_, index) => index !== indexToRemove) : []
      );
    }

    setImagesSend((prev: any) =>
      prev ? prev.filter((_: any, index: any) => index !== indexToRemove) : []
    );
  };

  const handleSubmit = async () => {
    if (name && selectCategory) {
      const dataForm = {
        id: dataEdit?.id || 0,
        name: name,
        // description: description || "<p></p>",
        description: description || "<p></p>",
        categoryId: selectCategory,
      };

      await createUpdateProductGI(dataForm, imagesSend).then(async (result) => {
        if (!!result === true) {
          router.back();
          await getProductGI(1);
        } else {
          alert("เกิดข้อผิดพลาด");
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
        <Text style={styles.title}>สร้างข้อมูล GI</Text>
      </View>

      <Label name="ชื่อ" valid />
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="ชื่อ *"
        placeholderTextColor="#999"
      />

      <Label name="เลือกประเภท" valid />
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
        value={selectCategory}
        onValueChange={(value) => setSelectCategory(value)}
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
      {/* <Text style={{ fontSize: 16, fontWeight: "800" }}>Description</Text> */}

      {/* <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.textArea}
        placeholder="รายละเอียดสินค้า"
        placeholderTextColor="#999"
        multiline={true}
      /> */}

      <Label name="รายละเอียด" valid={false} />
      <MyEditor value={description} setValue={setDescription} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Label name="รูปภาพเพิ่มติม" valid={false} />
        <TouchableOpacity style={styles.uploadSection} onPress={pickImage}>
          <Text style={styles.uploadText}>กดเพื่ออัพโหลดรูปภาพ</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>อัพโหลด</Text>
          </TouchableOpacity>

          {imagesShow?.length !== 0 && (
            <FlatList
              style={{
                marginTop: 20,
              }}
              data={imagesShow}
              renderItem={({ item, index }: { item: any; index: number }) => (
                <MyImagesShow
                  itemName={item}
                  func={handleRemoveImageShow}
                  i={index}
                />
              )}
              keyExtractor={(_, i) => "item.id" + i}
              numColumns={4}
            />
          )}
        </TouchableOpacity>

        {imagesOldShow?.length !== 0 && (
          <FlatList
            data={imagesOldShow}
            renderItem={({ item }) => (
              <MyImages item={item} func={handleRemoveOldImages} />
            )}
            keyExtractor={(_, i) => "item.id" + i}
            numColumns={4}
          />
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.saveButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 5,
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
    // borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    height: 100,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: "top",
    color: "red",
    borderColor: "red",
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
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  richEditor: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  richToolbar: {
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});
