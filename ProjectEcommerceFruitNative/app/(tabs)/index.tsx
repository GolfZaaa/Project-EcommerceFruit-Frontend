import React, { useEffect, useState } from "react";
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

export default observer(function HomeScreen() {
  const {
    product,
    getProduct,
    category,
    getCategory,
    getFilterProduct,
    getProductById,
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

  // const products = [
  //   {
  //     id: "1",
  //     name: "เงาะ",
  //     price: "200฿",
  //     image:
  //       "https://hdmall.co.th/blog/wp-content/uploads/2024/04/%E0%B9%80%E0%B8%87%E0%B8%B2%E0%B8%B0-Rambutan-scaled.jpg",
  //     isNew: true,
  //     category: "ผลไม้",
  //   },
  //   {
  //     id: "2",
  //     name: "ทุเรียน",
  //     price: "500฿",
  //     image:
  //       "https://s.isanook.com/wo/0/ud/50/250005/250005-thumbnail.jpg?ip/crop/w670h402/q80/jpg",
  //     isSale: true,
  //     category: "ผลไม้",
  //   },
  //   {
  //     id: "3",
  //     name: "มังคุด",
  //     price: "50฿",
  //     image: "https://medthai.com/wp-content/uploads/2013/07/Mangosteen-1.jpg",
  //     category: "ผลไม้",
  //   },
  //   {
  //     id: "4",
  //     name: "ส้ม",
  //     price: "40฿",
  //     image:
  //       "https://image.makewebeasy.net/makeweb/m_1920x0/qeb9oj2Lg/Ingradian/shutterstock_2053015835.jpg?v=202012190947",
  //     category: "ผลไม้",
  //   },
  // ];

  // const categories = ["ทั้งหมด", "ผลไม้สด", "ผลไม้สำเร็จรูป"];

  const categories = [
    {
      id: 0,
      name: "ทั้งหมด",
    },
    ...category,
  ];

  const onSearchProduct = (text: string) => {
    const queryParams = new URLSearchParams({
      productName: text || "",
      categoryId: selectedCategory.toString(),
      sortPrice: sortPrice.toString(),
    });

    getFilterProduct(queryParams);
  };

  const onFilterProduct = () => {
    const queryParams = new URLSearchParams({
      productName: searchQuery || "",
      categoryId: selectedCategory.toString(),
      sortPrice: sortPrice.toString(),
    });
    getFilterProduct(queryParams);
  };

  useEffect(() => {
    onFilterProduct();
    getCategory();
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
      <HeaderText>รายการสินค้า</HeaderText>

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
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
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
        </View>
      </Modal>
    </Container>
  );
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
