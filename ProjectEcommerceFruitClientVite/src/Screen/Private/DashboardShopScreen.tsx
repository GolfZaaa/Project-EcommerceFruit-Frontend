import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Card,
  CardMedia,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import imageDashboard from "../../image/DashboardShop.png";
import { Link, NavLink } from "react-router-dom";
import CreateShopScreen from "../Shopping/CreateShopScreen";
import ProductGIList from "../Shopping/GI/ProductGIList";
import ProductList from "../Shopping/product/ProductList";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import OrderList from "../order/OrderList";
import { RoutePath } from "../../constants/RoutePath";
import ReactECharts from "echarts-for-react";
import html2pdf from "html2pdf.js";
import moment from "moment";
import Select from "react-select";
import { BiDownload } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";

import "moment/locale/th";
moment.locale("th");
const drawerWidth = 240;

export default observer(function DashboardShopScreen() {
  const { usershop, GetShopByUserId } = useStore().shopuserStore;
  const { GetAddressByStore } = useStore().addressStore;
  const { getOrderByStore, order } = useStore().orderStore;

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const componentRef = useRef(null);
  function generatePDF() {
    const opt = {
      margin: 0.2,
      filename: "report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const downloadButton: any = document.querySelector("#downloadButton");

    if (downloadButton) {
      downloadButton.style.display = "none";
      toggleDropdown();
    }

    html2pdf()
      .from(componentRef.current)
      .set(opt)
      .save()
      .then(() => {
        if (downloadButton) {
          downloadButton.style.display = "block";
        }
      });
  }

  const ShopUserId: any = usershop?.id;

  useEffect(() => {
    GetShopByUserId();
    GetAddressByStore();
  }, []);

  useEffect(() => {
    getOrderByStore(ShopUserId);
  }, [usershop]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalOrderSuccess, setTotalOrderSuccess] = useState(0);
  const [totalOrderFailed, setTotalOrderFailed] = useState(0);

  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [monthlyOrderData, setMonthlyOrderData] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

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

    const totalOrderSuccess = order.filter(x=>x.confirmReceipt === 1).reduce((acc, currentOrder) => {
      return currentOrder.status === 1 ? acc + 1 : acc;
    }, 0);
    setTotalOrderSuccess(totalOrderSuccess);

    const totalOrderFailed = order.filter(x=>x.confirmReceipt === 1).reduce((acc, currentOrder) => {
      return currentOrder.status === 2 ? acc + 1 : acc;
    }, 0);
    setTotalOrderFailed(totalOrderFailed);

    const years: any = [
      ...new Set(order.map((o) => moment(o.createdAt).year())),
    ].sort((a, b) => a - b);
    setYearOptions(years.map((year: any) => ({ value: year, label: year })));

    const ordersByMonth = order
      .filter((x) => x.status === 1 && x.confirmReceipt === 1)
      .reduce((acc: any, currentOrder) => {
        const orderYear = moment(currentOrder.createdAt).year();
        if (orderYear !== selectedYear) return acc;

        const month = moment(currentOrder.createdAt).format("MMMM");
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

  const handleYearChange = (selectedOption: any) => {
    setSelectedYear(selectedOption.value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // ยอดขาย(กราฟเส้น)
  const option = {
    xAxis: {
      type: "category",
      data: monthlyOrderData?.map(
        (item: any) => thaiMonths[moment(item?.month, "MMMM").month()]
      ),
      axisLabel: {
        fontSize: 10,
        fontWeight: 600,
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      containLabel: true,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: any) => value.toLocaleString(),
        fontSize: 10,
        fontWeight: 600,
      },
    },
    series: [
      {
        data: monthlyOrderData?.map((item: any) => item?.total),
        type: "line",
        smooth: true,

        lineStyle: {
          color: "#00910a",
          width: 2,
        },
        itemStyle: {
          color: "#00910a",
          borderColor: "#00910a",
        },
        areaStyle: {
          color: "rgba(0, 145, 10, 0.2)",
        },
        symbolSize: 6,
      },
    ],
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => `${params[0]?.data?.toLocaleString()} บาท`,
      textStyle: {
        fontSize: 14,
      },
    },
  };

  // ยอดขาย (กราฟแท่ง)
  // const option = {
  //   xAxis: {
  //     type: "category",
  //     data: monthlyOrderData?.map((item: any) =>
  //       thaiMonths[moment(item?.month, "MMMM").month()]
  //     ),
  //     axisLabel: {
  //       fontSize: 10,
  //       fontWeight: 600,
  //     },
  //   },
  //   yAxis: {
  //     type: "value",
  //     axisLabel: {
  //       formatter: (value: any) => value.toLocaleString(),
  //       fontSize: 10,
  //       fontWeight: 600,
  //     },
  //   },
  //   series: [
  //     {
  //       data: monthlyOrderData?.map((item: any) => item?.total),
  //       type: "bar", // เปลี่ยนเป็น bar หากต้องการให้เป็นกราฟแท่ง
  //       smooth: true,
  //       lineStyle: {
  //         color: "#00910a",
  //         width: 2,
  //       },
  //       itemStyle: {
  //         color: "#00910a",
  //         borderColor: "#00910a",
  //       },
  //       barWidth: '10%', // เพิ่ม barWidth ที่นี่
  //       symbolSize: 6,
  //     },
  //   ],
  //   tooltip: {
  //     trigger: "axis",
  //     formatter: (params: any) => `${params[0]?.data?.toLocaleString()} บาท`,
  //     textStyle: {
  //       fontSize: 14,
  //     },
  //   },
  // };

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

    const formattedData: any = Object.keys(categoryQuantities).map(
      (categoryName) => ({
        name: categoryName,
        value: categoryQuantities[categoryName],
      })
    );

    setPieChartData(formattedData);
  }, [order]);

  const pieOption = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      textStyle: {
        fontSize: 14,
      },
    },
    series: [
      {
        name: "ประเภทสินค้า",
        type: "pie",
        radius: "50%",
        data: pieChartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const [screenComponent, setScreenComponent] = useState("dashboard");

  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dashboard Data");

    worksheet.columns = [
      { header: "รายการ", key: "item", width: 30 },
      { header: "ข้อมูล", key: "value", width: 30 },
      { header: "หน่วย", key: "unit", width: 30 },
    ];

    worksheet.addRow({
      item: "รายได้รวมการจำหน่ายสินค้า",
      value: totalPrice.toLocaleString(),
      unit: "บาท",
    });

    worksheet.addRow({
      item: "จำนวนสินค้าที่ซื้อ",
      value: totalQuantity.toLocaleString(),
      unit: "ครั้ง",
    });

    worksheet.addRow({
      item: "ยอดคำสั่งซื้อที่สำเร็จ",
      value: totalOrderSuccess.toLocaleString(),
      unit: "ครั้ง",
    });

    worksheet.addRow({
      item: "ยอดคำสั่งซื้อที่ยกเลิก",
      value: totalOrderFailed.toLocaleString(),
      unit: "ครั้ง",
    });

    worksheet.addRow({ item: "รายได้ต่อเดือน", value: "", unit: "" });

    monthlyOrderData.forEach((data: any) => {
      const monthIndex = parseInt(moment().month(data.month).format("M")) - 1;
      const monthInThai = thaiMonths[monthIndex];
      worksheet.addRow({
        item: `  ${monthInThai}`,
        value: data.total.toLocaleString(),
        unit: "บาท",
      });
    });

    worksheet.addRow({ item: "จำนวนสินค้าต่อหมวดหมู่", value: "", unit: "" });
    pieChartData.forEach((data: any) => {
      worksheet.addRow({
        item: `  ${data.name}`,
        value: data.value.toLocaleString(),
        unit: "ชิ้น",
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dashboard_shopper.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const renderScreens = () => {
    switch (screenComponent) {
      case "CreateShop":
        return <CreateShopScreen />;
      case "ProductGIList":
        return <ProductGIList />;
      case "ProductList":
        return <ProductList />;
      case "OrderList":
        return <OrderList />;
      case "dashboard":
        return (
          <div className="-mt-16">
            <Card style={{ marginBottom: "20px" }}>
              <CardMedia
                component="img"
                style={{ height: "200px", objectFit: "cover" }}
                image={imageDashboard}
                alt="Dashboard"
              />
            </Card>

            <div ref={componentRef}>
              <div className="mt-2 relative flex flex-wrap justify-center items-center gap-10">
                <a className="flex h-28 w-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80">
                  <div className="flex flex-row items-center justify-center">
                    <svg
                      className="mr-3 fill-gray-500/95"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
                    </svg>

                    <span className="font-bold text-gray-600">
                      {" "}
                      {totalPrice.toLocaleString()}{" "}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    รายได้รวมการจำหน่ายสินค้า
                  </div>
                </a>

                <a
                  href="#"
                  className="flex h-28 w-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                >
                  <div className="flex flex-row items-center justify-center">
                    <svg
                      className="mr-3 fill-gray-500/95"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5.68,19.74C7.16,20.95 9,21.75 11,21.95V19.93C9.54,19.75 8.21,19.17 7.1,18.31M13,19.93V21.95C15,21.75 16.84,20.95 18.32,19.74L16.89,18.31C15.79,19.17 14.46,19.75 13,19.93M18.31,16.9L19.74,18.33C20.95,16.85 21.75,15 21.95,13H19.93C19.75,14.46 19.17,15.79 18.31,16.9M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12M4.07,13H2.05C2.25,15 3.05,16.84 4.26,18.32L5.69,16.89C4.83,15.79 4.25,14.46 4.07,13M5.69,7.1L4.26,5.68C3.05,7.16 2.25,9 2.05,11H4.07C4.25,9.54 4.83,8.21 5.69,7.1M19.93,11H21.95C21.75,9 20.95,7.16 19.74,5.68L18.31,7.1C19.17,8.21 19.75,9.54 19.93,11M18.32,4.26C16.84,3.05 15,2.25 13,2.05V4.07C14.46,4.25 15.79,4.83 16.9,5.69M11,4.07V2.05C9,2.25 7.16,3.05 5.68,4.26L7.1,5.69C8.21,4.83 9.54,4.25 11,4.07Z" />
                    </svg>

                    <span className="font-bold text-gray-600">
                      {totalQuantity}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    จำนวนสินค้าที่ซื้อ
                  </div>
                </a>

                <a
                  href="#"
                  className="flex h-28 w-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                >
                  <div className="flex flex-row items-center justify-center">
                    <svg
                      className="mr-3 fill-gray-500/95"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
                    </svg>

                    <span className="font-bold text-gray-600">
                      {totalOrderSuccess}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    ยอดคำสั่งซื้อที่สำเร็จ
                  </div>
                </a>

                <a
                  href="#"
                  className="flex h-28 w-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                >
                  <div className="flex flex-row items-center justify-center">
                    <svg
                      className="mr-3 fill-gray-500/95"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
                    </svg>

                    <span className="font-bold text-gray-600">
                      {totalOrderFailed}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    ยอดคำสั่งซื้อที่ยกเลิก
                  </div>
                </a>

                <button
                  id="downloadButton"
                  onClick={toggleDropdown}
                  className="absolute top-0 right-0 p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                  <BiDownload />
                </button>

                {openDropdown && (
                  <div className="absolute right-0 top-5 mt-2 bg-white border rounded shadow-md w-28">
                    <ul>
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                        onClick={generatePDF}
                      >
                        <VscFilePdf className="mr-2" /> PDF
                      </li>
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                        onClick={generateExcel}
                      >
                        <RiFileExcel2Line className="mr-2" /> Excel
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="w-full">
                <div className="gap-4 mt-5 flex">
                  <div className="w-9/12 bg-white border rounded-sm overflow-hidden shadow">
                    <div className="p-2 flex justify-between items-center">
                      <p className="font-semibold">
                        กราฟแสดงยอดขายในแต่ละเดือน
                      </p>

                      {order.filter(x=>x.confirmReceipt === 1).length > 0 ?
                      (
                        <div className="flex items-center">
                      <p className="mr-2">ปี :</p>
                      <Select
                        options={yearOptions}
                        value={yearOptions.find(
                          (option: any) => option.value === selectedYear
                        )}
                        onChange={handleYearChange}
                        placeholder="Select Year"
                        className="w-32 z-20"
                      />
                    </div>
                      ):(
                        <div>
                  </div>
                      )}

                    </div>
                    {/* <div className="p-2 -mt-10">

                      <ReactECharts
                        option={option}
                        style={{ height: "300px", width: "100%" }}
                      />
                    </div> */}
                    <div className="p-2 -mt-10">
                {order?.filter(x=>x.confirmReceipt === 1).length > 0 ? (
                  <div>
                  <ReactECharts
                  option={option}
                  style={{ height: "300px", width: "100%" }}
                />
                </div>
                ):(
                  <div className="flex justify-center items-center h-80">
                    <p className="text-4xl font-medium">ไม่มีข้อมูล</p>
                  </div>
                )}
              </div>

                  </div>

                  <div className="w-5/12 bg-white border rounded-sm overflow-hidden shadow ">
                    <div className="p-2 -mb-3">
                      <p className="font-semibold">
                        สัดส่วนยอดขายตามหมวดหมู่ผลิตภัณฑ์
                      </p>
                    </div>
                    <div className="p-2">
                {order?.filter(x=>x.confirmReceipt === 1).length > 0 ? (
                  <ReactECharts
                  option={pieOption}
                  style={{ height: "300px", width: "100%" }}
                />
                ):(
                  <div className="flex justify-center items-center h-80 -mt-5">
                    <p className="text-4xl font-medium">ไม่มีข้อมูล</p>
                  </div>
                )}
              </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List
        style={{
          cursor: "pointer",
        }}
      >
        <ListItem onClick={() => setScreenComponent("dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="แดชบอร์ด" />
        </ListItem>
        <Collapse timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem component={Link} to={RoutePath.firstscreen}>
              <ListItemText primary="Dashboard Home" sx={{ pl: 4 }} />
            </ListItem>
          </List>
        </Collapse>
        <ListItem onClick={() => setScreenComponent("CreateShop")}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="แก้ไขร้านค้า" />
        </ListItem>
        <ListItem onClick={() => setScreenComponent("ProductGIList")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="เพิ่มข้อมูลสินค้า (GI)" />
        </ListItem>

        <ListItem onClick={() => setScreenComponent("ProductList")}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="เพิ่มสินค้า" />
        </ListItem>
        <ListItem onClick={() => setScreenComponent("OrderList")}>
          <ListItemIcon>
            <ReceiptLongIcon />
          </ListItemIcon>
          <ListItemText primary="คำสั่งซื้อ" />
        </ListItem>
        {/* <ListItem   component={Link} to="/integrations">
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Integrations" />
        </ListItem>  */}
      </List>
      <Divider />
    </div>
  );

  console.log("order", order);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#3f51b5",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            ร้านค้า {usershop && usershop.name}
          </Typography>
          <div>
            <NavLink
              to={RoutePath.homeScreen}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              กลับหน้าหลัก
            </NavLink>
          </div>
          <div
            style={{
              marginLeft: 20,
            }}
          >
            {usershop && usershop.user.fullName}
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderScreens()}
      </Box>
    </Box>
  );
});
