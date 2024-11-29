import React, { useRef, useState } from "react";
import { Order } from "../../../models/Order";
import { OrderItem } from "../../../models/OrderItem";
import { formatNumberWithCommas } from "../../../helper/components";
import { pathImages, RoutePath } from "../../../constants/RoutePath";
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
import MyContent from "../../../component/MyContent";
import { useNavigate } from "react-router-dom";
import { resetScroll } from "../../../api/agent";

interface props {
  order: Order[];
  index: number;
}

const MyOrderCardToSend = ({ order, index }: props) => {
  const navigate = useNavigate();

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

    let totalPrice = 0;
    let totalQuantity = 0;
    let totalOrderSuccess = 0;
    let totalOrderCancel = 0;
    let totalShippingFee = 0;

    addStyledRow({
      item: "จำนวนรายการ",
      value: order.length,
      unit: "รายการ",
    });

    order.forEach((item) => {
      const orderTotalPrice = item.orderItems.reduce((sum, item: OrderItem) => {
        return sum + item.product.price * item.quantity;
      }, 0);

      const orderTotalQuantity = item.orderItems.reduce(
        (sum, item: OrderItem) => {
          return sum + item.quantity;
        },
        0
      );

      totalPrice += orderTotalPrice;
      totalQuantity += orderTotalQuantity;

      const myDriverFee =
        item.shippings[0]?.driverHistories.find((x) => x.userId === user?.id)
          ?.shippingFee || 0;
      totalShippingFee += myDriverFee;

      if (item.shippings[0]?.shippingStatus === 1) {
        totalOrderSuccess += 1;
      } else if (item.shippings[0]?.shippingStatus === 2) {
        totalOrderCancel += 1;
      }

      addStyledRow({
        orderId: item.orderId,
        item: "ค่าจัดส่งจากผู้จัดส่ง",
        value: myDriverFee,
        unit: "บาท",
      });

      addStyledRow({
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
    <div ref={componentRef} className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Typography variant="h5">
          <p className="FontPublic font-semibold">
            <MyContent name={`จำนวน ${order.length}`} fontSize="normal" />
          </p>
        </Typography>

        {order.length > 0 && (
          <button
            onClick={toggleDropdown}
            className="p-2 bg-blue-500 text-white rounded-md mt-4 md:mt-0"
          >
            <BiDownload />
          </button>
        )}
      </div>

      {openDropdown && (
        <div className="absolute right-4 mt-2 bg-white border rounded shadow-md w-28">
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

      {select.length > 0 && (
        <Grid
          container
          spacing={2}
          style={{
            marginTop: 15,
            marginBottom: 35,
            zIndex: 1,
            position: "relative",
          }}
        >
          <Grid item xs={7.6}>
            <Typography variant="h5">
              <MyContent
                name={`จำนวนที่เลือก ${select.length}`}
                fontSize="normal"
              />
            </Typography>
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
              <MyContent name="ยืนยันการส่ง" fontSize="smaller" />
            </Fab>
          </Grid>
        </Grid>
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
          <div
            key={item.orderId}
            className="mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <span className="text-lg font-semibold text-gray-900">
                รหัสคำสั่งซื้อ : {item.orderId}
              </span>
              <span
                className={`text-lg font-semibold text-${
                  status === 0
                    ? "yellow-500"
                    : status === 1
                    ? "green-500"
                    : status === 2
                    ? "red-500"
                    : "gray-500"
                }`}
              >
                สถานะ :{" "}
                {status === 0
                  ? "กำลังจัดส่ง"
                  : status === 1
                  ? "จัดส่งสำเร็จ"
                  : status === 2
                  ? "จัดส่งไม่สำเร็จ"
                  : "เพิ่มสถานะด้วย"}{" "}
                {!!myDriver && "(ส่งต่อให้ผู้จัดส่งคนอื่นแล้ว)"}
              </span>
              <p className="text-base leading-4 text-gray-800">
                <MyContent
                  name={`ได้รับค่าจัดส่ง : ${myDriverFee?.shippingFee} บาท`}
                  fontSize="small"
                />
              </p>
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

            {item.orderItems.map((orderItem) => {
              const TotalPriceForProduct =
                orderItem.product.price * orderItem.quantity;
              const formatTotalPriceForProduct =
                formatNumberWithCommas(TotalPriceForProduct);

              return (
                <div
                  key={orderItem.product.id}
                  className="mt-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm flex flex-col md:flex-row justify-between items-center"
                >
                  <a
                    onClick={() => {
                      navigate(
                        RoutePath.productDetail(String(orderItem.product.id))
                      );
                      resetScroll();
                    }}
                    className="cursor-pointer"
                  >
                    <img
                      className="h-20 w-20 object-cover"
                      src={pathImages.product + orderItem.product.images}
                      alt={orderItem.product.images || "product image"}
                    />
                  </a>
                  <p className="text-sm font-bold text-gray-500 mt-2 md:mt-0">
                    {orderItem.product.productGI.category.name}
                  </p>
                  <a className="text-base font-medium text-gray-900 hover:underline mt-1 md:mt-0">
                    {orderItem.product.productGI.name}
                  </a>
                  <div className="text-center md:w-20 font-semibold text-gray-900">
                    {orderItem.quantity}
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {formatTotalPriceForProduct} บาท
                  </p>
                </div>
              );
            })}

            <TotalPrice
              formattedTotalPrice={parseFloat(formattedTotalPrice)}
              ShippingFee={item?.shippings[0]?.shippingFee}
            />

            <div className="mt-4 ">
              <Grid container spacing={2} className="p-4">
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    fontSize={{ xs: 18, sm: 20, md: 22 }}
                    fontWeight="bold"
                  >
                    <p className="FontPublic">
                      <MyContent
                        name={`ชื่อ-ที่อยู่ลูกค้า : ${item?.address?.user?.fullName}`}
                        fontSize="littlenormal"
                      />
                    </p>
                  </Typography>
                </Grid>

                <Grid container item xs={12} spacing={2} className="mt-4">
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
                      <p className="FontPublic">
                        <MyContent
                          name={`เบอร์ : ${item?.address?.user?.phoneNumber}`}
                          fontSize="small"
                        />
                      </p>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
                      <p className="FontPublic">
                        <MyContent
                          name={`บ้านเลขที่ : ${item?.address?.detail}`}
                          fontSize="small"
                        />
                      </p>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
                      <p className="FontPublic">
                        <MyContent
                          name={`แขวง/ตำบล : ${item?.address?.subDistrict}`}
                          fontSize="small"
                        />
                      </p>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
                      <p className="FontPublic">
                        <MyContent
                          name={`เขต/อำเภอ : ${item?.address?.district}`}
                          fontSize="small"
                        />
                      </p>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
                      <p className="FontPublic">
                        <MyContent
                          name={`จังหวัด : ${item?.address?.province}`}
                          fontSize="small"
                        />
                      </p>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
                      <p className="FontPublic">
                        <MyContent
                          name={`รหัสไปรษณีย์ : ${item?.address?.postCode}`}
                          fontSize="small"
                        />
                      </p>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrderCardToSend;
