import ReactECharts from "echarts-for-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import Select from "react-select";
import html2pdf from "html2pdf.js";
import { BiDownload } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import "dayjs/locale/th";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);
dayjs.locale("th");

export default observer(function DashboardForUser() {
  const { getOrdersByUser, order } = useStore().orderStore;
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalOrderSuccess, setTotalOrderSuccess] = useState(0);
  const [totalOrderCancel, setTotalOrderCancel] = useState(0);

  const [monthlyOrderData, setMonthlyOrderData] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());

  useEffect(() => {
    getOrdersByUser();
  }, []);

  useEffect(() => {
    if (order) {
      const total = order
        .filter((x) => x.status === 1)
        .reduce((acc, currentOrder) => {
          const orderTotal = currentOrder.orderItems.reduce(
            (itemAcc, orderItem) =>
              itemAcc + orderItem.quantity * orderItem.product.price,
            0
          );
          return acc + orderTotal;
        }, 0);
      setTotalPrice(total);

      const totalProduct = order
        .filter((x) => x.status === 1)
        .reduce((acc, currentOrder) => {
          const orderQuantity = currentOrder.orderItems.reduce(
            (itemAcc, orderItem) => itemAcc + orderItem.quantity,
            0
          );
          return acc + orderQuantity;
        }, 0);
      setTotalQuantity(totalProduct);

      const totalOrderSuccess = order.reduce((acc, currentOrder) => {
        return currentOrder.status === 1 ? acc + 1 : acc;
      }, 0);
      setTotalOrderSuccess(totalOrderSuccess);

      const totalOrderFailed = order.reduce((acc, currentOrder) => {
        return currentOrder.status === 2 ? acc + 1 : acc;
      }, 0);
      setTotalOrderCancel(totalOrderFailed);

      const years: any = [
        ...new Set(order.map((o) => dayjs(o.createdAt).year())),
      ].sort((a, b) => a - b);
      setYearOptions(years.map((year: any) => ({ value: year, label: year })));

      const ordersByMonth = order
        .filter((x) => x.status === 1)
        .reduce((acc: any, currentOrder) => {
          const month = dayjs(currentOrder.createdAt).format("MMMM");
          const orderYear = moment(currentOrder.createdAt).year();
          if (orderYear !== selectedYear) return acc;

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
          dayjs().month(a.month).valueOf() - dayjs().month(b.month).valueOf()
      );

      setMonthlyOrderData(monthlyData);
    }
  }, [order, selectedYear]);

  const handleYearChange = (selectedOption: any) => {
    setSelectedYear(selectedOption.value);
  };

  const option = {
    xAxis: {
      type: "category",
      data: monthlyOrderData?.map((item: any) => item?.month),
      axisLabel: {
        fontSize: 10,
        fontWeight: 600,
      },
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
      .filter((x) => x.status === 1)
      .forEach((orderItem) => {
        orderItem.orderItems.forEach((item) => {
          const categoryName = item.product.productGI.category.name;
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

  const componentRef = useRef(null);
  function generatePDF() {
    const opt = {
      margin: 0.2,
      filename: "report_MyAccount.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3 },
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

  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dashboard Data");

    worksheet.columns = [
      { header: "รายการ", key: "item", width: 30 },
      { header: "ข้อมูล", key: "value", width: 30 },
      { header: "หน่วย", key: "unit", width: 30 },
    ];

    worksheet.addRow({
      item: "ยอดเงินทั้งหมดที่ซื้อ",
      value: totalPrice,
      unit: "บาท",
    });

    worksheet.addRow({
      item: "จำนวนสินค้าที่ซื้อ",
      value: totalQuantity,
      unit: "ชิ้น",
    });

    worksheet.addRow({
      item: "ยอดคำสั่งซื้อที่สำเร็จ",
      value: totalOrderSuccess,
      unit: "ครั้ง",
    });

    worksheet.addRow({
      item: "ยอดคำสั่งซื้อที่ยกเลิก",
      value: totalOrderCancel,
      unit: "ครั้ง",
    });

    worksheet.addRow({ item: "ยอดคำสั่งซื้อในแต่ละเดือน", value: "" });
    monthlyOrderData.forEach((monthData: any) => {
      worksheet.addRow({
        item: monthData.month,
        value: monthData.total,
        unit: "บาท",
      });
    });

    worksheet.addRow({
      item: "สัดส่วนการใช้จ่ายในแต่ละหมวดหมู่สินค้า",
      value: "",
    });
    pieChartData.forEach((categoryData: any) => {
      worksheet.addRow({
        item: categoryData.name,
        value: categoryData.value,
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
      a.download = "dashboard_data.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const [modal, setmodal] = useState(false);

  const handleModal = () => {
    setmodal(true);
  };

  const closeModal = () => {
    setmodal(false);
  };

  return (
    <div className="-ml-10 -mt-16">
      <div>
        <div className="mt-2 relative flex flex-wrap justify-center items-center gap-10">
          <a
            href="#"
            className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80"
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

            <div className="mt-2 text-sm text-gray-400">
              ยอดเงินทั้งหมดที่ซื้อ
            </div>
          </a>

          <a
            href="#"
            className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
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

              <span className="font-bold text-gray-600">{totalQuantity}</span>
            </div>

            <div className="mt-2 text-sm text-gray-400">จำนวนสินค้าที่ซื้อ</div>
          </a>

          <a
            href="#"
            className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
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
            className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
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
                {totalOrderCancel}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-400">
              ยอดคำสั่งซื้อที่ยกเลิก
            </div>
          </a>

          <button
            onClick={toggleDropdown}
            className="absolute top-0 right-0 p-2 bg-blue-500 text-white rounded-md"
          >
            <BiDownload />
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-20">
              <ul>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center "
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
        </div>

        {modal && (
          <div>
            <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
              <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />
              <div
                ref={componentRef}
                className="modal-container bg-white  rounded shadow-lg z-50 overflow-y-auto"
              >
                <button
                  onClick={closeModal}
                  id="closeButton"
                  className="absolute top-11 right-3 text-red-600 hover:text-red-800 z-500 w-56"
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

                <div className="modal-content py-4 text-left px-6">
                  <div className="mt-9 relative flex flex-wrap justify-center items-center gap-10 ">
                    <a
                      href="#"
                      className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80"
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

                      <div className="mt-2 text-sm text-gray-400">
                        ยอดเงินทั้งหมดที่ซื้อ
                      </div>
                    </a>

                    <a
                      href="#"
                      className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
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
                      className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
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
                      className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
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
                          {totalOrderCancel}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-400">
                        ยอดคำสั่งซื้อที่ยกเลิก
                      </div>
                    </a>
                  </div>
                  <div className="w-full">
                    <div className="grid grid-cols-4 gap-2 mt-5">
                      <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow p-2">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-sm">
                            แสดงจำนวนคำสั่งซื้อในแต่ละเดือน
                          </p>
                          <div className="flex items-center">
                            <p className="mr-2 text-sm">ปี :</p>
                            {selectedYear}
                          </div>
                        </div>
                        <div className="p-2">
                          <ReactECharts
                            option={option}
                            style={{ height: "200px", width: "300px" }}
                          />
                        </div>
                      </div>

                      <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow p-2">
                        <div>
                          <p className="font-semibold text-sm">
                            สัดส่วนการใช้จ่ายในแต่ละหมวดหมู่สินค้า
                          </p>
                        </div>
                        <div className="p-2">
                          <ReactECharts
                            option={pieOption}
                            style={{ height: "200px", width: "300px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex justify-center items-center mt-5"
                    id="downloadButton"
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
          </div>
        )}

        <div className="w-full">
          <div className="grid grid-cols-4 gap-4 mt-5">
            <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-2 flex justify-between items-center">
                <p className="font-semibold">แสดงจำนวนคำสั่งซื้อในแต่ละเดือน</p>
                <div className="flex items-center">
                  <p className="mr-2">ปี :</p>
                  <Select
                    options={yearOptions}
                    value={yearOptions.find(
                      (option: any) => option.value === selectedYear
                    )}
                    onChange={handleYearChange}
                    placeholder="Select Year"
                    className="w-32 z-40"
                  />
                </div>
              </div>
              <div className="p-2 -mt-10">
                <ReactECharts
                  option={option}
                  style={{ height: "300px", width: "100%" }}
                />
              </div>
            </div>

            <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-2 -mb-3">
                <p className="font-semibold">
                  สัดส่วนการใช้จ่ายในแต่ละหมวดหมู่สินค้า
                </p>
              </div>
              <div className="p-2">
                <ReactECharts
                  option={pieOption}
                  style={{ height: "300px", width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
