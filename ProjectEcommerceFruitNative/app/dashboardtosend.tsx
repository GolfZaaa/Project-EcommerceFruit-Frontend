import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useStore } from "@/src/store/store";
import { observer } from "mobx-react-lite";
import { ActivityIndicator, Divider } from "react-native-paper";
import moment from "moment";
import "moment/locale/th";
import dayjs from "dayjs";
import "dayjs/locale/th";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Order } from "@/src/models/Order";

const { width } = Dimensions.get("window");

export default observer(function dashboardtosend() {
  const [totalPrice, settotalPrice] = useState(0);
  const { user } = useStore().userStore;
  const [totalSuccessForMonth, settotalSuccessForMonth] = useState(0);

  const { order } = useStore().orderStore;

  const [loadingGraph, setloadingGraph] = useState(false);
  useState(false);

  const CheckGetOrdersByUser = () => {
    setloadingGraph(true);
  };
  useEffect(() => {
    CheckGetOrdersByUser();
  }, []);

  const [totalSuccess, settotalSuccess] = useState(0);

  const [totalPriceForMonth, settotalPriceForMonth] = useState(0);

  useEffect(() => {
    if (order) {
      const total = order
        .filter(
          (x) =>
            x.shippings?.[0]?.shippingStatus === 1 && x.confirmReceipt === 1
        )

        .reduce((acc, currentOrder) => {
          const driverHistoryFees = (
            currentOrder.shippings?.[0]?.driverHistories.filter(
              (x) => x.userId === user?.id
            ) || []
          ).reduce(
            (sum, driverHistory) => sum + (driverHistory.shippingFee || 0),
            0
          );
          return acc + driverHistoryFees;
        }, 0);

      settotalPrice(total);

      const shippingSuccess = order.filter(
        (x) => x.shippings?.[0]?.shippingStatus === 1 && x.confirmReceipt === 1
      );
      settotalSuccess(shippingSuccess.length);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const shippingSuccessForMonth = order.filter((x) => {
        const orderDate: any = new Date(x.shippings?.[0].createdAt);
        return (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear &&
          x.shippings?.[0]?.shippingStatus === 1 &&
          x.confirmReceipt === 1
        );
      });
      settotalSuccessForMonth(shippingSuccessForMonth.length);

      const totalformonth = order
        .filter((x) => {
          const orderDate: any = new Date(x.shippings?.[0].createdAt);
          return (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear &&
            x.shippings?.[0]?.shippingStatus === 1 &&
            x.confirmReceipt === 1
          );
        })
        .reduce((acc, currentOrder) => {
          const driverHistoryFees = (
            currentOrder.shippings?.[0]?.driverHistories.filter(
              (x) => x.userId === user?.id
            ) || []
          ).reduce(
            (sum, driverHistory) => sum + (driverHistory.shippingFee || 0),
            0
          );
          return acc + driverHistoryFees;
        }, 0);

      settotalPriceForMonth(totalformonth);
    }
  }, [order]);

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const calculateMonthlyTotal = (orders: Order[], year: number) => {
    const monthlyTotals = Array(12).fill(0);

    orders
      .filter((x) => x.confirmReceipt === 1)
      .forEach((order) => {
        const shipping = order.shippings?.[0];
        if (shipping?.shippingStatus === 1) {
          const orderDate: any = new Date(shipping.createdAt);
          const orderYear = orderDate.getFullYear();
          const month = orderDate.getMonth();
          if (orderYear === year) {
            const totalForOrder = shipping.shippingFee;
            monthlyTotals[month] += totalForOrder;
          }
        }
      });

    return monthlyTotals;
  };

  const extractAvailableYears = (orders: Order[]) => {
    const yearsSet = new Set<number>();
    orders.forEach((order) => {
      const shipping = order.shippings?.[0];
      if (shipping?.shippingStatus === 1) {
        const orderDate: any = new Date(shipping.createdAt);
        const orderYear = orderDate.getFullYear();
        yearsSet.add(orderYear);
      }
    });

    return Array.from(yearsSet).sort((a, b) => b - a);
  };

  const [monthlyTotal, setMonthlyTotal] = useState<number[]>([]);

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
    labels: thaiMonthShort,
    datasets: [
      {
        data: monthlyTotal,
      },
    ],
  };

  const [years, setYears] = useState([]);

  useEffect(() => {
    const OrderFilter = order.filter((x) => x.confirmReceipt === 1);
    if (OrderFilter) {
      const years: any = [
        ...new Set(OrderFilter.map((o) => new Date(o.createdAt).getFullYear())),
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
      .filter((x) => x.confirmReceipt === 1)
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

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (order) {
      const years = extractAvailableYears(order);
      setAvailableYears(years);
      if (years.length > 0 && !years.includes(selectedYear)) {
        setSelectedYear(years[0]);
      }
      const totals = calculateMonthlyTotal(order, selectedYear);
      setMonthlyTotal(totals);
    }
  }, [order, selectedYear]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 5,
          paddingBottom: 10,
          paddingTop: 20,
        }}
      >
        <View>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          สรุปข้อมูลรายได้ของฉัน
        </Text>

        <View></View>
      </View>

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
                  <Ionicons name="cash-outline" size={30} style={styles.icon} />
                  <Text style={styles.cardText}>
                    {totalPrice.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.cardText}>รายได้สุทธิ</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <FontAwesome5
                    name="check-circle"
                    size={30}
                    style={styles.icon}
                    color="black"
                  />
                  <Text style={styles.cardText}>{totalSuccess}</Text>
                </View>
                <Text style={styles.cardText}>รับหิ้วสำเร็จ</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <FontAwesome
                    name="calendar-check-o"
                    size={30}
                    style={styles.icon}
                    color="black"
                  />
                  <Text style={styles.cardText}>{totalSuccessForMonth}</Text>
                </View>
                <Text style={styles.cardText}>รับหิ้วสำเร็จเดือนนี้</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <FontAwesome5
                    name="money-bill-alt"
                    size={30}
                    style={styles.icon}
                    color="black"
                  />
                  <Text style={styles.cardText}>
                    {totalPriceForMonth.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.cardText}>รายได้รับหิ้วเดือนนี้</Text>
              </View>
            </ScrollView>
          </View>
        </View>

        <View>
          <View style={styles.chartSection}>
            {order.filter((x) => x.confirmReceipt === 1).length > 0 ? (
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
                        จำนวนคำสั่งซื้อแต่ละเดือน
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
                              {availableYears && availableYears.length > 0 ? (
                                availableYears.map((year) => (
                                  <TouchableOpacity
                                    key={year}
                                    onPress={() => {
                                      setSelectedYear(year); // ตั้งค่าปีที่เลือก
                                      setModalVisible(false); // ปิด Modal
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
                                ))
                              ) : (
                                <Text style={styles.noDataText}>
                                  ไม่มีข้อมูลปีให้เลือก
                                </Text>
                              )}
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
                          yAxisLabel=""
                          yAxisSuffix="฿"
                          chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#f7f7f7",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
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
                          fromZero={true} // กราฟเริ่มจาก 0
                        />
                      </ScrollView>
                    </View>
                  )}
                </ScrollView>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../assets/images/noinfomation.jpg")}
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
            {order.filter((x) => x.confirmReceipt === 1).length > 0 ? (
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
                    สัดส่วนจำนวนหิ้วตามหมวดหมู่สินค้า
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
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../assets/images/noinfomation1.jpg")}
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
