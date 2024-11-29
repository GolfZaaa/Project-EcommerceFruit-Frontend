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
import MyContent from "../../component/MyContent";
import { FaCheckCircle, FaDollarSign, FaShoppingCart, FaTimesCircle } from "react-icons/fa";

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
  const [monthlyAndYearOrderData, setMonthlyAndYearOrderData] = useState([]);

  useEffect(() => {
    getOrdersByUser();
  }, []);

  useEffect(() => {
    if (order) {
      const total = order
        .filter((x) => x.confirmReceipt === 1)
        .reduce((acc, currentOrder) => {
          const orderTotal = currentOrder.orderItems.reduce(
            (itemAcc, orderItem) =>
              itemAcc + orderItem.quantity * orderItem.product.price,
            0
          );

          const totalFee = currentOrder.shippings
            ? currentOrder.shippings.reduce(
                (feeAcc, shipping) => feeAcc + shipping.shippingFee,
                0
              )
            : 0;

          return acc + orderTotal + totalFee;
        }, 0);
      setTotalPrice(total);

      const totalProduct = order
        .filter((x) => x.confirmReceipt === 1)
        .reduce((acc, currentOrder) => {
          const orderQuantity = currentOrder.orderItems.reduce(
            (itemAcc, orderItem) => itemAcc + orderItem.quantity,
            0
          );
          return acc + orderQuantity;
        }, 0);
      setTotalQuantity(totalProduct);

      const totalOrderSuccess = order.reduce((acc, currentOrder) => {
        return currentOrder.confirmReceipt === 1 ? acc + 1 : acc;
      }, 0);
      setTotalOrderSuccess(totalOrderSuccess);

      const totalOrderFailed = order.reduce((acc, currentOrder) => {
        return currentOrder.confirmReceipt === 2 ? acc + 1 : acc;
      }, 0);
      setTotalOrderCancel(totalOrderFailed);

      const years: any = [
        ...new Set(order.map((o) => dayjs(o.createdAt).year() + 543)),
      ].sort((a, b) => a - b);
      setYearOptions(years.map((year: any) => ({ value: year, label: year })));

      const ordersByMonth = order
        .filter((x) => x.confirmReceipt === 1)
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
          year: selectedYear + 543,
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

  useEffect(() => {
    if (order) {
      const years: any = [
        ...new Set(order.map((o) => dayjs(o.createdAt).year() + 543)),
      ].sort((a, b) => a - b);
      setYearOptions(years.map((year: any) => ({ value: year, label: year })));

      const ordersByYearAndMonth = order
      .filter((x) => x.confirmReceipt === 1)
      .reduce((acc: any, currentOrder) => {
        const month = dayjs(currentOrder.createdAt).format("MMMM");
        const year = dayjs(currentOrder.createdAt).year() + 543; 
        const key = `${month}-${year}`;
    
        const orderTotal = currentOrder.orderItems.reduce(
          (itemAcc, orderItem) =>
            itemAcc + orderItem.quantity * orderItem.product.price,
          0
        );
    
        if (!acc[key]) {
          acc[key] = { month, year, total: 0 };
        }
    
        acc[key].total += orderTotal;
    
        return acc;
      }, {});
    
    const monthlyData:any = Object.values(ordersByYearAndMonth);
    monthlyData.sort(
      (a: any, b: any) =>
        dayjs(`${a.month} ${a.year - 543}`).valueOf() -
        dayjs(`${b.month} ${b.year - 543}`).valueOf()
    );
    setMonthlyAndYearOrderData(monthlyData);
    }
  }, [order, selectedYear]);

  console.log("Ordersss", order);

  const handleYearChange = (selectedOption: any) => {
    setSelectedYear(selectedOption.value - 543);
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
      .filter((x) => x.confirmReceipt === 1)
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
      { header: "รายการ", key: "item", width: 40 },
      { header: "ข้อมูล", key: "value", width: 20 },
      { header: "หน่วย", key: "unit", width: 15 },
    ];
  
    worksheet.getRow(1).font = { bold: true, size: 14, color: { argb: "FFFFFF" }};
    worksheet.getRow(1).alignment = { horizontal: "center", vertical: "middle" };
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
        cell.alignment = { vertical: "middle", horizontal: colIndex === 2 ? "center" : "left" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    };
  
    addStyledRow({
      item: "ยอดเงินรวมที่ซื้อ",
      value: totalPrice,
      unit: "บาท",
    });
  
    addStyledRow({
      item: "จำนวนสินค้าที่ซื้อ",
      value: totalQuantity,
      unit: "ชิ้น",
    });
  
    addStyledRow({
      item: "คำสั่งซื้อที่สำเร็จ",
      value: totalOrderSuccess,
      unit: "ครั้ง",
    });
  
    addStyledRow({
      item: "คำสั่งซื้อที่ยกเลิก",
      value: totalOrderCancel,
      unit: "ครั้ง",
    });
  
    // worksheet.addRow({});
    // addStyledRow({ item: "ยอดคำสั่งซื้อในแต่ละเดือน", value: "", unit: "" });
    // monthlyAndYearOrderData.forEach((monthData: any) => {
    //   addStyledRow({
    //     item: `${monthData.month} ${monthData.year}`,
    //     value: monthData.total,
    //     unit: "บาท",
    //   });
    // });

    worksheet.addRow({ item: "ยอดคำสั่งซื้อในแต่ละเดือน", value: "" });
    monthlyAndYearOrderData.forEach((monthData:any) => {
      worksheet.addRow({ item: `ปี ${monthData.year}`, value: "" }); 
      addStyledRow({
        item: `${monthData.month}`,
        value: monthData.total,
        unit: "บาท",
      });
    });
  
    worksheet.addRow({});
    addStyledRow({ item: "สัดส่วนการใช้จ่ายในแต่ละหมวดหมู่สินค้า", value: "", unit: "" });
  
    pieChartData.forEach((categoryData: any) => {
      addStyledRow({
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
      <div className="FontPublic">
        <div className="mt-2 md:pt-5 sm:pt-5 relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          <a className="flex md:w-48 lg:w-44 h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80">
            <div className="flex flex-row items-center justify-center">
              <FaDollarSign size={20}/>
              <span className="font-bold text-gray-600">
                <MyContent name={totalPrice.toLocaleString()} fontSize="small" />
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              <p className=" md:text-sm">
                <MyContent name="ยอดเงินรวมที่ซื้อ" fontSize="small" />
                </p>
            </div>
          </a>

          <a className="flex md:w-48 lg:w-44 h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80">
            <div className="flex flex-row items-center justify-center">
              <FaShoppingCart size={20} className="mr-2"/>
              <span className="font-bold text-gray-600">
                <MyContent name={totalQuantity} fontSize="small" />
                </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              <p className=" md:text-sm">
                <MyContent name="จำนวนสินค้าที่ซื้อ" fontSize="small" />
                </p>
            </div>
          </a>

          <a className="flex md:w-48 lg:w-44 h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80">
            <div className="flex flex-row items-center justify-center">
              <FaCheckCircle  size={20} className="mr-2"/>
              <span className="font-bold text-gray-600">
                <MyContent name={totalOrderSuccess} fontSize="small" />
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              <p className=" md:text-sm">
                <MyContent name="คำสั่งซื้อที่สำเร็จ" fontSize="small" />
              </p>
            </div>
          </a>

          <a className=" flex md:w-48 lg:w-44 h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80">
            <div className="flex flex-row items-center justify-center">
              <FaTimesCircle size={20} className="mr-2"/>
              <span className="font-bold text-gray-600">
                <MyContent name={totalOrderCancel} fontSize="small" />
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              <p className=" md:text-sm">
                <MyContent name="คำสั่งซื้อที่ยกเลิก" fontSize="small" />
                </p>
            </div>
          </a>

          {order?.filter((x) => x.confirmReceipt === 1).length ? (
            <button
              onClick={toggleDropdown}
              className="absolute -top-5 -right-2 p-2 bg-blue-500 text-white rounded-md sm:-top-7 lg:-top-5"
            >
              <BiDownload />
            </button>
          ) : null}

          {openDropdown && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-20">
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
        </div>

        {modal && (
          <div>
            <div className="FontPublic modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
              <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />
              <div
                ref={componentRef}
                className="modal-container bg-white  rounded shadow-lg z-50 overflow-y-auto"
              >
                <button
                  onClick={closeModal}
                  id="closeButton"
                  className="absolute top-16 right-3 text-red-600 hover:text-red-800 z-500 w-56"
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
                      className="flex h-28 w-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                    >
                      <div className="flex flex-row items-center justify-center">
                      <FaDollarSign size={20} />
                        <span className="font-bold text-gray-600">
                          {totalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-400">
                        ยอดเงินรวมที่ซื้อ
                      </div>
                    </a>
                    <a
                      className="flex h-28 w-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                    >
                      <div className="flex flex-row items-center justify-center">
                      <FaShoppingCart size={20} className="mr-2"/>
                        <span className="font-bold text-gray-600">
                          {totalQuantity}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-400">
                        จำนวนสินค้าที่ซื้อ
                      </div>
                    </a>

                    <a
                      className="flex h-28 w-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                    >
                      <div className="flex flex-row items-center justify-center">
                      <FaCheckCircle  size={20} className="mr-2"/>
                        <span className="font-bold text-gray-600">
                          {totalOrderSuccess}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-400">
                        คำสั่งซื้อที่สำเร็จ
                      </div>
                    </a>

                    <a
                      className="flex h-28 w-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80"
                    >
                      <div className="flex flex-row items-center justify-center">
                      <FaTimesCircle size={20} className="mr-2"/>
                        <span className="font-bold text-gray-600">
                          {totalOrderCancel}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-400">
                        คำสั่งซื้อที่ยกเลิก
                      </div>
                    </a>
                  </div>

                  <div className="w-full">
                    <div className="grid grid-cols-4 gap-2 mt-5">
                      <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow p-2">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">
                          <MyContent
                            name="แสดงจำนวนคำสั่งซื้อในแต่ละเดือน"
                            fontSize="small"
                          />
                          </p>
                          <div className="flex items-center -ml-3">
                            <p className="mr-1 text-sm">ปี :</p>
                            {selectedYear + 543}
                          </div>
                        </div>
                        <div className="p-2">
                          <ReactECharts
                            option={option}
                            style={{ height: "200px", width: "370px" }}
                          />
                        </div>
                      </div>

                      <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow p-2">
                        <div>
                          <p className="font-medium text-sm">
                          <MyContent
                            name="สัดส่วนการใช้จ่ายในแต่ละหมวดหมู่สินค้า"
                            fontSize="small"
                          />
                          </p>
                        </div>
                        <div className="p-2">
                          <ReactECharts
                            option={pieOption}
                            style={{ height: "200px", width: "360px" }}
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

        <div className="w-full ml-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <div className="col-span-1 md:col-span-2  bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-2 flex justify-between items-center font-semibold">
                <MyContent
                  name="แสดงจำนวนคำสั่งซื้อในแต่ละเดือน"
                  fontSize="small"
                />
                {order?.filter((x) => x.confirmReceipt === 1).length > 0 ? (
                  <div className="flex items-center">
                    <p className="mr-2">ปี :</p>
                    <Select
                      options={yearOptions}
                      value={yearOptions.find(
                        (option: any) => option.value === selectedYear + 543
                      )}
                      onChange={handleYearChange}
                      placeholder="Select Year"
                      className="w-32 z-40"
                    />
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="p-2 -mt-10">
                {order?.filter((x) => x.confirmReceipt === 1).length > 0 ? (
                  <div>
                    <ReactECharts
                      option={option}
                      style={{ height: "300px", width: "100%" }}
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-80">
                    <p className="text-4xl font-medium">ไม่มีข้อมูล</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-2 -mb-3">
                <p className="font-semibold">
                <MyContent
                  name="สัดส่วนการใช้จ่ายในแต่ละหมวดหมู่สินค้า"
                  fontSize="small"
                />
                </p>
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
    </div>
  );
});
