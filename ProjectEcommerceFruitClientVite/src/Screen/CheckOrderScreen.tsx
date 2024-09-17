import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStore } from "../store/store";
import { pathImages } from "../constants/RoutePath";

export default observer(function CheckOrderScreen() {

    const {
        checkOrderNow,
        getOrderItemByOrderId,
        orderid
      } = useStore().orderStore;

    //   console.log("orderid",orderid)

      useEffect(() => {
        getOrderItemByOrderId(orderid)
        // getOrderItemByOrderId(23)
      }, []);

      console.log("checkOrderNow",checkOrderNow)

      const totalOrderPrice = checkOrderNow?.reduce((acc, item) => {
        const totalPriceProduct = item.quantity * item.product.price;
        return acc + totalPriceProduct;
    }, 0) ?? 0;

  return (
    <div>
      <section className="bg-white py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-black sm:text-2xl">
            ติดตามการจัดส่งคำสั่งซื้อ #{orderid}
          </h2>
          <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
            <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl flex flex-col h-full">
              


            {checkOrderNow.map((item,i) => {
                const totalPriceProduct = item.quantity * item.product.price;
                return (
<div className="flex-1 space-y-4 p-6">
                <div className="flex items-center gap-6">
                  <div  className="h-14 w-14 shrink-0">
                    <img
                      className="h-full w-full dark:hidden"
                      src={pathImages.product + item.product.images}
                      alt="imac image"
                    />
                    <img
                      className="hidden h-full w-full dark:block"
                      src={pathImages.product + item.product.images}
                      alt="imac image"
                    />
                  </div>
                  <a className="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-black">
                    {" "}
                    {item?.product?.productGI?.name}
                  </a>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-black">
                      ประเภทสินค้า :
                    </span>{" "}
                    {item.product.productGI.category.name}
                  </p>
                  <div className="flex items-center justify-end gap-4">
                    <p className="text-base font-normal text-gray-900 dark:text-black">
                      x{item.quantity}
                    </p>
                    <p className="text-xl font-bold leading-tight text-gray-900 dark:text-black">
                      {totalPriceProduct.toLocaleString()} บาท
                    </p>
                  </div>
                </div>
              </div>
                )
            })}


              








              <div className="space-y-4 bg-gray-50 p-6 flex-shrink-0">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="font-normal text-gray-500 dark:text-gray-400">
                      รายการสินค้าทั้งหมด
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-black">
                      {checkOrderNow.length} รายการ
                    </dd>
                  </dl>
                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-lg font-bold text-gray-900 dark:text-black">
                    ราคารวมทั้งหมด
                  </dt>
                  <dd className="text-lg font-bold text-gray-900 dark:text-black">
                    {totalOrderPrice.toLocaleString()} บาท
                  </dd>
                </dl>
              </div>
            </div>

            <div className="mt-6 grow sm:mt-8 lg:mt-0">
              <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 ">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                  ประวัติการส่ง
                </h3>
                <ol className="relative ms-3 border-s border-gray-200 dark:border-blue-300">
                  <li className="mb-10 ms-6">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 ring-8 ring-black-300  dark:ring-white">
                      <svg
                        className="h-4 w-4 text-white dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                        />
                      </svg>
                    </span>
                    <h4 className="mb-0.5 text-base font-semibold text-gray-900 dark:text-black">
                    20 ตุลาคม 2567, 10:45
                    </h4>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      ส่งสินค้าสำเร็จ
                    </p>
                  </li>
                  <li className="mb-10 ms-6">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 ring-8 ring-black-300 dark:ring-white">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                        />
                      </svg>
                    </span>
                    <h4 className="mb-0.5 text-base font-semibold text-gray-900 dark:text-black">
                    19 ตุลาคม 2567, 17:00
                    </h4>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    สินค้าที่กำลังจัดส่ง
                    </p>
                  </li>
                  <li className="mb-10 ms-6 text-primary-700 dark:text-primary-500">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white dark:bg-blue-300 dark:ring-white">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-blue-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 11.917 9.724 16.5 19 7.5"
                        />
                      </svg>
                    </span>
                    <h4 className="mb-0.5 font-semibold">19 ตุลาคม 2567, 15:15</h4>
                    <p className="text-sm">
                       
                    </p>
                  </li>
                  <li className="mb-10 ms-6 text-primary-700 dark:text-primary-500">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white dark:bg-blue-300 dark:ring-white">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-blue-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 11.917 9.724 16.5 19 7.5"
                        />
                      </svg>
                    </span>
                    <h4 className="mb-0.5 text-base font-semibold">
                        19 ตุลาคม 2567, 12:27
                    </h4>
                    <p className="text-sm">
                       
                    </p>
                  </li>
                  <li className="mb-10 ms-6 text-primary-700 dark:text-primary-500">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white dark:bg-blue-300 dark:ring-white">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-blue-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 11.917 9.724 16.5 19 7.5"
                        />
                      </svg>
                    </span>
                    <h4 className="mb-0.5 font-semibold">19 ตุลาคม 2567, 10:47</h4>
                    <p className="text-sm">
                      อนุมัติคำสั่งซื้อ
                    </p>
                  </li>
                  <li className="ms-6 text-primary-700 dark:text-primary-500">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white dark:bg-blue-300 dark:ring-white">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-blue-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 11.917 9.724 16.5 19 7.5"
                        />
                      </svg>
                    </span>
                    <div>
                      <h4 className="mb-0.5 font-semibold">
                        19 ตุลาคม 2567, 10:45
                      </h4>
                      <a
                        className="text-sm font-medium hover:underline"
                      >
                        มีคำสั่งซื้อใหม่ #{orderid}
                      </a>
                    </div>
                  </li>
                </ol>
                <div className="gap-4 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                  >
                    ยกเลิกคำสั่งซื้อ
                  </button>
                  <button className="mt-4 flex w-full border border-blue-800 items-center justify-center rounded-lg bg-blue-400  px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0">
                    กลับไปยังหน้าหลัก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
})
