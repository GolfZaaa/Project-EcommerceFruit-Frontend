import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Order } from "../../models/Order";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MyOrderCardToSend from "./components/MyOrderCardToSend";
import { BiDownload } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdAttachMoney, MdExpandMore } from "react-icons/md";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import ExcelJS from "exceljs";
import html2pdf from "html2pdf.js";
import { useStore } from "../../store/store";
import MyContent from "../../component/MyContent";
import { FaBoxOpen } from "react-icons/fa";
import { AiOutlineCalendar, AiOutlinePieChart } from "react-icons/ai";
import { GiPayMoney } from "react-icons/gi";
import lottiteEmpty from "../../assets/lotties/lf20_qh5z2fdq.json";

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

  const calculateMonthlyTotal = (orders: Order[], year: number, userId: number) => {
    const monthlyTotals = Array(12).fill(0);
  
    orders
      .filter(
        (order) =>
          order.shippings?.[0]?.shippingStatus === 1 && order.confirmReceipt === 1
      )
      .forEach((order) => {
        const shipping = order.shippings?.[0];
        const orderDate = new Date(shipping?.createdAt);
        const orderYear = orderDate.getFullYear();
        const month = orderDate.getMonth();
  
        if (orderYear === year) {
          const driverHistoryFees = (
            shipping?.driverHistories.filter(
              (history) => history.userId === userId
            ) || []
          ).reduce(
            (sum, driverHistory) => sum + (driverHistory.shippingFee || 0),
            0
          );
          monthlyTotals[month] += driverHistoryFees;
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

  useEffect(() => {
    if (order) {
      const years = extractAvailableYears(order);
      setAvailableYears(years);
      if (years.length > 0 && !years.includes(selectedYear)) {
        setSelectedYear(years[0]);
      }
  
      const totals = calculateMonthlyTotal(order, selectedYear, user?.id || 0); // เพิ่ม user?.id
      setMonthlyTotal(totals);
    }
  }, [order, selectedYear, user?.id]);
  

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

  const filteredOrders = order.filter((o) =>
    o.shippings.some((s) => s.shippingStatus === 1)
  );

  const productCount: any = {};

  filteredOrders
    .filter((x) => x.confirmReceipt === 1)
    .forEach((o) => {
      o.orderItems.forEach((item) => {
        const productName = item.product.productGI.name;
        if (productCount[productName]) {
          productCount[productName] += item.quantity;
        } else {
          productCount[productName] = item.quantity;
        }
      });
    });

  const productNames = Object.keys(productCount);
  const quantities = Object.values(productCount);

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };

  const colors = Array.from({ length: productNames.length }, getRandomColor);

  const optionsBar = {
    tooltip: {},
    grid: {
      left: "17%",
      right: "0%",
      bottom: "0%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: productNames,
    },
    yAxis: {
      type: "value",
      name: "จำนวนสินค้า (ชิ้น)",
    },
    series: [
      {
        name: "จำนวน",
        type: "bar",
        data: quantities,
        itemStyle: {
          color: (params: any) => colors[params.dataIndex],
        },
        barWidth: "10%",
      },
    ],
  };

  const categoryCount: any = {};

  filteredOrders.forEach((o) => {
    o.orderItems.forEach((item) => {
      const categoryName = item.product.productGI.category.name;
      if (categoryCount[categoryName]) {
        categoryCount[categoryName] += item.quantity;
      } else {
        categoryCount[categoryName] = item.quantity;
      }
    });
  });

  const categoryNames = Object.keys(categoryCount);
  const categoryQuantities = Object.values(categoryCount);

  const optionsDonut = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["20%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
          },
        },
        data: categoryNames.map((name, index) => ({
          value: categoryQuantities[index],
          name: name,
        })),
        roseType: "angle",
        center: ["50%", "50%"],
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

    worksheet.getRow(1).font = {
      bold: true,
      size: 14,
      color: { argb: "FFFFFF" },
    };
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0070C0" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const addStyledRow = (rowData: any) => {
      const row = worksheet.addRow(rowData);
      row.eachCell((cell, colIndex) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: colIndex === 2 ? "center" : "left",
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    };

    addStyledRow({
      item: "รายได้สุทธิ",
      value: totalPrice.toLocaleString(),
      unit: "บาท",
    });

    addStyledRow({
      item: "รับหิ้วสำเร็จ",
      value: totalSuccess.toLocaleString(),
      unit: "ครั้ง",
    });

    addStyledRow({
      item: "รับหิ้วสำเร็จเดือนนี้",
      value: totalSuccessForMonth.toLocaleString(),
      unit: "ครั้ง",
    });

    addStyledRow({
      item: "รายได้รับหิ้วเดือนนี้",
      value: totalPriceForMonth.toLocaleString(),
      unit: "บาท",
    });

    addStyledRow({ item: "รายได้สุทธิของแต่ละเดือน", value: "" });
    availableYears.forEach((year) => {
      const monthlyTotals = calculateMonthlyTotal(order, year, user?.id || 0);
      addStyledRow({ item: `ปี ${year + 543}`, value: "" });

      data.months.forEach((month, index) => {
        if (monthlyTotals[index] > 0) {
          addStyledRow({
            item: month,
            value: monthlyTotals[index].toLocaleString(),
            unit: "บาท",
          });
        }
      });
    });

    addStyledRow({ item: "สัดส่วนจำนวนหิ้วของแต่ละสินค้า", value: "" });
    Object.keys(productCount).forEach((productName) => {
      addStyledRow({
        item: productName,
        value: productCount[productName].toLocaleString(),
        unit: "ชิ้น",
      });
    });

    addStyledRow({ item: "สัดส่วนจำนวนหิ้วตามหมวดหมู่สินค้า", value: "" });
    Object.keys(categoryCount).forEach((categoryName) => {
      addStyledRow({
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

  const sortingOptions = [
    { value: "quantity_desc", label: "เรียงจากมากไปน้อย" },
    { value: "quantity_asc", label: "เรียงจากน้อยไปมาก" },
    { value: "alphabetical", label: "เรียงตามตัวอักษร" },
  ];

  const [sortOption, setSortOption] = useState("quantity_desc");

  const [selectedSorting, setSelectedSorting] = useState(
    sortingOptions[0].label
  );

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    const selectedOption = sortingOptions.find(
      (option) => option.value === event.target.value
    );
    if (selectedOption) {
      setSelectedSorting(selectedOption.label);
    }
  };

  const sortedProductNames = [...productNames];

  const sortProducts = () => {
    switch (sortOption) {
      case "quantity_desc":
        return sortedProductNames.sort(
          (a, b) => productCount[b] - productCount[a]
        );
      case "quantity_asc":
        return sortedProductNames.sort(
          (a, b) => productCount[a] - productCount[b]
        );
      case "alphabetical":
        return sortedProductNames.sort();
      default:
        return sortedProductNames;
    }
  };

  const sortedProducts = sortProducts();
  const sortedQuantities = sortedProducts.map((name) => productCount[name]);

  const componentRef = useRef(null);

  function generatePDF() {
    const opt = {
      margin: 0.2,
      filename: "report_MyAccount.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const closeButton: any = document.querySelector("#closeButton");
    const downloadButton: any = document.querySelector("#downloadButton");

    if (downloadButton) {
      downloadButton.style.display = "none";
    }
    if (closeButton) {
      closeButton.style.display = "none";
    }

    html2pdf()
      .from(componentRef.current)
      .set(opt)
      .save()
      .then(() => {
        if (downloadButton) {
          downloadButton.style.display = "block";
        }
        if (closeButton) {
          closeButton.style.display = "block";
        }
      });
  }

  const [modal, setmodal] = useState(false);

  const handleModal = () => {
    setmodal(true);
  };

  const closeModal = () => {
    setmodal(false);
  };

  return (
    <div className="FontPublic -mt-12">
      <div className="mt-2 relative flex flex-wrap justify-center items-center gap-10 bg-white p-8 rounded-lg shadow-md border">
        <div className="absolute  top-5 left-5">
          <p className="text-lg font-bold">
            <MyContent name="ข้อมูลรายได้ของฉัน" fontSize="small" />
          </p>
        </div>

        <a className="mt-6 flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-md">
          <div className="flex flex-row items-center justify-center">
            <MdAttachMoney size={25} />
            <span className="font-bold text-gray-600">
              {totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            <MyContent name="รายได้สุทธิ" fontSize="smaller" />
          </div>
        </a>

        <a className=" mt-6 flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg">
          <div className="flex flex-row items-center justify-center">
            <FaBoxOpen size={25} className="mr-2" />
            <span className="font-bold text-gray-600">{totalSuccess}</span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            <MyContent name="รับหิ้วสำเร็จ" fontSize="smaller" />
          </div>
        </a>

        <a className=" mt-6 flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg">
          <div className="flex flex-row items-center justify-center">
            <AiOutlineCalendar size={25} className="mr-2" />
            <span className="font-bold text-gray-600">
              {totalSuccessForMonth}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            <MyContent name="รับหิ้วสำเร็จเดือนนี้" fontSize="smaller" />
          </div>
        </a>

        <a className=" mt-6 flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg">
          <div className="flex flex-row items-center justify-center">
            <GiPayMoney size={25} className="mr-2" />
            <span className="font-bold text-gray-600">
              {totalPriceForMonth}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            <MyContent name="รายได้รับหิ้วเดือนนี้" fontSize="smaller" />
          </div>
        </a>

        {order.filter((x) => x.confirmReceipt === 1).length > 0 && (
          <button
            onClick={toggleDropdown}
            className="absolute top-5 right-5 p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
          >
            <BiDownload />
          </button>
        )}

        {openDropdown && (
          <div className="absolute right-0 top-10 mt-2 bg-white border rounded shadow-md w-28">
            <ul>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                onClick={handleModal}
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

        {modal && (
          <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50 overflow-y-scroll">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50 " />
            <div
              ref={componentRef}
              className="modal-container bg-white rounded shadow-lg z-50 overflow-y-scroll h-full"
            >
              <div className="modal-content py-4 text-left px-6">
                <div className="justify-end flex">
                  <button
                    onClick={closeModal}
                    id="closeButton"
                    className=" text-red-600 hover:text-red-800 z-50 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="mt-9 relative flex flex-wrap justify-center items-center gap-10 ">
                  <a
                    href="#"
                    className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                  >
                    <div className="flex flex-row items-center justify-center">
                      <MdAttachMoney size={25} />
                      <span className="font-bold text-gray-600">
                        {totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-400">
                      <MyContent name="รายได้สุทธิ" fontSize="smaller" />
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                  >
                    <div className="flex flex-row items-center justify-center">
                      <FaBoxOpen size={25} className="mr-2" />
                      <span className="font-bold text-gray-600">
                        {totalSuccess}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-400">
                      <MyContent name="รับหิ้วสำเร็จ" fontSize="smaller" />
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                  >
                    <div className="flex flex-row items-center justify-center">
                      <AiOutlineCalendar size={25} className="mr-2" />
                      <span className="font-bold text-gray-600">
                        {totalSuccessForMonth}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-400">
                      <MyContent
                        name="รับหิ้วสำเร็จเดือนนี้"
                        fontSize="smaller"
                      />
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                  >
                    <div className="flex flex-row items-center justify-center">
                      <GiPayMoney size={25} className="mr-2" />
                      <span className="font-bold text-gray-600">
                        {totalPriceForMonth}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-400">
                      <MyContent
                        name="รายได้รับหิ้วเดือนนี้"
                        fontSize="smaller"
                      />
                    </div>
                  </a>
                </div>
                <div className="w-full mt-5">
                  <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow p-2">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm">
                        <MyContent
                          name="รายได้สุทธิของแต่ละเดือน"
                          fontSize="small"
                        />
                      </p>
                      <div className="flex items-center">
                        <MyContent
                          name={`ปี : ${selectedYear + 543}`}
                          fontSize="smaller"
                        />
                      </div>
                    </div>
                    <div className="p-2">
                      <ReactECharts
                        option={options}
                        style={{ width: 750, height: 200 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-4 gap-2 mt-5">
                    <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow p-2">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm">
                          <MyContent
                            name="สัดส่วนจำนวนหิ้วของแต่ละสินค้า"
                            fontSize="small"
                          />
                        </p>
                        <div className="flex items-center ml-3">
                          <MyContent
                            name={`สินค้า : ${selectedSorting}`}
                            fontSize="smaller"
                          />
                          {/* <p className="mr-2 text-sm">สินค้า:</p>
                          <p className="text-xs">{selectedSorting}</p> */}
                        </div>
                      </div>
                      <div className="p-2">
                        <div>
                          <ReactECharts
                            option={{
                              ...optionsBar,
                              xAxis: {
                                ...optionsBar.xAxis,
                                data: sortedProducts,
                              },
                              series: [
                                {
                                  ...optionsBar.series[0],
                                  data: sortedQuantities,
                                },
                              ],
                            }}
                            style={{ width: 300, height: 200 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow p-2">
                      <div>
                        <p className="font-semibold text-sm">
                          <MyContent
                            name="สัดส่วนจำนวนหิ้วตามหมวดหมู่สินค้า"
                            fontSize="small"
                          />
                        </p>
                      </div>
                      <div className="p-2 justify-center items-center">
                        <ReactECharts
                          option={optionsDonut}
                          style={{ width: 300, height: 240 }}
                          className="ml-8 mt-7"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="downloadButton"
                  className="flex justify-center items-center mt-5"
                >
                  <button
                    onClick={generatePDF}
                    className="  bg-blue-500 text-white rounded-md w-full flex justify-center items-center p-2"
                  >
                    <BiDownload size={30} className="mr-3" /> <p>ดาวน์โหลด</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {order.filter((x) => x.confirmReceipt === 1).length > 0 && (
          <div>
            <motion.div
              className="flex items-center font-semibold cursor-pointer"
              onClick={toggleMoreData}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MyContent name="ดูข้อมูลเพิ่มเติม" fontSize="small" />
              <MdExpandMore size={25} className="-mb-1" />
            </motion.div>
          </div>
        )}

        {moreData && (
          <motion.div
            className="relative block mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div className="text-center sm:text-left font-semibold mb-2 sm:mb-0">
                <MyContent name="รายได้สุทธิของแต่ละเดือน" fontSize="small" />
              </div>
              <div className="flex items-center">
                <label htmlFor="yearSelect" className="mr-2 font-bold">
                  เลือกปี:
                </label>
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year + 543}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full sm:w-11/12 lg:w-10/12 mx-auto">
              <ReactECharts
                option={options}
                style={{
                  width: "100%",
                  height: "300px",
                  minHeight: "250px",
                  maxHeight: "400px",
                }}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-6">
              <div className="w-full lg:w-8/12">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <div className="text-center sm:text-left font-semibold">
                    <MyContent
                      name="สัดส่วนจำนวนหิ้วของแต่ละสินค้า"
                      fontSize="small"
                    />
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0">
                    <label htmlFor="sorting" className="font-semibold mr-2">
                      สินค้า:
                    </label>
                    <select
                      id="sorting"
                      value={sortOption}
                      onChange={handleSortChange}
                      className="border-2 border-blue-500 rounded-md p-1 focus:outline-none focus:border-blue-700"
                    >
                      {sortingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <ReactECharts
                  option={{
                    ...optionsBar,
                    xAxis: {
                      ...optionsBar.xAxis,
                      data: sortedProducts,
                    },
                    series: [
                      {
                        ...optionsBar.series[0],
                        data: sortedQuantities,
                      },
                    ],
                  }}
                  style={{
                    width: "100%",
                    height: "250px",
                  }}
                />
              </div>

              <div className="w-full lg:w-4/12 mt-6 lg:mt-0">
                <div className="text-center lg:text-left font-semibold mb-4">
                  <MyContent
                    name="สัดส่วนจำนวนหิ้วตามหมวดหมู่สินค้า"
                    fontSize="small"
                  />
                </div>
                <div className="flex justify-center lg:justify-start">
                  <ReactECharts
                    option={optionsDonut}
                    style={{
                      width: "100%",
                      height: "250px",
                    }}
                  />
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
          <p className="FontPublic font-semibold">
            <MyContent name="สร้างรายได้" fontSize="large" />
          </p>
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
            label={
              <p className="FontPublic">
                <MyContent name="ทั้งหมด" fontSize="small" />
              </p>
            }
            style={{
              width: "20%",
            }}
          />
          <Tab
            label={
              <p className="FontPublic">
                <MyContent name="ที่ต้องส่ง" fontSize="small" />
              </p>
            }
            style={{
              width: "20%",
            }}
          />
          <Tab
            label={
              <p className="FontPublic">
                <MyContent name="ส่งแล้ว" fontSize="small" />
              </p>
            }
            style={{
              width: "20%",
            }}
          />
          <Tab
            label={
              <p className="FontPublic">
                <MyContent name="ส่งต่อให้ผู้จัดส่งคนอื่น" fontSize="small" />
              </p>
            }
            style={{
              width: "30%",
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
