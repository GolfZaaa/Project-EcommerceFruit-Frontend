import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStore } from "@/src/store/store";
import { pathImagesApp } from "@/src/constants/RoutePath";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Product } from "@/src/models/Product";
dayjs.locale("th");

export default function StoreDetailsScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const navigation = useNavigation();
  const router = useRouter();

  const [numColumns, setNumColumns] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortName, setSortName] = useState("ทั้งหมด");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const {
    GetStoreDetailByUserId,
    shopProductDetail,
    GetStoreProductUser,
    shopProductUser,
  } = useStore().shopUserStore;

  const { getOrderByStore, order } = useStore().orderStore;

  const shopDetail = shopProductDetail?.[0];

  useEffect(() => {
    GetStoreDetailByUserId(id);
  }, []);

  useEffect(() => {
    getCategory();
    if (shopDetail) {
      getOrderByStore(shopDetail?.id);
      GetStoreProductUser(shopDetail?.userId);
    }
  }, [shopDetail]);

  const totalQuantity = order.reduce((total, currentOrder) => {
    const orderItemsQuantity = currentOrder.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    return total + orderItemsQuantity;
  }, 0);

  const OrderByStore = order.filter((x) => x.status === 1).length;

  const createdAt = dayjs(shopDetail?.createdAt);
  const timeAgo = createdAt ? createdAt.fromNow() : "N/A";

  const [selectedCategory, setSelectedCategory] = useState(0);

  const { category, getCategory, getProductById } =
    useStore().productStore;

  const categories = [
    {
      id: 0,
      name: "ทั้งหมด",
    },
    ...category,
  ];

  const { user } = useStore().userStore;

  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);

  const onSortChange = (value: "lowToHigh" | "highToLow" | "none") => {
    if (value === "lowToHigh") {
      setSortPrice("asc");
    } else if (value === "highToLow") {
      setSortPrice("desc");
    } else {
      setSortPrice(null);
    }
  };

  let filterProduct =
    selectedCategory === 0
      ? shopProductUser
      : shopProductUser.filter(
          (x) => x.productGI.category.id === selectedCategory
        );

  if (searchQuery) {
    filterProduct = filterProduct.filter((x) =>
      x.productGI.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortPrice === "asc") {
    filterProduct = [...filterProduct].sort((a, b) => a.price - b.price);
  } else if (sortPrice === "desc") {
    filterProduct = [...filterProduct].sort((a, b) => b.price - a.price);
  }

  const toggleColumns = () => {
    setNumColumns((prev) => (prev === 1 ? 2 : 1));
  };

  const renderProduct = (item: Product) => {
    return (
      <ProductCard
        numColumns={numColumns}
        onPress={() => {
          getProductById(item.id).then(() => {
            router.push({
              pathname: "/productdetail",
              params: { id: item.id.toString() },
            });
          });
        }}
      >
        <ProductImage source={{ uri: pathImagesApp.product + item.images }} />
        <ProductName>{item.productGI.name}</ProductName>
        <ProductPrice>{item.price} บาท</ProductPrice>
        {user?.id !== undefined &&
          user?.id === item?.productGI?.store?.user?.id && (
            <Badge>
              <BadgeText>สินค้าของคุณ</BadgeText>
            </Badge>
          )}
      </ProductCard>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView>
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: "#cccccc",
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 25,
            }}
          >
            <Image
              source={require("../assets/images/IconShop.png")}
              style={{
                width: 50,
                height: 50,
                borderRadius: 30,
                borderWidth: 2,
                borderColor: "#cccccc",
                overflow: "hidden",
                marginRight: 10,
              }}
            />
            <View>
              <Text style={styles.largeText}>{shopDetail?.name}</Text>
              <Text style={styles.subtitle}>
                สร้างโดย : {shopDetail?.user.fullName}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <View style={styles.infoRow}>
              <Text style={styles.highlightText}>
                {shopProductUser.length} รายการ
              </Text>
              <Text style={styles.infoText}>รายการสินค้า</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.highlightText}>
                {totalQuantity.toLocaleString()} ชิ้น
              </Text>
              <Text style={styles.infoText}>จำนวนสินค้าที่ขายแล้ว</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.highlightText}>{OrderByStore} รายการ</Text>
              <Text style={styles.infoText}>ยอดสั่งซื้อ</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {shopProductDetail
              ?.filter((store: any) =>
                store.user.address.some((address: any) => address.isUsed_Store)
              )
              .map((store: any, _) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {store.user.address
                    .filter((address: any) => address.isUsed_Store)
                    .map((address: any, i: any) => (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View style={styles.infoRow}>
                          <Text style={styles.highlightText}>{timeAgo}</Text>
                          <Text style={styles.infoText}>
                            วันที่สร้างร้านค้า
                          </Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Text style={styles.highlightText}>
                            {address.detail}
                          </Text>
                          <Text style={styles.infoText}>บ้านเลขที่</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Text style={styles.highlightText}>
                            {address.subDistrict} {address.district}{" "}
                            {address.province}
                          </Text>
                          <Text style={styles.infoText}>
                            ตำบล อำเภอ จังหวัด
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              ))}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาชื่อสินค้า..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <View style={styles.filterContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={
                selectedCategory === cat.id
                  ? styles.selectedCategory
                  : styles.categoryButton
              }
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={
                  selectedCategory === cat.id
                    ? styles.selectedCategoryText
                    : styles.categoryText
                }
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Header>
            <IconButton onPress={() => setFilterModalVisible(true)}>
              <Ionicons name="filter-outline" size={24} color="#333" />
            </IconButton>
            <Text>{sortName}</Text>
            <IconButton onPress={toggleColumns}>
              <Ionicons
                name={numColumns === 1 ? "grid-outline" : "list-outline"}
                size={24}
                color="#333"
              />
            </IconButton>
          </Header>

        <FlatList
          data={filterProduct}
          keyExtractor={(item) => item.productGI.name + item.id}
          renderItem={({ item }) => renderProduct(item)}
          numColumns={numColumns}
          key={numColumns}
        />

        <Modal
            animationType="fade"
            transparent={true}
            visible={filterModalVisible}
            onRequestClose={() => setFilterModalVisible(false)}
          >
            <TouchableWithoutFeedback
              onPress={() => setFilterModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    width: "70%",
                    backgroundColor: "white",
                    borderRadius: 15,
                    padding: 20,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      marginBottom: 20,
                      color: "#333",
                    }}
                  >
                    ตัวกรองสินค้า
                  </Text>

                  <TouchableWithoutFeedback
                    onPress={() => setFilterModalVisible(false)}
                  >
                    <View
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 5,
                      }}
                    >
                      <FontAwesome name="times" size={25} color="#F44336" />
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      marginBottom: 15,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome
                      name="sort-amount-asc"
                      size={20}
                      color="#4CAF50"
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={
                        sortPrice === "asc"
                          ? styles.selectedSortButton
                          : styles.sortButton
                      }
                      onPress={() => {onSortChange("lowToHigh");setSortName("เรียงจากน้อยไปมาก");setFilterModalVisible(false)}}
                    >
                      เรียงจากน้อยไปมาก
                    </Text>
                  </View>

                  <View
                    style={{
                      marginBottom: 15,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome
                      name="sort-amount-desc"
                      size={20}
                      color="#2196F3"
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={
                        sortPrice === "desc"
                          ? styles.selectedSortButton
                          : styles.sortButton
                      }
                      onPress={() => {onSortChange("highToLow");setSortName("เรียงจากมากไปน้อย");setFilterModalVisible(false)}}
                    >
                      เรียงจากมากไปน้อย
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSection: {
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  largeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 17,
    color: "#555",
  },
  rightSection: {
    flex: 1,
    marginLeft: 16,
  },
  infoRow: {
    marginBottom: 8,
    marginRight: 25,
    alignItems: "center",
  },
  highlightText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
  searchInput: {
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // marginVertical: 10,
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  categoryButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  selectedCategory: {
    backgroundColor: "#ffaa00",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  categoryText: {
    color: "#000",
    fontSize: 14,
  },
  sortButton: {
    color:'#fff',
    padding: 10,
    backgroundColor: "#f70000",
    margin: 5,
    fontSize:20,
  },
  selectedCategoryText: {
    color: "#fff",
    fontSize: 14,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  selectedSortButton: {
    color:'#fff',
    padding: 10,
    backgroundColor: "#4CAF50",
    margin: 5,
    fontSize:20,
  },
  sortButtonText: {
    color: "#000",
    fontSize: 14,
  },
  selectedSortButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});


const ProductCard: any = styled(TouchableOpacity)<{ numColumns: number }>`
  background-color: #ffffff;
  border-radius: 15px;
  margin: 10px;
  padding: 10px;
  flex: ${(props) => (props.numColumns === 1 ? "1 0 100%" : "1")};
  elevation: 2;
  position: relative;
`;

const ProductImage: any = styled(Image)`
  width: 100%;
  height: 150px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ProductName: any = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const ProductPrice: any = styled.Text`
  font-size: 14px;
  color: #e74c3c;
  font-weight: bold;
  margin-top: 5px;
`;

const Badge: any = styled(LinearGradient).attrs({
  colors: ["#ff6f00", "#ff8f00"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  position: absolute;
  top: 20px;
  left: 0px;
  padding: 5px 10px;
  border-radius: 5px;
`;

const BadgeText: any = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;

const Header: any = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const IconButton: any = styled.TouchableOpacity`
  padding: 10px;
`;