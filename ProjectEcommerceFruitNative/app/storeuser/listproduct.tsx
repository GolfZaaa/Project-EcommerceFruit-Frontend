import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

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

  const handleCreateProduct = () => {
    router.push("../storeuser/createproduct"); 
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>ชื่อ: {item.name}</Text>
        <Text style={styles.category}>ประเภท: {item.category}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleCreateProduct}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>เพิ่มข้อมูลสินค้า</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    position: "absolute",
    top: 40,
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
    marginTop: 60,
    marginBottom: -80,
    color: "#007bff",
  },
  listContainer: {
    padding: 10,
    paddingTop: 110,
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

export default ListProduct;
