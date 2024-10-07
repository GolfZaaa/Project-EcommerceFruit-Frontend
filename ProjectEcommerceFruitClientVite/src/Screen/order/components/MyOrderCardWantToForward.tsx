import React, { useRef, useState } from "react";
import { DriverHistory, Order } from "../../../models/Order";
import { OrderItem } from "../../../models/OrderItem";
import { formatNumberWithCommas } from "../../../helper/components";
import { pathImages } from "../../../constants/RoutePath";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { BsFillPrinterFill } from "react-icons/bs";
import { Card, Fab, Grid, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import TotalPrice from "./TotalPrice";
import { useStore } from "../../../store/store";
import Divider from "@mui/material/Divider";
import CheckIcon from "@mui/icons-material/Check";

interface props {
  order: Order[];
  index: number;
}

const MyOrderCardWantToForward = ({ order }: props) => {
  const { user } = useStore().userStore;
  const { confirmOrderToForward } = useStore().orderStore;
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

  const handleConfirm = (
    driverId: number,
    shippingId: number,
    shippingFee: number
  ) => {
    Swal.fire({
      title: "ท่านแน่ใจหรือไม่ว่าต้องการส่งต่อคำสั่งซื้อ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      input: "number",
      inputValidator: (value) => {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) {
          return "กรุณาใส่จำนวนเงินที่เป็นตัวเลข!";
        } else if (numberValue < 0) {
          return "จำนวนเงินต้องไม่ติดลบ!";
        } else if (numberValue > shippingFee) {
          return "เงินเกินจำนวนที่กำหนด!";
        }
        return null;
      },
      inputLabel: "กรุณาใส่จำนวนเงินค่าจัดส่ง ไม่เกิน " + shippingFee,
      inputPlaceholder: "กรุณาใส่จำนวนเงินค่าจัดส่ง ไม่เกิน " + shippingFee,
      inputAttributes: {
        autocapitalize: "off",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "ส่งต่อคำสั่งซื้อเรียบร้อยแล้ว",
          "ท่านส่งต่อคำสั่งซื้อเรียบร้อยแล้ว",
          "success"
        );

        await confirmOrderToForward({
          driverId: driverId,
          shippingId: shippingId,
          shippingFee: parseFloat(result.value),
        });
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

      {order.length ? (
        <>
          {order.map((item) => {
            const status = item?.shippings[0]?.shippingStatus;

            const calculateTotalPrice = () => {
              return item?.orderItems?.reduce((total, item: OrderItem) => {
                total = item.product.price * item.quantity + total;

                return total;
              }, 0);
            };

            const myDriverFee = item.shippings[0].driverHistories.find(
              (x) => x.userId === user?.id
            );

            const totalPrice: any = calculateTotalPrice();
            const formattedTotalPrice = formatNumberWithCommas(totalPrice);

            return (
              <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
                <div className="space-y-4">
                  <div className="md:flex md:justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                      รหัสคำสั่งซื้อ : {item.orderId}
                    </span>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-base leading-4 text-gray-800">
                        {/* ได้รับค่าจัดส่ง : {item?.shippings[0]?.shippingFee} บาท */}
                        ได้รับค่าจัดส่ง : {myDriverFee?.shippingFee} บาท
                      </p>
                    </div>
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
                        : "เพิ่มสถานะด้วย"}
                    </span>
                  </div>

                  {item.orderItems.map((item: OrderItem) => {
                    const TotalPriceForProduct =
                      item.product.price * item.quantity;
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

                <Divider
                  style={{
                    margin: "30px 0 20px 0",
                  }}
                />

                <div>
                  <b className="text-xl">ผู้จัดส่งที่ร้องขอการจัดส่งต่อ</b>
                  {item?.shippings[0].driverHistories.map((driver) => {
                    const mydriver: any =
                      item?.shippings[0].driverHistories.find(
                        (x) => x.userId === user?.id
                      );

                    return (
                      driver.userId !== user?.id &&
                      driver.statusDriver === 4 && (
                        <Card
                          style={{
                            margin: "30px 0 30px 0",
                            padding: "30px 30px 25px 30px",
                          }}
                        >
                          <Grid key={driver.id} container spacing={2}>
                            <Grid item xs={4}>
                              <Typography variant="h5">
                                ชื่อ : {driver.user.fullName}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="h5">
                                เบอร์ : {driver.user.phoneNumber}
                              </Typography>
                            </Grid>
                            <Grid item xs={4} textAlign="end">
                              <Fab
                                variant="extended"
                                color="primary"
                                onClick={() =>
                                  handleConfirm(
                                    driver.id,
                                    item?.shippings[0].id,
                                    mydriver.shippingFee
                                  )
                                }
                              >
                                <CheckIcon sx={{ mr: 1 }} />
                                ส่งต่อ
                              </Fab>
                            </Grid>
                          </Grid>
                        </Card>
                      )
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "30px",
            color: "red",
          }}
        >
          ไม่มีคำร้องขอส่งต่อคำสั่งซื้อ
        </div>
      )}
    </div>
  );
};

export default MyOrderCardWantToForward;
