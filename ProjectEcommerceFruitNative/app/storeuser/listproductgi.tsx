import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useStore } from "@/src/store/store";
import { ProductGI } from "@/src/models/ProductGI";
import { pathImagesApp } from "@/src/constants/RoutePath";
import { observer } from "mobx-react-lite";
import { TotalText } from "../order/TabOrder.screen";
import { Mytoast } from "@/components/MyToast";

const data = [
  {
    id: "34",
    name: "TASDASD",
    category: "TTT",
    price: "$10.99",
    specialTag: "Test Specialtage",
    image: "https://example.com/image1.jpg",
  },
  {
    id: "33",
    name: "TTT",
    category: "Dessert",
    price: "$10.99",
    specialTag: "Test Specialtage",
    image: "https://example.com/image2.jpg",
  },
  {
    id: "32",
    name: "XZCZXC",
    category: "Appetizer",
    price: "$50",
    specialTag: "Test Specialtage",
    image: "https://example.com/image3.jpg",
  },
  {
    id: "31",
    name: "ASDSADSA",
    category: "Appetizer",
    price: "$11",
    specialTag: "Test Specialtage",
    image: "https://example.com/image4.jpg",
  },
];

const ListProduct = () => {
  const navigation = useNavigation();

  const { productGI, getCategory, removeProductGI, loadingPGI, getProductGI } =
    useStore().productStore;

  useEffect(() => {
    onGetProductGI();
  }, []);

  const onGetProductGI = async () => {
    await getProductGI(1);
  };

  const handleCreateProductGi = async (item: ProductGI | []) => {
    await getCategory();
    router.push({
      pathname: "../storeuser/createproductgi",
      params: {
        item: JSON.stringify(item),
      },
    });
  };

  const handleRemoveProductGI = async (id: number) => {
    Alert.alert("ลบข้อมูลสินค้านี้ออกจากฐานข้อมูล", "ยืนยันเพื่อลบ", [
      {
        text: "ยกเลิก",
        // onPress: () => console.log("cancel successfully"),
      },
      {
        text: "ยืนยัน",
        onPress: async () =>
          await removeProductGI(id).then((res) => {
            // console.log("res as : ", res);
            if (res !== true) {
              Alert.alert("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาด", [
                {
                  text: "ตกลง",
                },
              ]);
              Mytoast("เกิดข้อผิดพลาด");
            }
          }),
      },
    ]);
  };

  const renderItem = ({ item }: { item: ProductGI }) => (
    <View style={styles.card}>
      {item.images.length > 0 && (
        <Image
          source={{ uri: pathImagesApp.product_GI + item.images[0]?.imageName }}
          style={styles.image}
        />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.name}>ชื่อ: {item.name}</Text>
        <Text style={styles.category}>ประเภท: {item.category.name}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleCreateProductGi(item)}
          >
            <Ionicons name="pencil-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveProductGI(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <Text style={styles.title}>เพิ่มข้อมูล (GI) สินค้า</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleCreateProductGi([])}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>


      <FlatList
        data={productGI}
        keyExtractor={(item) => item.name + item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TotalText
              style={{
                fontSize: 30,
              }}
            >
              ไม่พบข้อมูลสินค้า (GI)
            </TotalText>
          </View>
        }
      />
    </View>
  );
};

export default observer(ListProduct);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",

  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  addButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 50,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: -80,
    marginLeft:-10,
    color: "#007bff",
  },
  listContainer: {
    padding: 10,
    paddingTop: 110,
    flexGrow: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: 80,
    height: 87,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  category: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
  },
});
