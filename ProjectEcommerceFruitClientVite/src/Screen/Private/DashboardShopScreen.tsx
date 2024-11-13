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
import { BiCart, BiCheck, BiDollar, BiDownload, BiX } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";

import "moment/locale/th";
import MyContent from "../../component/MyContent";
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

    const totalOrderSuccess = order
      .filter((x) => x.confirmReceipt === 1)
      .reduce((acc, currentOrder) => {
        return currentOrder.status === 1 ? acc + 1 : acc;
      }, 0);
    setTotalOrderSuccess(totalOrderSuccess);

    const totalOrderFailed = order
      .filter((x) => x.confirmReceipt === 1)
      .reduce((acc, currentOrder) => {
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

  const handleDrawerClose = () => {
    setMobileOpen(false);
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
      item: "กำไรจากการขาย",
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

    worksheet.addRow({ item: "กำไรต่อเดือน", value: "", unit: "" });

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
            {/* Card Image Section */}
            <Card style={{ marginBottom: "20px" }}>
              <CardMedia
                component="img"
                style={{ height: "200px", objectFit: "cover" }}
                image={imageDashboard}
                alt="Dashboard"
              />
            </Card>

            <div ref={componentRef}>
              {/* Stat Cards Section */}
              <div className="mt-2 relative flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-10">
                {[
                  {
                    icon: <BiDollar size={30} />,
                    label: "กำไรจากการขาย",
                    value: totalPrice.toLocaleString(),
                  },
                  {
                    icon: <BiCart size={30} />,
                    label: "จำนวนสินค้าที่ซื้อ",
                    value: totalQuantity,
                  },
                  {
                    icon: <BiCheck size={30} />,
                    label: "ยอดคำสั่งซื้อที่สำเร็จ",
                    value: totalOrderSuccess,
                  },
                  {
                    icon: <BiX size={30} />,
                    label: "ยอดคำสั่งซื้อที่ยกเลิก",
                    value: totalOrderFailed,
                  },
                ].map((stat, idx) => (
                  <a
                    key={idx}
                    className="flex h-28 w-40 sm:w-44 md:w-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                  >
                    <div className="flex flex-row items-center justify-center">
                      <span className="mr-3">{stat.icon}</span>
                      <span className="font-bold text-gray-600">
                        {stat.value}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <MyContent name={stat.label} fontSize="smaller" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Download Button */}
              <button
                id="downloadButton"
                onClick={toggleDropdown}
                className="absolute top-80 right-5 p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
              >
                <BiDownload />
              </button>

              {openDropdown && (
                <div className="absolute right-5 top-85 mt-2 bg-white border rounded shadow-md w-28">
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

              {/* Graphs Section */}
              <div className="w-full mt-5 flex flex-col lg:flex-row gap-4">
                {/* Monthly Sales Graph */}
                <div className="w-full lg:w-2/3 bg-white border rounded-sm overflow-hidden shadow">
                  <div className="p-2 flex justify-between items-center">
                    <MyContent
                      name="กราฟแสดงยอดขายในแต่ละเดือน"
                      fontSize="normal"
                    />
                    {order.filter((x) => x.confirmReceipt === 1).length > 0 && (
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
                    )}
                  </div>
                  <div className="p-2 -mt-10">
                    {order?.filter((x) => x.confirmReceipt === 1).length > 0 ? (
                      <ReactECharts
                        option={option}
                        style={{ height: "300px", width: "100%" }}
                      />
                    ) : (
                      <div className="flex justify-center items-center h-80">
                        <p className="text-4xl font-medium">ไม่มีข้อมูล</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Sales Pie Chart */}
                <div className="w-full lg:w-1/3 bg-white border rounded-sm overflow-hidden shadow">
                  <div className="p-2 -mb-3">
                    <MyContent
                      name="สัดส่วนยอดขายตามหมวดหมู่ผลิตภัณฑ์"
                      fontSize="normal"
                    />
                  </div>
                  <div className="p-2">
                    {order?.filter((x) => x.confirmReceipt === 1).length > 0 ? (
                      <ReactECharts
                        option={pieOption}
                        style={{ height: "300px", width: "100%" }}
                      />
                    ) : (
                      <div className="flex justify-center items-center h-80 -mt-5">
                        <p className="text-4xl font-medium">ไม่มีข้อมูล</p>
                      </div>
                    )}
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
      <Toolbar sx={{ minHeight: 0 }} /> {/* ลดขนาด Toolbar เพื่อเขยิบขึ้น */}
      <Divider />
      <List
        style={{
          cursor: "pointer",
        }}
      >
        <ListItem
          onClick={() => {
            setScreenComponent("dashboard");
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary={<MyContent name="แดชบอร์ด" fontSize="small" />}
          />
        </ListItem>
        <Collapse timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem component={Link} to={RoutePath.firstscreen}>
              <ListItemText primary="Dashboard Home" sx={{ pl: 4 }} />
            </ListItem>
          </List>
        </Collapse>
        <ListItem
          onClick={() => {
            setScreenComponent("CreateShop");
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText
            primary={<MyContent name="แก้ไขร้านค้า" fontSize="small" />}
          />
        </ListItem>
        <ListItem
          onClick={() => {
            setScreenComponent("ProductGIList");
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText
            primary={<MyContent name="เพิ่มข้อมูลสินค้า" fontSize="small" />}
          />
        </ListItem>
        <ListItem
          onClick={() => {
            setScreenComponent("ProductList");
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText
            primary={<MyContent name="เพิ่มสินค้า" fontSize="small" />}
          />
        </ListItem>
        <ListItem
          onClick={() => {
            setScreenComponent("OrderList");
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <ReceiptLongIcon />
          </ListItemIcon>
          <ListItemText
            primary={<MyContent name="คำสั่งซื้อ" fontSize="small" />}
          />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#3f51b5",
          zIndex: (theme) => theme.zIndex.drawer, // ทำให้ AppBar อยู่ใต้ Drawer เมื่อ Drawer เปิด
          height:81,
          justifyContent:'center',

        }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
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
            {
              <MyContent
                name={`ร้านค้า ${usershop && usershop.name}`}
                fontSize="normal"
              />
            }
          </Typography>
          <div>
            <NavLink
              to={RoutePath.homeScreen}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <MyContent name="กลับหน้าหลัก" fontSize="normal" />
            </NavLink>
          </div>
          <div
            style={{
              marginLeft: 20,
            }}
          >
            <MyContent
              name={usershop && usershop.user.fullName}
              fontSize="normal"
            />
          </div>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          position: "relative",
        }}
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
              zIndex: (theme) => theme.zIndex.modal + 1, // ทำให้ Drawer ทับ AppBar
              position: "absolute", // ทำให้ Drawer อยู่ในตำแหน่งทับ AppBar
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
              zIndex: (theme) => theme.zIndex.appBar - 1, // ให้ Drawer ปกติอยู่ใต้ AppBar
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
