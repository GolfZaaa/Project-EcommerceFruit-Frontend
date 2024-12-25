import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
  ScrollView,
  Modal,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useStore } from "@/src/store/store";
import { observer } from "mobx-react-lite";
import { ActivityIndicator, Divider } from "react-native-paper";
import { DesLogin, LoginButton, SaveButtonText, TitleLogin } from "./setting";
import { Title } from "../editaddress";
import { pathImagesApp } from "@/src/constants/RoutePath";
import { SafeAreaView } from "react-native-safe-area-context";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment";
import "moment/locale/th";
import dayjs from "dayjs";
import "dayjs/locale/th";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { BarChart, PieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default observer(function ShopScreen() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalOrderSuccess, setTotalOrderSuccess] = useState(0);
  const [totalOrderFailed, setTotalOrderFailed] = useState(0);
  const [yearOptions, setYearOptions] = useState([]);
  const [monthlyOrderData, setMonthlyOrderData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [loading, setLoading] = useState(true);

  const { GetShopByUserId, usershop } = useStore().shopUserStore;
  const { GetAddressByStore } = useStore().addressStore;
  const { getProductGI, getProductByStore } = useStore().productStore;
  const { user } = useStore().userStore;
  const { getOrderByStore, order } = useStore().orderStore;
  const { systemSetting } = useStore().systemSettingStore;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const ShopUserId: any = usershop?.id;

  const [loadingGraph, setloadingGraph] = useState(false);
  const [loadingGetShopByUserId, setloadingetShopByUserId] = useState(false);
  const [loadingGetAddressByStore, setloadingGetAddressByStore] =
    useState(false);

  const CheckGetShopByUserId = () => {
    GetShopByUserId();
    setloadingetShopByUserId(true);
  };

  const CheckGetAddressByStore = () => {
    GetAddressByStore();
    setloadingGetAddressByStore(true);
  };

  useEffect(() => {
    CheckGetShopByUserId();
    CheckGetAddressByStore();
  }, []);

  useEffect(() => {
    if (!loadingGetAddressByStore && !loadingGetShopByUserId) {
      setloadingGraph(true);
    }
  }, [loadingGetAddressByStore, loadingGetShopByUserId]);

  useEffect(() => {
    getOrderByStore(ShopUserId);
  }, [usershop]);

  useEffect(() => {
    if (order) {
      const total = order
        .filter((x) => x.status === 1 && x.confirmReceipt === 1)
        .reduce((acc, currentOrder) => {
          const orderTotal = currentOrder.orderItems.reduce(
            (itemAcc, orderItem) =>
              itemAcc + orderItem.quantity * orderItem.product.price,
            0
          );
          return acc + orderTotal;
        }, 0);
      setTotalPrice(total);
    }

    const totalProduct = order
      .filter((x) => x.status === 1 && x.confirmReceipt === 1)
      .reduce((acc, currentOrder) => {
        const orderQuantity = currentOrder.orderItems.reduce(
          (itemAcc, orderItem) => itemAcc + orderItem.quantity,
          0
        );
        return acc + orderQuantity;
      }, 0);
    setTotalQuantity(totalProduct);

    const totalOrderSuccess = order
      .filter((x) => x.confirmReceipt === 1)
      .reduce((acc, currentOrder) => {
        return currentOrder.status === 1 ? acc + 1 : acc;
      }, 0);
    setTotalOrderSuccess(totalOrderSuccess);

    const totalOrderFailed = order
    .filter((x) => x.confirmReceipt === 1)
    .reduce((acc, currentOrder) => {
      return currentOrder.status === 2 || currentOrder.status === 5 ? acc + 1 : acc;
    }, 0);
  setTotalOrderFailed(totalOrderFailed);


    const ordersByMonth = order
      .filter((x) => x.status === 1 && x.confirmReceipt === 1)
      .reduce((acc: any, currentOrder) => {
        const orderYear = moment(currentOrder.createdAt).year();
        if (orderYear !== selectedYear) return acc;

        const month = moment(currentOrder.createdAt).format("MMMM");
        const year = dayjs(currentOrder.createdAt).year() + 543;
        const orderTotal = currentOrder.orderItems.reduce(
          (itemAcc, orderItem) =>
            itemAcc + orderItem.quantity * orderItem.product.price,
          0
        );

        if (!acc[month]) {
          acc[month] = 0;
        }

        acc[month] += orderTotal;

        return acc;
      }, {});

    const monthlyData: any = Object.entries(ordersByMonth).map(
      ([month, total]) => ({
        month,
        total,
      })
    );

    monthlyData.sort(
      (a: any, b: any) =>
        moment().month(a.month).valueOf() - moment().month(b.month).valueOf()
    );

    setMonthlyOrderData(monthlyData);
  }, [order, selectedYear]);

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false));
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(true));
    }
  };

  console.log("monthlyOrderData",monthlyOrderData)

  const handleEditStoreName = async () => {
    await GetShopByUserId();
    await GetAddressByStore();
    toggleDrawer()
    router.push("../storeuser/editname");
  };

  const handleListproductgi = async () => {
    await getProductGI(1);
    toggleDrawer()
    router.push("../storeuser/listproductgi");
  };

  const handleListproduct = () => {
    getProductByStore(user?.stores[0].id || 0);
    toggleDrawer()
    router.push("../storeuser/listproduct");
  };

  const handleOrderHistoryStore = () => {
    getOrderByStore(user?.stores[0].id || 0);
    toggleDrawer()
    router.push("../storeuser/orderhistorystore");
  };

  const backgroundImage = {
    uri: pathImagesApp.image_web + systemSetting[0].image,
  };

  const thaiMonthShort = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const chartData = {
    labels: monthlyOrderData.map((data: any) => {
      const monthIndex = moment(data.month, "MMMM").month();
      return thaiMonthShort[monthIndex];
    }),
    datasets: [
      {
        data: monthlyOrderData.map((data: any) => data.total),
      },
    ],
  };

  const [years, setYears] = useState([]);

  useEffect(() => {
    if (order && order.length > 0) {
      const years: any = [
        ...new Set(order.filter(x=>x.status === 1 && x.confirmReceipt === 1).map((o) => new Date(o.createdAt).getFullYear())),
      ].sort((a, b) => a - b);
      setYears(years);
      setSelectedYear(years[0]);
    }
  }, [order]);

  const [modalVisible, setModalVisible] = useState(false);

  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const categoryQuantities: any = {};
    order
      .filter((x) => x.status === 1 && x.confirmReceipt === 1)
      .forEach((orderItem) => {
        orderItem.orderItems.forEach((item) => {
          const categoryName = item.product?.productGI?.category?.name;
          if (!categoryQuantities[categoryName]) {
            categoryQuantities[categoryName] = 0;
          }
          categoryQuantities[categoryName] += item.quantity;
        });
      });

    const predefinedColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];

    const formattedData: any = Object.keys(categoryQuantities).map(
      (categoryName, i) => ({
        name: categoryName,
        value: categoryQuantities[categoryName],
        color: predefinedColors[i % predefinedColors.length],
        legendFontColor: "#505050",
        legendFontSize: 13,
      })
    );
    setPieChartData(formattedData);
  }, [order]);

  const handleShop = async () => {
    toggleDrawer()
    router.push("/(tabs)/shop");
  };

  const screenWidth = Dimensions.get("window").width;

  return !user?.stores?.length ? (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundUnlogin}
      resizeMode="cover"
    >
      <View style={styles.containerUnlogin}>
        <TitleLogin>คุณไม่ได้ลงทะเบียนร้านค้า</TitleLogin>
        <LoginButton onPress={() => router.push("/storeuser/editname")}>
          <SaveButtonText>ลงทะเบียนร้านค้าเลย!</SaveButtonText>
        </LoginButton>
      </View>
    </ImageBackground>
  ) : (
    <View style={styles.container}>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 5,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity onPress={toggleDrawer}>
          <Ionicons name="menu-outline" size={30} color="#333" />
        </TouchableOpacity>

        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          สรุปข้อมูลร้านค้า
        </Text>
        <View></View>
      </View>

      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={[
              styles.drawerTitle,
              {
                textDecorationLine: "underline",
                textDecorationStyle: "solid",
                textDecorationColor: "#333",
              },
            ]}
          >
            แดชบอร์ดร้านค้า
          </Text>
        </View>

        <TouchableOpacity onPress={handleShop} style={styles.menuItem} >
          <MaterialIcons name="data-saver-off" size={30} color="#333" />
          <Text style={styles.menuText}>สรุปข้อมูลร้านค้า</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEditStoreName} style={styles.menuItem}>
          <Ionicons name="build-outline" size={30} color="#333" />
          <Text style={styles.menuText}>แก้ไขร้านค้า</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleListproductgi} style={styles.menuItem}>
          <Ionicons name="add-circle-outline" size={30} color="#333" />

          <Text style={styles.menuText}>เพิ่มข้อมูลสินค้า (GI)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleListproduct} style={styles.menuItem}>
          <Ionicons name="pricetag-outline" size={30} color="#333" />

          <Text style={styles.menuText}>เพิ่มสินค้า</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOrderHistoryStore}
          style={styles.menuItem}
        >
          <Ionicons name="clipboard-outline" size={30} color="#333" />
          <Text style={styles.menuText}>รายการคำสั่งซื้อ</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.closeButton} onPress={toggleDrawer}>
          <Text style={styles.closeButtonText}>ปิด</Text>
        </TouchableOpacity> */}

      </Animated.View>

      <ScrollView>
        <View style={styles.cardContainer}>
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}
            >
              <View style={styles.card}>
                <View style={styles.row}>
                  <IconFontAwesome name="money" size={30} style={styles.icon} />
                  <Text style={styles.cardText}>
                    {totalPrice.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.cardText}>กำไรจากการขาย</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <IconAntDesign
                    name="shoppingcart"
                    size={30}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>{totalQuantity}</Text>
                </View>
                <Text style={styles.cardText}>จำนวนยอดขาย</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <IconMaterialIcons
                    name="check-circle"
                    size={30}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>{totalOrderSuccess}</Text>
                </View>
                <Text style={styles.cardText}>ออเดอร์ที่สำเร็จ</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <IconMaterialCommunityIcons
                    name="cancel"
                    size={30}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>{totalOrderFailed}</Text>
                </View>

                <Text style={styles.cardText}>ออเดอร์ที่ยกเลิก</Text>
              </View>
            </ScrollView>
          </View>
        </View>

        <View>
          <View style={styles.chartSection}>
            {monthlyOrderData.length > 0 ? (
              <View>
                <ScrollView>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          marginBottom: 16,
                          marginTop: 8,
                        }}
                      >
                        ยอดขายประจำเดือน
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          marginHorizontal: 8,
                          fontSize: 18,
                          marginTop: -8,
                          fontWeight: 600,
                        }}
                      >
                        ปี :
                      </Text>
                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.dropdownButton}
                      >
                        <Text style={styles.buttonText}>
                          {selectedYear ? selectedYear + 543 : "กรุณาเลือกปี"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {!loadingGraph ? (
                    <View style={{ alignItems: "center" }}>
                      <ActivityIndicator size="large" color="#0000ff" />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#e5e5e5",
                          fontWeight: "700",
                        }}
                      >
                        กำลังโหลดข้อมูล
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      ></View>

                      <Modal
                        transparent={true}
                        visible={modalVisible}
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                      >
                        <View style={styles.modalBackground}>
                          <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>กรุณาเลือกปี</Text>
                            <ScrollView>
                              {years.map((year) => (
                                <TouchableOpacity
                                  key={year}
                                  onPress={() => {
                                    setSelectedYear(year);
                                    setModalVisible(false);
                                  }}
                                  style={[
                                    styles.optionButton,
                                    selectedYear === year &&
                                      styles.selectedOption,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.optionText,
                                      selectedYear === year &&
                                        styles.selectedOptionText,
                                    ]}
                                  >
                                    {year + 543}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        </View>
                      </Modal>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <BarChart
                          data={chartData}
                          width={width + 70}
                          height={220}
                          yAxisLabel="$"
                          yAxisSuffix=""
                          chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#f7f7f7",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 2,
                            color: (opacity = 1) =>
                              `rgba(0, 123, 255, ${opacity})`,
                            labelColor: (opacity = 1) =>
                              `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: {
                              r: "6",
                              strokeWidth: "2",
                              stroke: "#ffffff",
                            },
                            barPercentage: 0.6,
                            useShadowColorFromDataset: false,
                            style: {
                              borderRadius: 12,
                            },
                          }}
                          style={{
                            marginVertical: 8,
                            borderRadius: 12,
                            shadowColor: "rgba(0, 0, 0, 0.1)",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.2,
                            shadowRadius: 6,
                            elevation: 5,
                          }}
                          fromZero={true}
                        />
                      </ScrollView>
                    </View>
                  )}
                </ScrollView>
              </View>
            ) : (
              // <View style={{ alignItems: "center" }}>
              //   <ActivityIndicator size="small" color="#0000ff" />
              //   <Text
              //     style={{ fontSize: 14, color: "#e5e5e5", fontWeight: "700" }}
              //   >
              //     กำลังโหลดข้อมูล
              //   </Text>
              // </View>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/images/noinfomation.jpg")}
                  style={{ width: 150, height: 150 }}
                />
                <Text
                  style={{ fontSize: 20, color: "#9b9b9b", fontWeight: "700" }}
                >
                  ไม่มีข้อมูล
                </Text>
              </View>
            )}
          </View>
        </View>

        <View>
          <View style={styles.chartSection}>
            {monthlyOrderData.length > 0 ? (
              <View>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 16,
                      marginTop: 8,
                    }}
                  >
                    สัดส่วนยอดขายประเภทสินค้า
                  </Text>
                </View>
                {pieChartData.length > 0 && (
                  <PieChart
                    data={pieChartData}
                    width={screenWidth - 30}
                    height={220}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="-9"
                    hasLegend={true}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    center={[10, 0]}
                  />
                )}
              </View>
            ) : (
              // <View style={{ alignItems: "center" }}>
              //   <ActivityIndicator size="small" color="#0000ff" />
              //   <Text
              //     style={{ fontSize: 14, color: "#e5e5e5", fontWeight: "700" }}
              //   >
              //     กำลังโหลดข้อมูล
              //   </Text>
              // </View>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/images/noinfomation.jpg")}
                  style={{ width: 150, height: 150 }}
                />
                <Text
                  style={{ fontSize: 20, color: "#9b9b9b", fontWeight: "700" }}
                >
                  ไม่มีข้อมูล
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  backgroundUnlogin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    paddingRight: 10,
  },
  chartSection: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerUnlogin: {
    justifyContent: "center",
    backgroundColor: "white",
    width: 320,
    height: 200,
    borderRadius: 15,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: "#027bfd",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: "#007BFF",
  },
  selectedOptionText: {
    color: "#fff",
  },
  shadowContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonUnlogin: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonTextUnlogin: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  burgerIcon: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
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
  drawerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    paddingLeft: 15,
  },
  label: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
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
  iconNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  card: {
    width: 180,
    height: 160,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
