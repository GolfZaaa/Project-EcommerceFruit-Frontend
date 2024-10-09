import React, { useRef, useState } from "react";
import { Order } from "../../../models/Order";
import { OrderItem } from "../../../models/OrderItem";
import { formatNumberWithCommas } from "../../../helper/components";
import { pathImages } from "../../../constants/RoutePath";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { BsFillPrinterFill } from "react-icons/bs";
import { Fab, Grid, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useStore } from "../../../store/store";
import Swal from "sweetalert2";
import TotalPrice from "./TotalPrice";
import ExcelJS from "exceljs";
import { BiDownload } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Line } from "react-icons/ri";

interface props {
  order: Order[];
  index: number;
}

const MyOrderCardToSend = ({ order, index }: props) => {
  const componentRef = useRef(null);
  const { changeConfirmSendOrder } = useStore().orderStore;
  const { user } = useStore().userStore;

  const [select, setSelect] = useState<any[]>([]);

  function generatePDF() {
    const opt = {
      margin: 0.2,
      filename: "reportOrderAll.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const downloadButton: any = document.querySelector("#downloadButton");

    if (downloadButton) {
      downloadButton.style.display = "none";
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

  const onSelect = (id: number) => {
    if (select.find((x) => x === id) !== undefined) {
      setSelect(select.filter((x) => x !== id));
    } else {
      setSelect([...select, id]);
    }
  };

  const handleConfirm = () => {
    Swal.fire({
      title: "ท่านแน่ใจหรือไม่ว่าส่งสินค้าถึงมือลูกค้าแล้ว?",
      text: "หากยืนยันแล้ว หมายถึงสินค้าได้ส่งถึงมือลูกค้าแล้ว",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("ส่งเรียบร้อยแล้ว", "ท่านส่งสินค้าเรียบร้อยแล้ว", "success");

        changeConfirmSendOrder({ ...select.map((item) => item) });

        setSelect([]);
      }
    });
  };


  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Order Data");
  
    worksheet.columns = [
      { header: "รหัสคำสั่งซื้อ", key: "orderId", width: 30 },
      { header: "รายการ", key: "item", width: 30 },
      { header: "ข้อมูล", key: "value", width: 30 },
      { header: "หน่วย", key: "unit", width: 30 },
    ];
  
    let totalPrice = 0;
    let totalQuantity = 0;
    let totalOrderSuccess = 0;
    let totalOrderCancel = 0;
    let totalShippingFee = 0;
  
    worksheet.addRow({
      item: "จำนวนรายการ",
      value: order.length,
      unit: "รายการ",
    });
  
    order.forEach((item) => {
      const orderTotalPrice = item.orderItems.reduce((sum, item: OrderItem) => {
        return sum + item.product.price * item.quantity;
      }, 0);
  
      const orderTotalQuantity = item.orderItems.reduce((sum, item: OrderItem) => {
        return sum + item.quantity;
      }, 0);
  
      totalPrice += orderTotalPrice;
      totalQuantity += orderTotalQuantity;
  
      const myDriverFee = item.shippings[0]?.driverHistories.find(
        (x) => x.userId === user?.id
      )?.shippingFee || 0;
      totalShippingFee += myDriverFee;  
  
      if (item.shippings[0]?.shippingStatus === 1) {
        totalOrderSuccess += 1;
      } else if (item.shippings[0]?.shippingStatus === 2) {
        totalOrderCancel += 1;
      }
  
      worksheet.addRow({
        orderId: item.orderId, 
        item: "ค่าจัดส่งจากผู้จัดส่ง",
        value: myDriverFee,  
        unit: "บาท",
      });
  
      worksheet.addRow({
        item: "จำนวนสินค้าที่หิ้วทั้งหมด",
        value: totalQuantity,
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
      a.download = "order_data.xlsx"; 
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  
  
  
  

  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  return (
    <div ref={componentRef}>
      <div className="flex justify-between">
        <div>
          <Typography variant="h5">จำนวน {order.length}</Typography>
        </div>

        {order.length > 0 &&
        <div>
        <button
            onClick={toggleDropdown}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            <BiDownload />
          </button>
      </div> 
      }
      </div>

      {openDropdown && (
            <div className="absolute right-12 -mt-1 bg-white border rounded shadow-md w-20">
              <ul>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center "
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

      {select.length ? (
        <Grid
          container
          spacing={2}
          style={{
            marginTop: 15,
            marginBottom: 35,
          }}
        >
          <Grid item xs={7.6}>
            <Typography variant="h5">จำนวนที่เลือก {select.length}</Typography>
          </Grid>
          <Grid item xs={2.7}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                className="mr-2"
                style={{
                  width: 50,
                  height: 50,
                }}
                checked={select.length === order.length}
                onChange={() =>
                  select.length === order.length
                    ? setSelect([])
                    : setSelect(order.map((item) => item.id))
                }
              />
              <Typography variant="h5" align="left">
                เลือกทั้งหมด
              </Typography>
            </div>
          </Grid>
          <Grid item xs={1.7}>
            <Fab variant="extended" color="primary" onClick={handleConfirm}>
              <EditIcon sx={{ mr: 1 }} />
              ยืนยันการส่ง
            </Fab>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}

      {order.map((item) => {
        const status = item?.shippings[0]?.shippingStatus;

        const myDriver = item.shippings[0].driverHistories.find(
          (x) => x.statusDriver === 3 && x.userId === user?.id
        );

        const myDriverFee = item.shippings[0].driverHistories.find(
          (x) => x.userId === user?.id
        );

        const calculateTotalPrice = () => {
          return item?.orderItems?.reduce((total, item: OrderItem) => {
            total = item.product.price * item.quantity + total;

            return total;
          }, 0);
        };

        const totalPrice: any = calculateTotalPrice();
        const formattedTotalPrice = formatNumberWithCommas(totalPrice);

        return (
          <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
            <div className="space-y-4">
              <div className="md:flex md:justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                  รหัสคำสั่งซื้อ : {item.orderId}
                </span>
                <span
                  className={
                    "text-lg font-semibold text-gray-900 text-" +
                    (status === 0
                      ? "yellow-500"
                      : status === 1
                      ? "green-500"
                      : status === 2
                      ? "red-500"
                      : "gray-500")
                  }
                  // className="text-lg font-semibold text-gray-900 dark:text-red-500"
                >
                  สถานะ :{" "}
                  {status === 0
                    ? "กำลังจัดส่ง"
                    : status === 1
                    ? "จัดส่งสำเร็จ"
                    : status === 2
                    ? "จัดส่งไม่สำเร็จ"
                    : "เพิ่มสถานะด้วย"}{" "}
                  {!!myDriver && "(" + "ส่งต่อให้ผู้จัดส่งคนอื่นแล้ว" + ")"}
                </span>

                <div className="flex justify-between items-center mb-3">
                  <p className="text-base leading-4 text-gray-800">
                    {/* ได้รับค่าจัดส่ง : {item?.shippings[0]?.shippingFee} บาท */}
                    ได้รับค่าจัดส่ง : {myDriverFee?.shippingFee} บาท
                  </p>
                </div>

                {index === 1 && !myDriver && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      checked={select.find((x) => x === item.id) !== undefined}
                      onChange={() => onSelect(item.id)}
                    />
                    <Typography variant="h5" align="left">
                      เลือกสินค้า
                    </Typography>
                  </div>
                )}
              </div>

              {item.orderItems.map((item: OrderItem) => {
                const TotalPriceForProduct = item.product.price * item.quantity;
                const formatTotalPriceForProduct =
                  formatNumberWithCommas(TotalPriceForProduct);

                return (
                  <div
                    key={item.product.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <a href="#" className="shrink-0 md:order-1">
                        <img
                          className="hidden h-20 w-20 dark:block"
                          src={pathImages.product + item.product.images}
                          alt={item.product.images || "product image"}
                        />
                      </a>
                      <label className="sr-only">Choose quantity:</label>
                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <p className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-gray-800">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-gray-900 dark:text-gray-900">
                            {formatTotalPriceForProduct} บาท
                          </p>
                        </div>
                      </div>

                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <p className="text-sm text-gray-500 font-bold">
                          {item.product.productGI.category.name}
                        </p>
                        <a
                          href="#"
                          className="text-base font-medium text-gray-900 hover:underline dark:text-gray-800"
                        >
                          {item.product.productGI.name}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <TotalPrice
              formattedTotalPrice={parseFloat(formattedTotalPrice)}
              ShippingFee={item?.shippings[0]?.shippingFee}
            />
            <div className="flex-1">
              <p className="text-xl leading-4 text-gray-800 font-medium">
                ชื่อ-ที่อยู่ลูกค้า : {item?.address?.user?.fullName} เบอร์ :{" "}
                {item?.address?.user?.phoneNumber} บ้านเลขที่{" "}
                {item?.address?.detail} แขวง/ตำบล
                {item?.address?.subDistrict} เขต/อำเภอ
                {item?.address?.district}
                <br />
                <div className="mt-4">
                  จังหวัด
                  {item?.address?.province} รหัสไปรษณีย์{" "}
                  {item?.address?.postCode}
                </div>
              </p>
            </div>
            {/* <div className="rounded-sm flex flex-col px-4 xl:p-6 w-full bg-white">
              <div className="flex justify-between items-center w-full mb-3">
                <p className="text-base leading-4 text-gray-800">ราคารวม</p>
                <p className="text-base leading-4 text-gray-600">
                  {formattedTotalPrice} บาท
                </p>
              </div>
              <div className="flex justify-between items-center w-full mb-3">
                <p className="text-base leading-4 text-gray-800">ค่าจัดส่ง</p>
                <p className="text-base leading-4 text-gray-600">
                  {item?.shippings[0]?.shippingFee} บาท
                </p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base font-semibold leading-4 text-gray-800">
                  ราคารวมทั้งหมด
                </p>
                <p className="text-base font-semibold leading-4 text-gray-600">
                  {parseFloat(formattedTotalPrice) +
                    item?.shippings[0]?.shippingFee}{" "}
                  บาท
                </p>
              </div>
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default MyOrderCardToSend;
