import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Order } from "../../models/Order";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MyOrderCardToSend from "./components/MyOrderCardToSend";
import { BiDownload } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import ExcelJS from "exceljs";
import { useStore } from "../../store/store";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        width: "100%",
      }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MyOrderToSendList = ({ order }: { order: Order[] }) => {
  const { user } = useStore().userStore;

  const [value, setValue] = useState(0);

  const handleChange = (value: number) => {
    setValue(value);
  };

  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const [moreData, setmoreData] = useState(false);
  const toggleMoreData = () => {
    setmoreData(!moreData);
  };
  const dataForwardDriver: Order[] = order.filter((item) =>
    item.shippings[0].driverHistories.some(
      (history) => history.statusDriver === 3 && history.userId === user?.id
    )
  );

  const [totalPrice, settotalPrice] = useState(0);
  const [totalSuccess, settotalSuccess] = useState(0);

  const [totalPriceForMonth, settotalPriceForMonth] = useState(0);
  const [totalSuccessForMonth, settotalSuccessForMonth] = useState(0);

  useEffect(() => {
    if (order) {
      const total = order
        .filter((x) => x.shippings?.[0]?.shippingStatus === 1)
        .reduce((acc, currentOrder) => {
          const shippingFeeTotal =
            currentOrder.shippings[0].shippingFee *
            currentOrder.orderItems.length;
          return acc + shippingFeeTotal;
        }, 0);
      settotalPrice(total);

      const shippingSuccess = order.filter(
        (x) => x.shippings?.[0]?.shippingStatus === 1
      );
      settotalSuccess(shippingSuccess.length);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const shippingSuccessForMonth = order.filter((x) => {
        const orderDate: any = new Date(x.shippings?.[0].createdAt);
        return (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear &&
          x.shippings?.[0]?.shippingStatus === 1
        );
      });
      settotalSuccessForMonth(shippingSuccessForMonth.length);

      const totalformonth = order
        .filter((x) => {
          const orderDate: any = new Date(x.shippings?.[0].createdAt);
          return (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear &&
            x.shippings?.[0]?.shippingStatus === 1
          );
        })
        .reduce((acc, currentOrder) => {
          const shippingFeeTotal =
            currentOrder.shippings[0].shippingFee *
            currentOrder.orderItems.length;
          return acc + shippingFeeTotal;
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

    orders.forEach((order) => {
      const shipping = order.shippings?.[0];
      if (shipping?.shippingStatus === 1) {
        const orderDate: any = new Date(shipping.createdAt);
        const orderYear = orderDate.getFullYear();
        const month = orderDate.getMonth(); 
        if (orderYear === year) {
          const totalForOrder = shipping.shippingFee * order.orderItems.length;
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
        yearsSet.add(orderYear); // เพิ่มปีที่เจอเข้าไปใน set
      }
    });

    return Array.from(yearsSet).sort((a, b) => b - a); // แปลง Set ให้เป็น Array และเรียงจากปีมากไปน้อย
  };

  const [monthlyTotal, setMonthlyTotal] = useState<number[]>([]);

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

  const data = {
    months: [
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
    ],
    revenue: monthlyTotal, 
  };

  const options = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: data.months,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      name: "รายได้ (บาท)",
    },
    series: [
      {
        name: "รายได้",
        type: "line",
        data: data.revenue,
        smooth: true,
        itemStyle: {
          color: "#4caf50",
        },
      },
    ],
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value)); 
  };

  const filteredOrders = order.filter(o => o.shippings.some(s => s.shippingStatus === 1));

  const productCount:any = {};
  
  filteredOrders.forEach(o => {
      o.orderItems.forEach(item => {
          const productName = item.product.productGI.name;
          if (productCount[productName]) {
              productCount[productName] += item.quantity;
          } else {
              productCount[productName] = item.quantity;
          }
      });
  });

  console.log("filteredOrders",filteredOrders)


  const productNames = Object.keys(productCount);
  const quantities = Object.values(productCount);

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`;
};

const colors = Array.from({ length: productNames.length }, getRandomColor);

  
const optionsBar = {
  tooltip: {},
  grid: {
      left: '17%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
  },
  xAxis: {
      type: 'category',
      data: productNames,
  },
  yAxis: {
      type: 'value',
      name: 'จำนวนประเภทสินค้า (ชิ้น)',
  },
  series: [{
      name: 'จำนวน',
      type: 'bar',
      data: quantities,
      itemStyle: {
          color: (params:any) => colors[params.dataIndex], 
      },
      barWidth: '10%',
  }],
};


  const categoryCount:any = {};

  filteredOrders.forEach(o => {
    o.orderItems.forEach(item => {
        const categoryName = item.product.productGI.category.name; // ดึงชื่อประเภทสินค้า
        if (categoryCount[categoryName]) {
            categoryCount[categoryName] += item.quantity; // นับจำนวน
        } else {
            categoryCount[categoryName] = item.quantity;
        }
    });
});

  const categoryNames = Object.keys(categoryCount);
  const categoryQuantities = Object.values(categoryCount);

  const optionsDonut = {
      tooltip: {
          trigger: 'item',
      },
      legend: {
          orient: 'vertical',
          // left: 'left',  ให้หัวข้ออยู่ตรงกลาง
      },
      series: [
          {
              name: '',
              type: 'pie',
              radius: ['20%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2,
              },
              label: {
                  show: false,
                  position: 'center',
              },
              emphasis: {
                  label: {
                      show: true,
                      fontSize: '20',
                      fontWeight: 'bold',
                  },
              },
              data: categoryNames.map((name, index) => ({
                  value: categoryQuantities[index],
                  name: name,
              })),
              roseType: 'angle',
              center: ['50%', '50%'],
          },
      ],
  };

  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dashboard Data");

    worksheet.columns = [
      { header: "รายการ", key: "item", width: 30 },
      { header: "ข้อมูล", key: "value", width: 30 },
      { header: "หน่วย", key: "unit", width: 30 },
    ];

    worksheet.addRow({
      item: "รายได้สุทธิทั้งหมด",
      value: totalPrice.toLocaleString(),
      unit: "บาท",
    });

    worksheet.addRow({
      item: "ยอดหิ้วที่สำเร็จทั้งหมด",
      value: totalSuccess.toLocaleString(),
      unit: "ครั้ง",
    });

    worksheet.addRow({
      item: "ยอดหิ้วที่สำเร็จของเดือนนี้",
      value: totalSuccessForMonth.toLocaleString(),
      unit: "ครั้ง",
    });

    worksheet.addRow({
      item: "ยอดหิ้วสุทธิของเดือนนี้",
      value: totalPriceForMonth.toLocaleString(),
      unit: "บาท",
    });

    worksheet.addRow({ item: "รายได้สุทธิของแต่ละเดือน", value: "" });
    data.months.forEach((month, index) => {
        worksheet.addRow({
            item: month,
            value: monthlyTotal[index].toLocaleString(), // ใช้ข้อมูลรายได้ที่มี
            unit: "บาท",
        });
    });

    worksheet.addRow({ item: "สัดส่วนจำนวนหิ้วของแต่ละสินค้า", value: "" });
    Object.keys(productCount).forEach((productName) => {
        worksheet.addRow({
            item: productName,
            value: productCount[productName].toLocaleString(),
            unit: "ชิ้น",
        });
    });

    worksheet.addRow({ item: "สัดส่วนจำนวนหิ้วตามหมวดหมู่สินค้า", value: "" });
    Object.keys(categoryCount).forEach((categoryName) => {
        worksheet.addRow({
            item: categoryName,
            value: categoryCount[categoryName].toLocaleString(),
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
      a.download = "dashboard_personal-shopper.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="-mt-12">
      <div className="mt-2 relative flex flex-wrap justify-center items-center gap-10 bg-white p-8 rounded-lg shadow-md border">
        <div className="absolute  top-5 left-5">
          <p className="text-lg font-bold">ข้อมูลรายได้ของฉัน</p>
        </div>

        <a
          href="#"
          className="mt-6 flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-md"
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
              {totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">รายได้สุทธิทั้งหมด</div>
        </a>

        <a
          href="#"
          className=" mt-6 flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg"
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
            <span className="font-bold text-gray-600">{totalSuccess}</span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            ยอดหิ้วที่สำเร็จทั้งหมด
          </div>
        </a>

        <a
          href="#"
          className=" mt-6 flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg"
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
              {totalSuccessForMonth}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            ยอดหิ้วที่สำเร็จของเดือนนี้
          </div>
        </a>

        <a
          href="#"
          className=" mt-6 flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg"
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
              <path d="M2.5 19.6L3.8 20.2V11.2L1.4 17C1 18.1 1.5 19.2 2.5 19.6M15.2 4.8L20.2 16.8L12.9 19.8L7.9 7.9V7.8L15.2 4.8M15.3 2.8C15 2.8 14.8 2.8 14.5 2.9L7.1 6C6.4 6.3 5.9 7 5.9 7.8V8L11 20.1L20.3 16.5L15.3 2.8M4.2 11.2V20.2L5.6 19.6C6.6 19.2 7.1 18.1 6.7 17L4.2 11.2Z" />
            </svg>
            <span className="font-bold text-gray-600">
              {totalPriceForMonth}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            ยอดหิ้วสุทธิของเดือนนี้
          </div>
        </a>

        <button
          id="downloadButton"
          onClick={toggleDropdown}
          className="absolute top-5 right-5 p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
        >
          <BiDownload />
        </button>

        {openDropdown && (
          <div className="absolute right-0 top-10 mt-2 bg-white border rounded shadow-md w-28">
            <ul>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                // onClick={generatePDF}
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

        <div>
          <motion.div
            className="flex items-center font-semibold cursor-pointer"
            onClick={toggleMoreData}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            ดูข้อมูลเพิ่มเติม <MdExpandMore size={25} className="-mb-1" />
          </motion.div>
        </div>

        {moreData && (
          <motion.div
            className="relative block mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between">
              <div className="absolute -top-5 right-10 p-2 z-40">
                <label htmlFor="yearSelect" className="mr-2 font-bold">
                  เลือกปี:
                </label>
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="p-2 border border-gray-300 rounded-md shadow-sm "
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ml-16 font-semibold">
                <p>รายได้สุทธิของแต่ละเดือน</p>
              </div>
            </div>

            <ReactECharts option={options} style={{ width: 1000 }} />
            <div className="flex mt-6">
        <div className="w-9/12">
        <p className="pl-11 font-semibold">สัดส่วนจำนวนหิ้วของแต่ละสินค้า</p>
        <div>
        <ReactECharts option={optionsBar} />
        </div>
        </div>
        <div className="w-5/12 ">
        <p className="pl-11 font-semibold">สัดส่วนจำนวนหิ้วตามหมวดหมู่สินค้า</p>
        <div className="pt-7 pl-22">
        <ReactECharts option={optionsDonut} />
        </div>
        </div>
    </div>
          </motion.div>
        )}
      </div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={4}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          สร้างรายได้
        </Typography>
        <Tabs
          value={value}
          onChange={(_, v) => handleChange(v)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          style={{
            width: "100%",
          }}
        >
          <Tab
            label="ทั้งหมด"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="ที่ต้องส่ง"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="ส่งแล้ว"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="ส่งต่อให้ผู้จัดส่งคนอื่น"
            style={{
              width: "20%",
            }}
          />
        </Tabs>

        <CustomTabPanel value={value} index={0}>
          <MyOrderCardToSend order={order} index={0} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <MyOrderCardToSend
            order={order.filter(
              (item) => item?.shippings[0]?.shippingStatus === 0
            )}
            index={1}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <MyOrderCardToSend
            order={order.filter(
              (item) => item?.shippings[0]?.shippingStatus === 1
            )}
            index={2}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <MyOrderCardToSend order={dataForwardDriver} index={3} />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default observer(MyOrderToSendList);
