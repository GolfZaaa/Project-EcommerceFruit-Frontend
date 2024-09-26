import React, { useState } from "react";
import { pathImages } from "../../constants/RoutePath";
import { formatNumberWithCommas } from "../../helper/components";
import { OrderItem } from "../../models/OrderItem";
import { Order } from "../../models/Order";
import { useStore } from "../../store/store";
import { Fab, Grid, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Address } from "../../models/Address";
import Swal from "sweetalert2";

interface OrderToReceipt {
  order: Order;
  address: Address;
}

const MyCardOrderReceipt = ({ data }: { data: OrderToReceipt[] }) => {
  const { systemSetting } = useStore().systemSettingStore;
  const { createOrderToReceipt } = useStore().orderStore;

  const [select, setSelect] = useState<any[]>([]);

  const onSelect = (id: number) => {
    if (select.find((x) => x === id) !== undefined) {
      setSelect(select.filter((x) => x !== id));
    } else {
      setSelect([...select, id]);
    }
  };

  const handleConfirm = () => {
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

        createOrderToReceipt({ ...select.map((item) => item) });
      }
    });
  };

  return (
    <div>
      {select.length ? (
        <Grid
          container
          spacing={2}
          style={{
            marginBottom: 15,
          }}
        >
          <Grid item xs={10.5}>
            <div>
              <Typography variant="h5">จำนวน {select.length}</Typography>
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <Fab variant="extended" color="primary" onClick={handleConfirm}>
              <EditIcon sx={{ mr: 1 }} />
              ยืนยันการเลือก
            </Fab>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}

      {data.map((item, i) => {
        const calculateTotalPrice = () => {
          return item?.order?.orderItems?.reduce((total, item: OrderItem) => {
            total = item.product.price * item.quantity + total;

            return total;
          }, 0);
        };

        const totalPrice: any = calculateTotalPrice();
        const formattedTotalPrice = formatNumberWithCommas(totalPrice);

        return (
          <div
            key={i}
            className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6"
          >
            <div className="space-y-5">
              <div className="md:flex md:justify-between">
                <Typography
                  variant="h5"
                  align="left"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="text-lg font-semibold text-gray-900 dark:text-gray-900"
                >
                  รหัสคำสั่งซื้อ : {item.order.orderId}
                </Typography>
                <Typography
                  variant="h5"
                  align="left"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={
                    "text-lg font-semibold text-gray-900 dark:text-" +
                    (item.order.status === 0
                      ? "กำลังรออนุมัติ"
                      : item.order.status === 1
                      ? "ยืนยันคำสั่งซื้อแล้ว"
                      : item.order.status === 2
                      ? "red-500"
                      : "gray-500")
                  }
                  // className="text-lg font-semibold text-gray-900 dark:text-red-500"
                >
                  สถานะ :{" "}
                  {item.order.status === 0
                    ? "กำลังรออนุมัติ"
                    : item.order.status === 1
                    ? "ยืนยันคำสั่งซื้อแล้ว"
                    : item.order.status === 2
                    ? "ยกเลิกคำสั่งซื้อแล้ว"
                    : "เพิ่มสถานะด้วย"}
                </Typography>
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
                    checked={
                      select.find((x) => x === item.order.id) !== undefined
                    }
                    onChange={() => onSelect(item.order.id)}
                  />
                  <Typography variant="h5" align="left">
                    เลือกสินค้า
                  </Typography>
                </div>
              </div>

              {item?.order?.orderItems?.map((item: OrderItem) => {
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

              <div className="rounded-sm flex flex-col px-4 xl:p-6 w-full bg-white">
                <div className="flex justify-between items-center w-full mb-3">
                  <p className="text-base leading-4 text-gray-800">ราคารวม</p>
                  <p className="text-base leading-4 text-gray-600">
                    {formattedTotalPrice} บาท
                  </p>
                </div>
                <div className="flex justify-between items-center w-full mb-3">
                  <p className="text-base leading-4 text-gray-800">ค่าจัดส่ง</p>
                  <p className="text-base leading-4 text-gray-600">
                    {systemSetting[0]?.shippingCost} บาท
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base font-semibold leading-4 text-gray-800">
                    ราคารวมทั้งหมด
                  </p>
                  <p className="text-base font-semibold leading-4 text-gray-600">
                    {parseFloat(formattedTotalPrice) +
                      systemSetting[0]?.shippingCost}{" "}
                    บาท
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between items-center w-full space-y-4 md:space-y-0">
                {/* <div className="flex-1">
                  <p className="text-lg leading-4 text-gray-800 font-semibold">
                    {item.address?.user?.fullName} เบอร์ :
                    {item.address?.user?.phoneNumber}
                  </p>
                </div> */}
                <div className="flex-1">
                  <p className="text-xl leading-4 text-gray-800 font-medium">
                    ชื่อ-ที่อยู่ร้านค้า : {item.address?.user?.fullName} เบอร์ :{" "}
                    {item.address?.user?.phoneNumber} บ้านเลขที่{" "}
                    {item.address?.detail} แขวง/ตำบล
                    {item.address?.subDistrict} เขต/อำเภอ
                    {item.address?.district} จังหวัด
                    {item.address?.province} รหัสไปรษณีย์{" "}
                    {item.address?.postCode}
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-xl leading-4 text-gray-800 font-medium">
                  ชื่อ-ที่อยู่ลูกค้า : {item?.order?.address?.user?.fullName}{" "}
                  เบอร์ : {item?.order?.address?.user?.phoneNumber} บ้านเลขที่{" "}
                  {item?.order?.address?.detail} แขวง/ตำบล
                  {item?.order?.address?.subDistrict} เขต/อำเภอ
                  {item?.order?.address?.district} จังหวัด
                  {item?.order?.address?.province} รหัสไปรษณีย์{" "}
                  {item?.order?.address?.postCode}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyCardOrderReceipt;
