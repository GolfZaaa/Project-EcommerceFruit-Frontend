import React, { useRef } from "react";
import { Order } from "../../../models/Order";
import { OrderItem } from "../../../models/OrderItem";
import { formatNumberWithCommas } from "../../../helper/components";
import { Typography, CardActions, Button, Grid } from "@mui/material";
import { pathImages } from "../../../constants/RoutePath";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { BsFillPrinterFill } from "react-icons/bs";
import { useStore } from "../../../store/store";
import Swal from "sweetalert2";
import TotalPrice from "./TotalPrice";

interface props {
  order: Order[];
  index: number;
}

const MyOrderCard = ({ order, index }: props) => {
  const { changeConfirmReceiptOrder } = useStore().orderStore;
  const { systemSetting } = useStore().systemSettingStore;
  const componentRef = useRef(null);

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

  const handleConfirm = (values: any) => {
    Swal.fire({
      title: "ท่านแน่ใจหรือไม่ว่าต้องการรับหิ้ว?",
      text: "หากยืนยันแล้ว ท่านจะสามารถดูรายการได้ใน ข้อมูลส่วนตัว",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "รับหิ้วเรียบร้อยแล้ว",
          "ท่านรับหิ้วเรียบร้อยแล้ว",
          "success"
        );

        changeConfirmReceiptOrder(values);
      }
    });
  };

  return (
    <div ref={componentRef}>
      <div className="flex justify-between">
        <div>
          <Typography variant="h5">จำนวน {order.length}</Typography>
        </div>
        <div>
          <button
            id="downloadButton"
            onClick={generatePDF}
            className=" p-2 bg-blue-500 text-white rounded-md"
          >
            <BsFillPrinterFill />
          </button>
        </div>
      </div>

      {order.map((item) => {
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
                    (item.confirmReceipt === 2
                      ? "red-500"
                      : item.status === 0
                      ? "yellow-500"
                      : item.status === 1
                      ? "green-500"
                      : item.status === 2
                      ? "red-500"
                      : "gray-500")
                  }
                  // className="text-lg font-semibold text-gray-900 dark:text-red-500"
                >
                  สถานะ :{" "}
                  {item.confirmReceipt === 2
                    ? "ยกเลิกโดยคุณ"
                    : item.status === 0
                    ? "กำลังรออนุมัติ"
                    : item.status === 1
                    ? "ยืนยันคำสั่งซื้อแล้ว"
                    : item.status === 2
                    ? "ยกเลิกคำสั่งซื้อแล้ว"
                    : "เพิ่มสถานะด้วย"}
                  <div>
                    {item.confirmReceipt === 1 && "ได้รับสินค้าแล้ว"}
                    {(item.status === 2 && "ยกเลิกแล้ว โดยร้านค้า") ||
                      (item.confirmReceipt === 2 && "ยกเลิกแล้ว โดยคุณ")}
                  </div>
                </span>
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
              ShippingFee={
                item?.shippings[0]?.shippingFee !== undefined
                  ? item?.shippings[0]?.shippingFee
                  : systemSetting[0]?.shippingCost
              }
            />

            {index === 4 && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {/* <Typography align="center" color={"red"}>
              * โปรดใส่หมายเลขพัสดุก่อนยืนยันคำสั่งซื้อ
            </Typography> */}

                  <CardActions sx={{ justifyContent: "center" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      size="large"
                      fullWidth
                      // disabled={
                      //   !trackingId || dataEdit?.status == 1 || dataEdit?.status == 2
                      // }
                      onClick={() =>
                        handleConfirm({ orderId: item.id, status: 1 })
                      }
                    >
                      ได้รับสินค้าแล้ว
                    </Button>
                  </CardActions>
                </Grid>
                <Grid item xs={6}>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <Button
                      onClick={() =>
                        handleConfirm({ orderId: item.id, status: 2 })
                      }
                      variant="contained"
                      color="error"
                      size="large"
                      fullWidth
                      // disabled={dataEdit?.status == 1 || dataEdit?.status == 2}
                    >
                      ไม่ได้รับสินค้า
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyOrderCard;
