import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useStore } from "@/src/store/store";
import { pathImagesApp } from "@/src/constants/RoutePath";
import { observer } from "mobx-react-lite";
import { Checkbox, IconButton } from "react-native-paper";
import { LoginButton, SaveButtonText } from "./setting";
import { Product } from "@/src/models/Product";
import { Mytoast } from "@/components/MyToast";

export const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default observer(function CartScreen() {
  const {
    GetCartItemByUser,
    cartItems,
    GetCartItemByUserOrderStore,
    cartItemsStore,
    RemoveToCart,
    AddToCart,
    selectMyCart,
    setselectMyCart,
  } = useStore().cartStore;
  const { systemSetting } = useStore().systemSettingStore;
  const { user } = useStore().userStore;
  const { myAddressgotoOrder, getAddressgotoOrderByUserId } =
    useStore().addressStore;

  const [checkedItem, setCheckedItem] = useState<string | null>(null);

  const [totalPrice, setTotalPrice] = useState<string>("");
  const [formattedTotalPrice, setFormattedTotalPrice] = useState<string>("");

  // const [cartItems] = useState([
  //   {
  //     id: "1",
  //     name: "เงาะ",
  //     price: "200",
  //     image:
  //       "https://hdmall.co.th/blog/wp-content/uploads/2024/04/%E0%B9%80%E0%B8%87%E0%B8%B2%E0%B8%B0-Rambutan-scaled.jpg",
  //     quantity: 2,
  //   },
  //   {
  //     id: "2",
  //     name: "ทุเรียน",
  //     price: "500",
  //     image:
  //       "https://s.isanook.com/wo/0/ud/50/250005/250005-thumbnail.jpg?ip/crop/w670h402/q80/jpg",
  //     quantity: 1,
  //   },
  // ]);

  const calculateTotalPrice = () => {
    return selectMyCart.reduce((total, item: any) => {
      const storeTotal = item.products.reduce(
        (storeSum: number, product: any) => {
          return storeSum + product.quantityInCartItem * product.price;
        },
        0
      );
      return total + storeTotal;
    }, 0);
  };

  useEffect(() => {
    setTotalPrice(formatNumberWithCommas(calculateTotalPrice()));

    setFormattedTotalPrice(
      formatNumberWithCommas(
        calculateTotalPrice() + systemSetting[0]?.shippingCost
      )
    );

    if (selectMyCart.length === 0) {
      setCheckedItem(null);
    }
  }, [selectMyCart]);

  const handleCartDetail = async () => {
    if (selectMyCart.length === 0) {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณาเลือกร้านค้าที่ท่านจะซื้อก่อน", [
        {
          text: "ตกลง",
        },
      ]);
      Mytoast("กรุณาเลือกร้านค้าที่ท่านจะซื้อก่อน");
    } else {
      await getAddressgotoOrderByUserId().then((res) => {
        console.log("res", res);

        if (!!res) {
          router.push("/cartdetail");
        } else {
          router.push({
            pathname: "/editaddress",
            params: {
              title: "เพิ่มที่อยู่",
              data: JSON.stringify({ id: 0 }),
            },
          });
        }
      });
    }
  };

  const handleCheckboxChange = (items: any, storeName: string) => {
    setCheckedItem((prevCheckedItem) =>
      prevCheckedItem === storeName ? null : storeName
    );
    setselectMyCart(items);
  };

  const handleRemoveItem = async (item: any) => {
    const CartItemId = item.cartItemId;
    const Quantity = 1;

    await RemoveToCart({ CartItemId, Quantity });
    await GetCartItemByUser();
    await GetCartItemByUserOrderStore();

    // อัปเดตราคารวมใหม่หลังจากลบสินค้า
    const updatedSelectMyCart = selectMyCart.map((cartItem: any) => {
      if (cartItem.id === item.id) {
        const updatedProducts = cartItem.products.map((product: any) =>
          product.id === item.products[0].id
            ? { ...product, quantityInCartItem: product.quantityInCartItem - 1 }
            : product
        );
        return { ...cartItem, products: updatedProducts };
      }
      return cartItem;
    });

    // กรองสินค้าออกถ้าจำนวนสินค้าในตะกร้าเป็น 0
    const filteredCart = updatedSelectMyCart.filter((cartItem) =>
      cartItem.products.some((product: any) => product.quantityInCartItem > 0)
    );

    setselectMyCart(filteredCart);

    // คำนวณราคารวมใหม่
    const calculateTotalPrice = () => {
      return filteredCart.reduce((total, item: any) => {
        const storeTotal = item.products.reduce(
          (storeSum: number, product: any) => {
            return storeSum + product.quantityInCartItem * product.price;
          },
          0
        );
        return total + storeTotal;
      }, 0);
    };

    const totalPrice = calculateTotalPrice();
    setFormattedTotalPrice(formatNumberWithCommas(totalPrice));
  };

  const handleRemoveItemAll = async (item: any, Quantity: any) => {
    const CartItemId = item.cartItemId;
    await RemoveToCart({ CartItemId, Quantity });

    await GetCartItemByUser();
    await GetCartItemByUserOrderStore();
  };

  const handleAddItem = async (product: any) => {
    const ProductId = product.id;
    const Quantity = 1;
    await AddToCart({ ProductId, Quantity });
    if (checkedItem) {
      const updatedCart = selectMyCart.map((cartItem: any) => {
        if (cartItem.storeName === checkedItem) {
          const updatedProducts = cartItem.products.map((prod: any) => {
            return prod.id === ProductId &&
              product.quantityInCartItem < product.quantity
              ? { ...prod, quantityInCartItem: prod.quantityInCartItem + 1 }
              : prod;
          });
          return { ...cartItem, products: updatedProducts };
        }
        return cartItem;
      });

      const productInExistingCart = updatedCart.find((item) =>
        item.products.some((prod: any) => prod.id === ProductId)
      );
      if (!productInExistingCart) {
        updatedCart.push({
          id: `${Date.now()}`,
          storeName: checkedItem,
          productName: product.id,
          products: [{ ...product, quantityInCartItem: 1 }],
          cartItemId: null,
        });
      }

      setselectMyCart(updatedCart);
    }

    await GetCartItemByUser();
    await GetCartItemByUserOrderStore();
  };

  const RenderCartItem = ({ item }: any) => {
    return (
      <CartItem
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <ItemImage
          source={{ uri: pathImagesApp.product + `${item.products[0].images}` }}
          style={{ width: 100, height: 100, borderRadius: 8 }}
        />
        <ItemDetails style={{ flex: 1, marginLeft: 10 }}>
          <ItemName style={{ fontSize: 16, fontWeight: "bold" }}>
            {item.productName}
          </ItemName>
          <ItemPrice style={{ color: "#2ecc71", marginVertical: 5 }}>
            {item.products[0].price} ฿
          </ItemPrice>
          <QuantityControl
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <QuantityButton onPress={() => handleRemoveItem(item)}>
              <QuantityText>-</QuantityText>
            </QuantityButton>
            <Text style={{ fontSize: 18, marginHorizontal: 10 }}>
              {item.products[0].quantityInCartItem}
            </Text>
            <QuantityButton onPress={() => handleAddItem(item.products[0])}>
              <QuantityText>+</QuantityText>
            </QuantityButton>
          </QuantityControl>
        </ItemDetails>
        <RemoveButton
          onPress={() =>
            handleRemoveItemAll(item, item.products[0].quantityInCartItem)
          }
        >
          <Ionicons name="trash-bin-outline" size={24} color="#e74c3c" />
        </RemoveButton>
      </CartItem>
    );
  };

  const RenderShop = ({ storeName, products }: any) => {
    return (
      <CardStore>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 25,
              marginLeft: 25,
              marginTop: 10,
            }}
          >
            {storeName}
          </Text>
          {/* <ChackBox
            type="checkbox"
            className="mr-2"
            style={{
              width: 50,
              height: 50,
            }}
            checked={checkedItem === storeName}
            onChange={() => handleCheckboxChange(products, storeName)}
          /> */}
          {/* 
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
          /> */}
          <IconButton
            icon={
              checkedItem === storeName
                ? "checkbox-marked"
                : "checkbox-blank-outline"
            }
            size={50} // Set custom size
            onPress={() => handleCheckboxChange(products, storeName)}
          />
        </View>

        <FlatList
          data={products}
          keyExtractor={(product) => product.id}
          renderItem={RenderCartItem}
        />
      </CardStore>
    );
  };

  // const totalAmount = selectMyCart.reduce((total, store: any) => {
  //   const storeTotal = store.products.reduce(
  //     (storeSum: any, product: any) =>
  //       storeSum + parseInt(product.price) * product.quantityInCartItem,
  //     0
  //   );

  //   return total + storeTotal;
  // }, 0);

  const groupedCartItems: Record<string, any> = cartItemsStore.reduce(
    (acc: Record<string, any>, item: any) => {
      if (!acc[item.storeName]) {
        acc[item.storeName] = [];
      }
      acc[item.storeName].push(item);
      return acc;
    },
    {}
  );

  return !!user ? (
    <CartContainer>
      <Header>
        <Ionicons name="cart-outline" size={28} color="#fff" />
        <HeaderTitle>ตะกร้าสินค้า</HeaderTitle>
      </Header>

      {cartItemsStore.length ? (
        <FlatList
          data={Object.entries(groupedCartItems)} // [['Store A', [product1, product2]], ...]
          keyExtractor={([storeName], index) => storeName + index}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item: [storeName, products] }) => (
            <RenderShop storeName={storeName} products={products} />
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TotalText>ไม่มีสินค้าในตะกร้า</TotalText>
        </View>
      )}

      <TotalContainer>
        <TotalRow>
          <TotalText>ยอดรวมสินค้า</TotalText>
          <TotalAmount>{!checkedItem ? 0 : totalPrice} ฿</TotalAmount>
        </TotalRow>
        <TotalRow>
          <TotalText>ค่าจัดส่ง</TotalText>
          <TotalAmount>{systemSetting[0]?.shippingCost} ฿</TotalAmount>
        </TotalRow>
        <TotalRow>
          <TotalText style={{ fontWeight: "bold", fontSize: 22 }}>
            ยอดรวมสุทธิ
          </TotalText>
          <TotalAmount style={{ fontWeight: "bold", fontSize: 22 }}>
            {!checkedItem ? 0 : formattedTotalPrice} ฿
          </TotalAmount>
        </TotalRow>
        <CheckoutButton
          onPress={() =>
            cartItemsStore.length ? handleCartDetail() : router.push("/")
          }
        >
          <CheckoutButtonText>
            {cartItemsStore.length ? "ชำระเงิน" : "ซื้อสินค้าเลย!"}
          </CheckoutButtonText>
        </CheckoutButton>
      </TotalContainer>
    </CartContainer>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <LoginButton onPress={() => router.push("/login")}>
        <SaveButtonText>เข้าสู่ระบบ</SaveButtonText>
      </LoginButton>
    </View>
  );
});

const CartContainer = styled.View`
  flex: 1;
  background-color: #f4f6ff;
`;
//background-color: #f8f9fa;

const Header = styled.View`
  padding: 25px;
  background-color: #ff8c00;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  elevation: 5;
`;

const HeaderTitle = styled.Text`
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  margin-left: 10px;
`;

const CartItem = styled.View`
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  margin: 15px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

const CardStore = styled.View`
  background-color: #ffffff;
  border-radius: 15px;
  margin: 15px 20px;
`;

const ItemImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 10px;
`;

const ItemDetails = styled.View`
  flex: 1;
  padding-left: 20px;
`;

const ItemName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const ItemPrice = styled.Text`
  font-size: 16px;
  color: #e74c3c;
  font-weight: bold;
  margin-top: 5px;
`;

const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 10px;
`;

const QuantityButton = styled.TouchableOpacity`
  background-color: #ff8c00;
  padding: 5px 12px;
  border-radius: 5px;
  margin: 0 8px;
  elevation: 3;
`;

const QuantityText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const TotalContainer = styled.View`
  background-color: #fff;
  padding: 25px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  elevation: 10;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const TotalText = styled.Text`
  font-size: 20px;
  color: #333;
`;

const TotalAmount = styled.Text`
  font-size: 20px;
  color: #333;
  font-weight: bold;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: #ff8c00;
  padding: 10px;
  border-radius: 15px;
  align-items: center;
  margin-top: 20px;
`;

const CheckoutButtonText = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

const ChackBox: any = styled.TextInput`
  flex: 1;
  padding: 10px;
  font-size: 16px;
`;
