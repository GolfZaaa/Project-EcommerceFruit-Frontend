import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useStore } from "@/src/store/store";
import { observer } from "mobx-react-lite";
import { port } from "@/src/api/agent";
import { Product } from "@/src/models/Product";
import { pathImagesApp } from "@/src/constants/RoutePath";
const { width } = Dimensions.get("window");

export default observer(function homeScreen() {
  const {
    product,
    getProduct,
    category,
    getCategory,
    getProductById,
    getFilterProduct,
  } = useStore().productStore;
  const { user } = useStore().userStore;
  const { GetCartItemByUserOrderStore } = useStore().cartStore;
  const router = useRouter();
  const [numColumns, setNumColumns] = useState(2);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sortPrice, setSortPrice] = useState(0); //sortPrice 1 === เรียงจากน้อยไปมาก, 2 === เรียงจากมากไปน้อย
  const [sortName, setSortName] = useState("ทั้งหมด");

  const categories = [
    {
      id: 0,
      name: "ทั้งหมด",
    },
    ...category,
  ];
  const handleProfile = async () => {
    router.push("/(tabs)/setting");
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,  // Add this line
      }).start(() => setIsDrawerOpen(false));
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(true));
    }
  };
  


  const onSearchProduct = (text: string) => {
    const queryParams = new URLSearchParams({
      productName: text || "",
      categoryId: selectedCategory.toString(),
      sortPrice: sortPrice.toString(),

    });
    getFilterProduct(queryParams);
  };

      // categoryId: selectedCategory.toString(),
  const onFilterProduct = () => {
    const queryParams = new URLSearchParams({
      productName: searchQuery || "",
      sortPrice: sortPrice.toString(),
    });
    getFilterProduct(queryParams);
  };

  useEffect(() => {
    getCategory();
    onFilterProduct();
  }, []);

  useEffect(() => {
    onFilterProduct();
  }, [sortPrice, selectedCategory, searchQuery]);

  const toggleColumns = () => {
    setNumColumns((prev) => (prev === 1 ? 2 : 1));
  };

  // console.log("userId", user?.id);

  const renderProduct = (item: Product) => {
    // console.log("item", item?.productGI);

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
        // onPress={() => router.push("/productdetail")}
      >
        <ProductImage source={{ uri: pathImagesApp.product + item.images }} />
        <ProductName>{item.productGI.name}</ProductName>
        <ProductPrice>{item.price}</ProductPrice>
        {user?.id !== undefined &&
          user?.id === item?.productGI?.store?.user?.id && (
            <Badge>
              <BadgeText>สินค้าของคุณ</BadgeText>
            </Badge>
          )}
      </ProductCard>
    );
  };

  const onSelectCate = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  return (
    <Container>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Ionicons name="menu-outline" size={30} color="#333" />
        </TouchableOpacity>

        <Text style={styles.textNavbar}>ข้อมูลสินค้า</Text>
        <TouchableOpacity onPress={handleProfile}>
          <Image
            source={{
              uri: "https://s359.kapook.com/r/600/auto/pagebuilder/9efc1817-eca5-4a83-9fee-8222ba8fcc55.jpg",
            }}
            style={styles.circleImage}
          />
        </TouchableOpacity>
      </View>

      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.drawerTitle}>เมนูเพิ่มเติม</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="cart-outline" size={30} color="#333" />
          <Text style={styles.menuText}>แก้ไขร้านค้า</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="people-outline" size={30} color="#333" />
          <Text style={styles.menuText}>เพิ่มข้อมูลสินค้า (GI)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="people-outline" size={30} color="#333" />
          <Text style={styles.menuText}>เพิ่มสินค้า</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="people-outline" size={30} color="#333" />
          <Text style={styles.menuText}>รายการคำสั่งซื้อ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={toggleDrawer}>
          <Text style={styles.closeButtonText}>ปิด</Text>
        </TouchableOpacity>
      </Animated.View>

      <View>
        <SearchContainer>
        <Ionicons name="search-outline" size={20} color="#333" />
        <SearchInput
          placeholder="ค้นหาสินค้า"
          value={searchQuery}
          onChangeText={(text: string) => {
            setSearchQuery(text);

            onSearchProduct(text);
          }}
        />
      </SearchContainer>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          height: 60,
        }}
      >
        {categories.map((category) => {
          return (
            <CategoryButton
              key={category.id}
              selected={selectedCategory === category.id}
              onPress={() => onSelectCate(category.id)}
            >
              <CategoryButtonText selected={selectedCategory === category.id}>
                {category.name}
              </CategoryButtonText>
            </CategoryButton>
          );
        })}
      </ScrollView>

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
        data={product}
        keyExtractor={(item) => item.productGI.name + item.id}
        renderItem={({ item }) => renderProduct(item)}
        numColumns={numColumns}
        key={numColumns}
        style={{
          minHeight: 460,
        }}
      />

        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              ฟิลเตอร์สินค้า
            </Text>
            <Text
              style={{
                fontSize: 15,
                marginBottom: 20,
              }}
            >
              ฟิลเตอร์สินค้า
            </Text>
            <View
              style={{
                marginBottom: 10,
              }}
            >
              <Button
                title="เรียงจากน้อยไปมาก"
                onPress={() => {
                  setSortPrice(1);
                  setFilterModalVisible(false);
                  setSortName("เรียงจากน้อยไปมาก");
                }}
                color={"green"}
              />
            </View>
            <View
              style={{
                marginBottom: 10,
              }}
            >
              <Button
                title="เรียงจากมากไปน้อย"
                onPress={() => {
                  setSortPrice(2);
                  setFilterModalVisible(false);
                  setSortName("เรียงจากมากไปน้อย");
                }}
              />
            </View>
            <View
              style={{
                marginBottom: 10,
              }}
            >
              <Button
                title="ฟิลเตอร์ตามหมวดหมู่"
                onPress={() => alert("ฟิลเตอร์ตามหมวดหมู่")}
                color={"orange"}
              />
            </View>
            <View
              style={{
                marginBottom: 10,
              }}
            >
              <Button
                title="ปิด"
                onPress={() => setFilterModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </Modal>
      </View>
    </Container>
  );
});

const styles = StyleSheet.create({
  navbar: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: -15,
    marginBottom: 20,
  },
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textNavbar: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "#fff",
    padding: 20,
    elevation: 5,
    zIndex: 2,
    paddingTop: 60,
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
});

const Container: any = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #f8f9fa;
  padding-top: 60px;
`;

const Header: any = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const HeaderText: any = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  padding-left: 10px;
`;

const IconButton: any = styled.TouchableOpacity`
  padding: 10px;
`;

const SearchContainer: any = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 5px 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
`;

const SearchInput: any = styled.TextInput`
  flex: 1;
  padding: 10px;
  font-size: 16px;
`;

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

const CategoryButton: any = styled(TouchableOpacity)`
  background-color: ${(props: any) => (props.selected ? "#ff6f00" : "#ddd")};
  padding: 10px 15px;
  border-radius: 20px;
  margin-right: 10px;
`;

const CategoryButtonText: any = styled.Text`
  color: ${(props: any) => (props.selected ? "#fff" : "#333")};
  font-size: 14px;
`;
