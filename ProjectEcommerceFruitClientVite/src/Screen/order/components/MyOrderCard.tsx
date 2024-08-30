import React from "react";
import { Order } from "../../../models/Order";
import { OrderItem } from "../../../models/OrderItem";
import { formatNumberWithCommas } from "../../../helper/components";
import { Typography } from "@mui/material";

interface props {
  order: Order[];
}

const MyOrderCard = ({ order }: props) => {
  return (
    <>
      <Typography variant="h5">จำนวน {order.length}</Typography>
      {order.map((item) => (
        <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
          <div className="space-y-4">
            <div className="md:flex md:justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                รหัสคำสั่งซื้อ : {item.orderId}
              </span>
              <span
                className={
                  "text-lg font-semibold text-gray-900 dark:text-" +
                  (item.status === 0
                    ? "กำลังรออนุมัติ"
                    : item.status === 1
                    ? "ยืนยันคำสั่งซื้อแล้ว"
                    : item.status === 2
                    ? "red-500"
                    : "gray-500")
                }
                // className="text-lg font-semibold text-gray-900 dark:text-red-500"
              >
                สถานะ :{" "}
                {item.status === 0
                  ? "กำลังรออนุมัติ"
                  : item.status === 1
                  ? "ยืนยันคำสั่งซื้อแล้ว"
                  : item.status === 2
                  ? "ยกเลิกคำสั่งซื้อแล้ว"
                  : "เพิ่มสถานะด้วย"}
              </span>
            </div>

            {item.orderItems.map((item: OrderItem) => {
              const TotalPriceForProduct =
                item.product.price * item.product.quantity;
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
                        src="https://shopee.co.th/blog/wp-content/uploads/2022/02/mango.jpg"
                        alt="product image"
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
        </div>
      ))}
    </>
  );
};

export default MyOrderCard;
