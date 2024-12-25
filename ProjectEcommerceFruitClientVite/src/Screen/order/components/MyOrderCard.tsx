import React, { useRef, useState } from "react";
import { Order } from "../../../models/Order";
import { OrderItem } from "../../../models/OrderItem";
import { formatNumberWithCommas } from "../../../helper/components";
import { Typography, CardActions, Button, Grid } from "@mui/material";
import { pathImages, RoutePath } from "../../../constants/RoutePath";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { BsFillPrinterFill } from "react-icons/bs";
import { useStore } from "../../../store/store";
import Swal from "sweetalert2";
import TotalPrice from "./TotalPrice";
import { RiFileExcel2Line } from "react-icons/ri";
import { BiDownload } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import ExcelJS from "exceljs";
import MyContent from "../../../component/MyContent";
import { useNavigate } from "react-router-dom";
import { resetScroll } from "../../../api/agent";
import ModalImageToSend from "./ModalImageToSend";
import MyLottie from "../../../helper/components/MyLottie";
import lottiteEmpty from "../../../assets/lotties/lf20_qh5z2fdq.json";

interface props {
  order: Order[];
  index: number;
}

const MyOrderCard = ({ order, index }: props) => {
  const navigate = useNavigate();

  const { changeConfirmReceiptOrder, RefundOrder} = useStore().orderStore;
  const { systemSetting } = useStore().systemSettingStore;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const componentRef = useRef(null);
  function generatePDF() {
    setIsGeneratingPDF(true);
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
      setOpenDropdown(false);
    }

    html2pdf()
      .from(componentRef.current)
      .set(opt)
      .save()
      .then(() => {
        setIsGeneratingPDF(false);
        if (downloadButton) {
          downloadButton.style.display = "block";
        }
      });
  }

  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Order Data");

    worksheet.columns = [
      { header: "รหัสคำสั่งซื้อ", key: "orderId", width: 20 },
      { header: "สถานะ", key: "status", width: 30 },
      { header: "รหัสสินค้า", key: "productId", width: 15 },
      { header: "หมวดหมู่", key: "category", width: 20 },
      { header: "ชื่อสินค้า", key: "productName", width: 30 },
      { header: "จำนวน", key: "quantity", width: 10 },
      { header: "ราคา", key: "price", width: 15 },
      { header: "ราคารวม", key: "totalPrice", width: 15 },
      { header: "หน่วย", key: "baht", width: 15 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 14, color: { argb: "FFFFFF" } };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
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

    let grandTotalPrice = 0;
    let grandTotalQuantity = 0;

    order.forEach((orderItem) => {
      let statusText = "";
      if (orderItem.confirmReceipt === 2) {
        statusText = "ยกเลิกโดยคุณ";
      } else if (orderItem.status === 0) {
        statusText = "กำลังรออนุมัติ";
      } else if (orderItem.status === 1) {
        statusText = "ยืนยันคำสั่งซื้อแล้ว";
      } else if (orderItem.status === 2) {
        statusText = "ยกเลิกคำสั่งซื้อแล้ว";
      } else if (orderItem.status === 5) {
        statusText = "คืนเงินสำเร็จ";
      }else {
        statusText = "สถานะไม่ระบุ";
      }

      if (orderItem.confirmReceipt === 1 && orderItem.status === 1) {
        statusText += " | ได้รับสินค้าแล้ว";
      }
      if (orderItem.status === 2) {
        statusText += " | ยกเลิกแล้ว โดยร้านค้า";
      } else if (orderItem.confirmReceipt === 2) {
        statusText += " | ยกเลิกแล้ว โดยคุณ";
      }

      orderItem.orderItems.forEach((orderProductItem) => {
        const totalProductPrice =
          orderProductItem.product.price * orderProductItem.quantity + 50;
        grandTotalPrice += totalProductPrice;
        grandTotalQuantity += orderProductItem.quantity;

        const row = worksheet.addRow({
          orderId: orderItem.orderId,
          status: statusText,
          productId: orderProductItem.product.id,
          category: orderProductItem.product.productGI.category.name,
          productName: orderProductItem.product.productGI.name,
          quantity: orderProductItem.quantity,
          price: orderProductItem.product.price,
          totalPrice: totalProductPrice,
          baht: "บาท",
        });

        row.eachCell((cell, colIndex) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: colIndex >= 7 ? "right" : "left",
          };
        });
      });
    });

    worksheet.addRow({});
    const summaryRow = worksheet.addRow({
      productName: "รวมทั้งหมด",
      quantity: grandTotalQuantity,
      totalPrice: grandTotalPrice,
      baht: "บาท",
    });

    summaryRow.font = { bold: true };
    summaryRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD966" },
      };
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

  const handleConfirm = (values: any) => {
    Swal.fire({
      title: "แน่ใจหรือไม่ว่าได้รับสินค้าแล้ว?",
      text: "หากยืนยันแล้ว ผู้ใช้จะสามารถดูรายการได้ใน ข้อมูลส่วนตัว",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "ได้รับสินค้าเรียบร้อยแล้ว",
          "ได้รับสินค้าเรียบร้อยแล้ว",
          "success"
        );

        changeConfirmReceiptOrder(values);
      }
    });
  };

    const handleRefund = (orderId:any) => {
      console.log("orderId",orderId)
      Swal.fire({
        title: "ท่านแน่ใจหรือไม่ว่าต้องคืนเงิน?",
        text: "หากยืนยันแล้ว ท่านจะสามารถดูรายการได้ใน ข้อมูลส่วนตัว",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#cb091c",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            "คืนเงินสำเร็จ",
            "ท่านได้ทำการคืนเงินสำเร็จ",
            "success"
          );
          RefundOrder(orderId)
          
        }
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
          <Typography variant="h5">
            <p className="FontPublic">
              <MyContent name={`จำนวน ${order.length}`} fontSize="normal" />
            </p>
          </Typography>
        </div>
        <div>
          {order.length > 0 && (
            <button
              onClick={toggleDropdown}
              id="downloadButton"
              className=" p-2 bg-blue-500 text-white rounded-md"
            >
              <BiDownload />
            </button>
          )}

          {openDropdown && (
            <div className="absolute right-12 -mt-2 bg-white border rounded shadow-md w-20">
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
        </div>
      </div>
      {order.length ? (
        <div>
          {order.map((item) => {
            const calculateTotalPrice = () => {
              return item?.orderItems?.reduce((total, item: OrderItem) => {
                total = item.product.price * item.quantity + total;

                return total;
              }, 0);
            };

            const totalPrice: any = calculateTotalPrice();
            const formattedTotalPrice = formatNumberWithCommas(totalPrice);

            // console.log("image : ", item?.shippings[0]?.sendedOrderImage);

            return (
              <div className="FontPublic mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
                <div className="space-y-4">
                  <div className="md:flex md:justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                      รหัสคำสั่งซื้อ : {item.orderId}
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                      ชำระเงินโดย :{" "}
                      {item.paymentImage ? "การโอนเงิน" : "เครดิตการ์ด"}
                    </span>
                  </div>

                  <div className="md:flex md:justify-between">
                    <div>
                      {item.shippingType !== "อื่น ๆ" &&
                        item.shippingType !== null &&
                        item.status !== 2 && (
                          <div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                              {item.shippingType !== "อื่น ๆ" &&
                                item.shippingType}
                            </span>
                            <div>
                              <span className="text-lg text-gray-900 dark:text-gray-900">
                                หมายเลขติดตามพัสดุ {item.tag}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>

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
                          : item.status === 5
                          ? "violet-500"
                          : "gray-500")
                      }
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
                        : item.status === 5
                        ? "คืนเงินสำเร็จ"
                        : "เพิ่มสถานะด้วย"}
                      <div>
                        {item.confirmReceipt === 1 && item.status === 1 && "ได้รับสินค้าแล้ว"}
                        {(item.status === 2 && "ยกเลิกแล้ว โดยร้านค้า") ||
                          (item.confirmReceipt === 2 && "ยกเลิกแล้ว โดยคุณ")}
                      </div>
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
                        className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-white"
                      >
                        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                          <a
                            onClick={() => {
                              navigate(
                                RoutePath.productDetail(String(item.product.id))
                              );
                              resetScroll();
                            }}
                            className="shrink-0 md:order-1"
                          >
                            {isGeneratingPDF ? (
                              <a
                                href={pathImages.product + item.product.images}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <p
                                  style={{
                                    fontSize: 16,
                                    fontWeight: 500,
                                    color: "#0400ff",
                                    textDecoration: "underline",
                                    padding: 30,
                                  }}
                                >
                                  ดูรูปภาพ
                                </p>
                              </a>
                            ) : (
                              <img
                                className="hidden h-20 w-20 dark:block object-cover"
                                src={pathImages.product + item.product.images}
                                alt={item.product.images || "product image"}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            )}
                          </a>
                          <label className="sr-only">Choose quantity:</label>
                          <div className="flex items-center justify-between md:order-3 md:justify-end">
                            <div className="flex items-center">
                              <p className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-gray-800">
                                <MyContent
                                  name={item.quantity}
                                  fontSize="small"
                                />
                              </p>
                            </div>
                            <div className="text-end md:order-4 md:w-32">
                              <p className="text-base font-bold text-gray-900 dark:text-gray-900">
                                <MyContent
                                  name={`${formatTotalPriceForProduct} บาท`}
                                  fontSize="small"
                                />
                              </p>
                            </div>
                          </div>

                          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <p className="text-sm text-gray-500 font-bold">
                              <MyContent
                                name={item.product.productGI.category.name}
                                fontSize="small"
                              />
                            </p>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-800">
                              <MyContent
                                name={item.product.productGI.name}
                                fontSize="small"
                              />
                            </p>
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
                
                {item.status === 1 && item.confirmReceipt === 1 && 
                 <div className="flex justify-center items-center mt-4">
                 <button
                  onClick={() => handleRefund(item.id)}
                   className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out"
                 >
                   ขอคืนเงิน
                 </button>
               </div>
                  }

                {index === 3 && (
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={6} md={4}>
                      <CardActions>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          size="large"
                          fullWidth
                          onClick={() =>
                            handleConfirm({ orderId: item.id, status: 1 })
                          }
                          disabled={
                            item.shippingType !== "อื่น ๆ"
                              ? false
                              : !item?.shippings[0]?.sendedOrderImage
                          }
                        >
                          ได้รับสินค้าแล้ว
                        </Button>
                      </CardActions>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      {!!item?.shippings[0]?.sendedOrderImage ? (
                        <CardActions
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          <ModalImageToSend
                            image={
                              pathImages.sendedOrder +
                              item?.shippings[0]?.sendedOrderImage
                            }
                          />
                        </CardActions>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 25,
                            }}
                          >
                            กำลังจัดส่ง
                          </div>
                        </div>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <CardActions>
                        <Button
                          onClick={() =>
                            handleConfirm({ orderId: item.id, status: 2 })
                          }
                          variant="contained"
                          color="error"
                          size="large"
                          fullWidth
                          disabled={
                            item.shippingType !== "อื่น ๆ"
                              ? false
                              : !item?.shippings[0]?.sendedOrderImage
                          }
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
      ) : (
        <div>
          <MyLottie lottieFile={lottiteEmpty} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 30,
            }}
          >
            ไม่มีข้อมูล
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrderCard;
