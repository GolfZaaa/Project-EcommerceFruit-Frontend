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
import { pathImagesApp } from "@/src/constants/RoutePath";
import { Product } from "@/src/models/Product";
import { observer } from "mobx-react-lite";
import { TotalText } from "../order/TabOrder.screen";
import { Mytoast } from "@/components/MyToast";
import { Switch } from "react-native-paper";

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
  const {
    productStore,
    getProductByStore,
    isUsedProduct,
    removeProduct,
    getProductGI,
    getFilterProduct,
  } = useStore().productStore;
  const { user } = useStore().userStore;

  const navigation = useNavigation();

  useEffect(() => {
    getProductByStore(user?.stores[0].id || 0);
  }, []);

  const handleCreateProduct = async (item: Product | []) => {
    await getProductGI(1);
    router.push({
      pathname: "../storeuser/createproduct",
      params: {
        item: JSON.stringify(item),
      },
    });
  };

  const onToggleSwitch = async (id: number) => {
    await isUsedProduct(id).then(async () => {
      getProductByStore(user?.stores[0].id || 0);

      await getFilterProduct(new URLSearchParams());
    });
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: pathImagesApp.product + item.images }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <View style={styles.namecateswitch}>
          <View>
            <Text style={styles.name}>ชื่อ : {item.productGI.name}</Text>
            <Text style={styles.category}>
              ประเภท: {item.productGI.category.name}
            </Text>
          </View>
          <View
            style={{
              top: -10,
              flexDirection: "row",
            }}
          >
            {/* <Text
              style={{
                top: 10,
                fontSize: 17,
              }}
            >
              สถานะ
            </Text> */}
            <Switch
              value={item.status}
              onValueChange={() => onToggleSwitch(item.id)}
            />
          </View>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleCreateProduct(item)}
          >
            <Ionicons name="pencil-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveProduct(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleRemoveProduct = (id: number) => {
    Alert.alert("ลบสินค้านี้ออกจากฐานข้อมูล", "ยืนยันเพื่อลบ", [
      {
        text: "ยกเลิก",
        // onPress: () => console.log("cancel successfully"),
      },
      {
        text: "ยืนยัน",
        onPress: async () =>
          await removeProduct(id).then((res) => {
            if (res !== true) {
              Alert.alert("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาด", [
                {
                  text: "ตกลง",
                },
              ]);
              Mytoast("เกิดข้อผิดพลาด");
            } else {
              getProductByStore(user?.stores[0].id || 0);
            }
          }),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleCreateProduct([])}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>เพิ่มข้อมูลสินค้า</Text>

      <FlatList
        data={productStore}
        keyExtractor={(item) => "item.id" + item.id}
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
              ไม่พบข้อมูลสินค้า
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
    height: 80,
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
  namecateswitch: {
    flexDirection: "row",
    justifyContent: "space-between",
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
