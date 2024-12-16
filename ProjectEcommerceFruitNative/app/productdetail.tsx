import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  TouchableWithoutFeedback,
  Alert,
  Image,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useStore } from "@/src/store/store";
import { pathImagesApp } from "@/src/constants/RoutePath";
import RenderHTML from "react-native-render-html";
import { htmlToText } from "html-to-text";
import { useNavigation } from "@react-navigation/native";
import { Entypo, FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mytoast } from "@/components/MyToast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import { Product } from "@/src/models/Product";
import AntDesign from '@expo/vector-icons/AntDesign';
dayjs.locale("th");

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const {
    productDetail,
    getProductById,
    addStockProduct,
    isUsedProduct,
    getProduct,
    product,
  } = useStore().productStore;
  const { AddToCart, setselectMyCart } = useStore().cartStore;
  const { user } = useStore().userStore;

  const params = useLocalSearchParams();
  const { id } = params;

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const {
    GetStoreProductUser,
    shopProductUser,
    shopProductDetail,
    GetStoreDetailByUserId,
  } = useStore().shopUserStore;

  const { getOrderByStore, order } = useStore().orderStore;

  const getProductCheck = async () => {
    await getProductById(id);
  };

  useEffect(() => {
    const getProduct = async () => {
      await getProductById(id);
    };
    getProduct();
    getProductCheck();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          GetStoreDetailByUserId(productDetail?.productGI.store.userId),
          GetStoreProductUser(productDetail?.productGI.store.userId),
          productDetail?.productGI.store.id &&
            getOrderByStore(productDetail?.productGI.store.id),
        ]);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    if (productDetail?.productGI.store?.userId) {
      fetchData();
    }
  }, []);

  const OrderByStore = order.filter((x) => x.status === 1).length;

  dayjs.extend(relativeTime);

  const createdAt = dayjs(shopProductDetail?.[0]?.createdAt);
  const timeAgo = createdAt.isValid() ? createdAt.fromNow() : "N/A";

  const [preViewImage, setPreViewImage] = useState<any>(null);

  const myProduct =
    user?.id !== undefined &&
    user?.id === productDetail?.productGI?.store?.user?.id;

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const plainText = htmlToText(
    productDetail?.productGI.description || "<p></p>",
    {
      wordwrap: false,
    }
  );

  const onAddtoCart = () => {
    if (!!user) {
      AddToCart({
        ProductId: productDetail?.id,
        Quantity: quantity,
      });
      setselectMyCart([]);
      showToastWithGravityAndOffset();
    } else {
      Alert.alert(
        "เกิดข้อผิดพลาด",
        "กรุณาเข้าสู่ระบบก่อนทำการเพิ่มสินค้าลงตะกร้า",
        [
          {
            text: "ตกลง",
          },
        ]
      );
      Mytoast("กรุณาเข้าสู่ระบบก่อนทำการเพิ่มสินค้าลงตะกร้า");
    }
  };

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      "เพิ่มสินค้าลงตะกร้าสำเร็จ!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  const totalQuantity = order.reduce((total, currentOrder) => {
    const orderItemsQuantity = currentOrder.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    return total + orderItemsQuantity;
  }, 0);

  const [addquantity, setAddQuantity] = useState<any>();
  const [resetQuantity, setResetQuantity] = useState<any>();
  const [openModel, setopenModel] = useState(false);

  const handlemodel = async (product: any) => {
    await getProductById(product.id);
    setAddQuantity(productDetail?.quantity);
    setResetQuantity(productDetail?.quantity);
    setopenModel(true);
  };

  const handleResetQuantity = async () => {
    setAddQuantity(resetQuantity);
  };

  const handleIncrease = () => {
    setAddQuantity((prevQuantity: any) => prevQuantity + 1);
  };

  const handleAddQuantity = async (product: Product) => {
    const productId = product.id;
    const quantity = addquantity;
    await addStockProduct({ productId, quantity });
    await getProductById(productId);
    setopenModel(false);
  };

  const isOutOfStock = productDetail?.quantity === 0;
  const isClosed = productDetail?.status;

  const handleClose = async (productId: any) => {
    try {
      setLoading(true);
      await isUsedProduct(productId);
      await getProductById(productId);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
    getProduct(0);
  };

  const RecommendProducts = shopProductUser.filter(
    (x) =>
      x.id !== productDetail?.id &&
      x.hidden !== true &&
      x.status === true &&
      x.productGI.store.hidden !== true
  );

  const [visibleCount, setVisibleCount] = useState(5);

  const loadMore = () => {
    setVisibleCount((x) => x + 4);
  };

  const filteredProducts = product.filter(
    (x) =>
      x.quantity > 0 &&
      x.status === true &&
      x.productGI.store.hidden != true &&
      x.id != productDetail?.id &&
      x.productGI.category.name === productDetail?.productGI.category.name &&
      x.productGI.store.userId != user?.id
  );


  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={handleBack}
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 1,
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <View
        style={{
          position: "absolute",
          top: 680,
          zIndex: 1,
          backgroundColor: "#ffffff",
          width: "100%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderWidth: 1,
        }}
      >
        {!myProduct && (
          <QuantityContainer>
            <QuantityButton onPress={decreaseQuantity}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 24,
                  width: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                -
              </Text>
            </QuantityButton>
            <QuantityText>{quantity}</QuantityText>
            <QuantityButton onPress={increaseQuantity}>
              <Text style={{ color: "#fff", fontSize: 24 }}>+</Text>
            </QuantityButton>
          </QuantityContainer>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: myProduct ? "#ffffff" : "#ff6f61",
            padding: 15,
            alignItems: "center",
            height: myProduct ? 300 : 300,
            borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderWidth: myProduct ? 0 : 0,
          }}
          activeOpacity={myProduct ? 1 : 0}
          onPress={() => !myProduct && onAddtoCart()}
        >
           {myProduct && (
    // <Entypo name="warning" size={70} color="red" style={{marginBottom:10}} />
    <FontAwesome6 name="shop" size={60} color="#06fc6c" style={{marginBottom:10}} />
  )}
  {myProduct ? (
    <ButtonTextWarning>
      นี่คือสินค้าในร้านของคุณ
  </ButtonTextWarning>
  ):(
    <ButtonText>เพิ่มในตะกร้า {quantity}
          </ButtonText>
  )}
        </TouchableOpacity>

      </View>

      <ScrollView>
        <View >
          <Container>
            {user && user?.id == productDetail?.productGI?.store?.userId && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginBottom:-40
                }}
              >
                <View></View>
                <View>
                  <TouchableOpacity
                    style={styles.buttonAdd}
                    onPress={handlemodel}
                  >
                    <AntDesign
                      name="plus"
                      size={20}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.buttonTextAdd}>เพิ่มสินค้า</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      isOutOfStock
                        ? styles.outOfStock
                        : isClosed
                        ? styles.closed
                        : styles.open,
                    ]}
                    onPress={() => handleClose(productDetail.id)}
                    disabled={isOutOfStock}
                  >
                    <View style={styles.iconTextContainer}>
                      {isOutOfStock ? (
                        <Ionicons
                          name="close-circle-outline"
                          size={20}
                          style={styles.icon}
                        />
                      ) : isClosed ? (
                        <Ionicons
                          name="eye-off-outline"
                          size={20}
                          style={styles.icon}
                        />
                      ) : (
                        <Ionicons
                          name="eye-outline"
                          size={20}
                          style={styles.icon}
                        />
                      )}

                      <Text style={styles.text}>
                        {isOutOfStock
                          ? "สินค้าหมด"
                          : isClosed
                          ? "ปิดการขาย"
                          : "เปิดการขาย"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Modal
              animationType="fade"
              transparent={true}
              visible={openModel}
              onRequestClose={() => setopenModel(false)}
            >
              <TouchableWithoutFeedback onPress={() => setopenModel(false)}>
                <View style={styles.overlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.title}>รายละเอียดสินค้า</Text>

                    <View style={styles.row}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>ชื่อสินค้า</Text>
                        <TextInput
                          style={styles.input}
                          value={productDetail?.productGI?.name}
                          editable={false}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>ราคา</Text>
                        <TextInput
                          style={styles.input}
                          value={productDetail?.price?.toString() || ""}
                          editable={false}
                        />
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>จำนวนสินค้า</Text>
                        <View style={styles.quantityContainer}>
                          <TouchableOpacity
                            style={styles.decrementButton}
                            onPress={handleResetQuantity}
                          >
                            <Text style={styles.buttonText}>⟳</Text>
                          </TouchableOpacity>
                          <TextInput
                            style={styles.quantityInput}
                            value={addquantity?.toLocaleString()}
                            editable={false}
                          />
                          <TouchableOpacity
                            style={styles.incrementButton}
                            onPress={handleIncrease}
                          >
                            <Text style={styles.buttonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>ประเภท</Text>
                        <TextInput
                          style={styles.input}
                          value={productDetail?.productGI.category.name}
                          editable={false}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>รายละเอียด</Text>
                      <TextInput
                        style={[styles.input, { height: 80, width: 270 }]}
                        value={productDetail?.detail.replace(
                          /<\/?[^>]+(>|$)/g,
                          ""
                        )}
                        editable={false}
                        multiline={true}
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() =>
                        productDetail && handleAddQuantity(productDetail)
                      }
                    >
                      <Text style={styles.addButtonText}>+ เพิ่มสินค้า</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <ProductImage
              source={{
                uri: !!preViewImage
                  ? preViewImage
                  : pathImagesApp.product + productDetail?.images,
              }}
            />

            <ScrollView
              horizontal
              style={{
                flexDirection: "row",
              }}
            >
              {productDetail?.productGI.images.map((item, i) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    setPreViewImage(
                      preViewImage === pathImagesApp.product_GI + item.imageName
                        ? pathImagesApp.product + productDetail?.images
                        : pathImagesApp.product_GI + item.imageName
                    )
                  }
                >
                  <ProductImages
                    isMarginRight={
                      productDetail?.productGI.images.length === i + 1
                    }
                    isImageMain={
                      preViewImage === pathImagesApp.product_GI + item.imageName
                    }
                    source={{
                      uri: pathImagesApp.product_GI + item.imageName,
                    }}
                  />
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>

            <ProductTitleCategory>
              {productDetail?.productGI?.category?.name}
            </ProductTitleCategory>
            <ProductTitle>{productDetail?.productGI.name}</ProductTitle>

            <ProductPrice>฿ {productDetail?.price}</ProductPrice>

            <ProductInfo>
              <InfoText>ขายแล้ว: {productDetail?.sold} ชิ้น</InfoText>
              <InfoText>ราคาต่อกิโลกรัม: {productDetail?.price} บาท</InfoText>
              <InfoText>คงเหลือ: {productDetail?.quantity} ชิ้น</InfoText>
            </ProductInfo>

            <ProductDescription>{plainText}</ProductDescription>
          </Container>

          <View
            style={{
              width: "100%",
              height: 110,
              backgroundColor: "#fefefe",
              borderColor: "#eeeeee",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              marginBottom: 10,
            }}
          >
            <Container>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../assets/images/IconShop.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 30,
                      borderWidth: 2,
                      borderColor: "#cccccc",
                      overflow: "hidden",
                    }}
                  />

                  <View style={{ paddingLeft: 10 }}>
                    <Text
                      style={{ marginBottom: 5, fontSize: 17, fontWeight: 600 }}
                    >
                      {productDetail?.productGI.store.name}
                    </Text>
                    <Text style={{ fontSize: 15 }}>
                      สร้างเมื่อ {loading ? "กำลังโหลด" : timeAgo}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    const result = productDetail?.productGI.store.userId;
                    if (result) {
                      (navigation as any).navigate("storedetail", {
                        id: String(shopProductDetail),
                      });
                    } else {
                      Alert.alert("เกิดข้อผิดพลาด", "ไม่พบข้อมูล userId");
                    }
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#cccccc",
                      borderRadius: 8,
                      height: 40,
                      backgroundColor: "#ff1b1b",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 15,
                    }}
                  >
                    <Text style={{ padding: 5, color: "#fff" }}>ดูร้านค้า</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginTop: 10,
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      paddingRight: 5,
                      fontWeight: 800,
                      color: "#e07f00",
                      fontSize: 16,
                    }}
                  >
                    {shopProductUser.length.toLocaleString()}
                  </Text>
                  <Text>รายการสินค้า</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      paddingRight: 5,
                      fontWeight: 800,
                      color: "#e07f00",
                      fontSize: 16,
                    }}
                  >
                    {OrderByStore.toLocaleString()}
                  </Text>
                  <Text>ยอดสั่งซื้อ</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      paddingRight: 5,
                      fontWeight: 800,
                      color: "#e07f00",
                      fontSize: 16,
                    }}
                  >
                    {totalQuantity.toLocaleString()}
                  </Text>
                  <Text>สินค้าที่ขายแล้ว</Text>
                </View>
              </View>
            </Container>
          </View>

          {RecommendProducts.length > 0 && (
            <View style={{ backgroundColor: "#fff", marginTop: -10,marginBottom:RecommendProducts.length > 0 ? 0 : 0 }}>
              <View style={styles.container}>
                <View style={{ marginBottom: 10, marginTop: 20 }}>
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={styles.titleRecomment}>
                    สินค้าจากร้านเดียวกัน
                  </Text>

                  <TouchableOpacity 
                  onPress={() => {
                    const result = productDetail?.productGI.store.userId;
                    if (result) {
                      (navigation as any).navigate("storedetail", {
                        id: String(shopProductDetail),
                      });
                    } else {
                      Alert.alert("เกิดข้อผิดพลาด", "ไม่พบข้อมูล userId");
                    }
                  }}
                  >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.titleRecommentTwo}>ดูทั้งหมด</Text>
                    <MaterialIcons 
                      name="navigate-next" 
                      size={24} 
                      color="#e08e00" 
                      style={{ position: "relative", top: 18 }}
                    />
                  </View>
                  </TouchableOpacity>


                  </View>
                  <View style={styles.underline} />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer}
                >
                  {RecommendProducts.map((product) => (
                    <TouchableOpacity
                      onPress={() => {
                        getProductById(product.id).then(() => {
                          router.push({
                            pathname: "/productdetail",
                            params: { id: product.id.toString() },
                          });
                        });
                      }}
                    >
                      <View key={product.id} style={styles.card}>
                      <ProductImageTwo
                        source={{
                          uri: !!preViewImage
                            ? preViewImage
                            : pathImagesApp.product + product?.images,
                        }}
                      />
                        <Text style={styles.productName}>
                          {product.productGI.name}
                        </Text>
                        <Text style={styles.productPrice}>
                          ราคา: {product.price} บาท
                        </Text>
                        {/* <Text style={styles.productWeight}>
            น้ำหนัก: {product.weight} กิโลกรัม
          </Text> */}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {filteredProducts.length > 0 && (
            <View style={{ backgroundColor: "#fff", marginTop: -10,marginBottom:150}}>
              <View style={styles.container}>
                <View style={{ marginBottom: 10, marginTop: 20 }}>
                  <Text style={styles.titleRecomment}>สินค้าที่คล้ายกัน</Text>
                  <View style={styles.underlineTwo} />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer}
                >
                  {filteredProducts.slice(0, visibleCount).map((product) => (
                    <TouchableOpacity
                      onPress={() => {
                        getProductById(product.id).then(() => {
                          router.push({
                            pathname: "/productdetail",
                            params: { id: product.id.toString() },
                          });
                        });
                      }}
                    >
                      <View key={product.id} style={styles.card}>
                      <ProductImageThere
                        source={{
                          uri: !!preViewImage
                            ? preViewImage
                            : pathImagesApp.product + product?.images,
                        }}
                      />

                        <Text style={styles.productName}>
                          {product.productGI.name}
                        </Text>
                        <Text style={styles.productPrice}>
                          ราคา: {product.price} บาท
                        </Text>
                        {/* <Text style={styles.productWeight}>
                      น้ำหนัก: {product.weight} กิโลกรัม
                    </Text> */}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonAdd: {
    backgroundColor: "#38a169",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginRight: -60,
    alignContent: "center",
  },
  buttonTextAdd: {
    color: "#ffffff",
    fontWeight: "bold",
    fontFamily: "FontPublic",
  },
  buttonClose: {
    backgroundColor: "#ff1111",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonTextClose: {
    color: "#ffffff",
    fontWeight: "bold",
    fontFamily: "FontPublic",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#e9ecef",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  decrementButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  incrementButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    width: 50,
    height: 40,
    backgroundColor: "#e9ecef",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 100,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  outOfStock: {
    backgroundColor: "#d3d3d3",
  },
  closed: {
    backgroundColor: "#f87171",
  },
  open: {
    backgroundColor: "#34d399",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
    color: "#000000",
  },
  text: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    margin: 10,
  },
  titleRecomment: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  titleRecommentTwo: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    color:'#e08e00'
  },
  underline: {
    height: 2,
    backgroundColor: "#000",
    marginTop: 5,
    width: 180,
  },
  underlineTwo: {
    height: 2,
    backgroundColor: "#000",
    marginTop: 5,
    width: 140,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  card: {
    width: 200,
    padding: 20,
    marginRight: 15,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  productWeight: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
});

const Container: any = styled(LinearGradient).attrs({
  colors: ["#F7F9FC", "#F7F9FC"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
`;

const ProductImage: any = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 20px;
  margin-bottom: 20px;
  margin-top: 70px;
`;

const ProductImageTwo: any = styled.Image`
  width: 160;
  height: 80px;
  margin-bottom: 10;
`;

const ProductImageThere: any = styled.Image`
  width: 160;
  height: 80px;
  margin-bottom: 10;
`;

const ProductImages: any = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 20px;
  margin-right: ${(prop: any) => (prop.isMarginRight ? "0" : "20px")};
  border-width: 2px;
  border-color: ${(prop: any) => (prop.isImageMain ? "red" : "white")};
`;

const ProductTitle: any = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const ProductTitleCategory: any = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #8c8c8c;
`;

const ProductPrice: any = styled.Text`
  font-size: 22px;
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ProductDescription: any = styled.Text`
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
  line-height: 24px;
`;

const ProductInfo: any = styled.View`
  margin-bottom: 20px;
`;

const InfoText: any = styled.Text`
  font-size: 16px;
  color: #555;
  margin-bottom: 5px;
`;

const QuantityContainer: any = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const QuantityButton: any = styled.TouchableOpacity`
  background-color: #ff6f61;
  padding: 10px 20px;
  border-radius: 30px;
  margin-top: 20px;
`;


const QuantityText: any = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin: 0 20px -20px;
`;


const ButtonText: any = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const ButtonTextWarning: any = styled.Text`
  color: #7c7c7c;
  font-size: 26px;
  font-weight: bold;
`;