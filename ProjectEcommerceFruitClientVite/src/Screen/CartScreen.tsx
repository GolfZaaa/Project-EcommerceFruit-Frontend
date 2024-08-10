import React, { useEffect } from "react";
import Footer from "../layout/screen/Footer";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
export default observer(function CartScreen() {
  const {
    GetCartItemByUser,
    cartItems,
    GetCartItemByUserOrderStore,
    cartItemsStore,
  } = useStore().cartStore;

  useEffect(() => {
    GetCartItemByUser();
    GetCartItemByUserOrderStore();
  }, []);

  return (
    //   <div style={{ backgroundColor: "#fbfbfb", minHeight: "100vh", position: "relative" }}>
    //     <div classNameName="cart-screen" style={{ padding: "20px" }}>
    //       <div classNameName="cart-item-all">
    //         <div style={{ marginBottom: 13, marginLeft: 15 }}>
    //           <div style={{ display: "flex", alignItems: "center" }}>
    //             <BsShop size={20} style={{ marginRight: "8px" }} />
    //             <p style={{ marginTop: 5 }}>ชื่อร้านค้า</p>
    //           </div>
    //         </div>
    //         <div
    //           classNameName="fontcarth1"
    //           style={{
    //             borderBottom: "1px solid #000",
    //             display: "flex",
    //             marginBottom: 5,
    //           }}
    //         ></div>
    //         <div classNameName="cart-item">
    //           <img
    //             src="https://img.wongnai.com/p/1920x0/2021/05/17/32ad7f16089441f78d0f14947563dc3d.jpg"
    //             alt="OPPO Reno 11 case"
    //             style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
    //           />
    // <div
    //             classNameName="item-details"
    //             style={{
    //               display: "flex",
    //               gap: "16px",
    //             }}
    //           >
    //             <h2 style={{ flex: "1", textAlign: "left" }}>ทุเรียน</h2>
    //             <div
    //               style={{
    //                 flex: "1",
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //               }}
    //             >
    //               <h2>น้ำหนัก</h2>
    //             </div>
    //             <div
    //               style={{
    //                 flex: "1",
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //               }}
    //             >
    //               <h2>฿68</h2>
    //             </div>
    //             <div
    //               style={{
    //                 flex: "1",
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //               }}
    //             >
    //               <button
    //                 style={{
    //                   fontSize: "20px",
    //                   cursor: "pointer",
    //                   height: 30,
    //                   width: 30,
    //                 }}
    //               >
    //                 -
    //               </button>
    //               <span
    //                 style={{
    //                   fontSize: "20px",
    //                   marginLeft: 10,
    //                   marginRight: 10,
    //                 }}
    //               >
    //                 2
    //               </span>
    //               <button
    //                 style={{
    //                   fontSize: "20px",
    //                   cursor: "pointer",
    //                   height: 30,
    //                   width: 30,
    //                 }}
    //               >
    //                 +
    //               </button>
    //             </div>
    //             <div
    //               style={{
    //                 flex: "1",
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //               }}
    //             >
    //               <h2>฿100</h2>
    //             </div>
    //             <div
    //               style={{
    //                 flex: "1",
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //               }}
    //             >
    //               <h2>ลบ</h2>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div classNameName="checkout-card" style={checkoutCardStyle}>
    //         <h3 style={{ marginBottom: "20px" }}>Checkout</h3>
    //         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
    //           <span>Total Items:</span>
    //           <span>2</span>
    //         </div>
    //         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
    //           <span>Total Price:</span>
    //           <span>฿100</span>
    //         </div>
    //         <button style={checkoutButtonStyle}>Proceed to Checkout</button>
    //       </div>
    //     </div>
    //   </div>

    <div>
      <section className="bg-white py-8 antialiased  md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl">
            ตะกร้าสินค้า ({cartItems.length})
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8 flex-col">

            {cartItemsStore.map((item: any, _) => {
              console.log("Item", item);
              return (
                
                <div className="w-full flex-none lg:max-w-2xl xl:max-w-4xl  ">
                  <div className="space-y-6 ">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
                      <div className="space-y-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                          ชื่อร้านค้า : {item.storeName}
                        </span>
                        {item.products.map((product: any) => {
                          return (
                            <div key={product.id} className="space-y-6">
                              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
                                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                  <a href="#" className="shrink-0 md:order-1">
                                    <img
                                      className="hidden h-20 w-20 dark:block"
                                      src="https://shopee.co.th/blog/wp-content/uploads/2022/02/mango.jpg"
                                      alt="product image"
                                    />
                                  </a>
                                  <label className="sr-only">
                                    Choose quantity:
                                  </label>
                                  <div className="flex items-center justify-between md:order-3 md:justify-end">
                                    <div className="flex items-center">
                                      <button
                                        type="button"
                                        id="decrement-button"
                                        data-input-counter-decrement="counter-input"
                                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                      >
                                        <svg
                                          className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                      <input
                                        type="text"
                                        id="counter-input"
                                        data-input-counter
                                        className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-gray-800"
                                        placeholder=""
                                        value="2"
                                        required
                                      />
                                      <button
                                        type="button"
                                        id="increment-button"
                                        data-input-counter-increment="counter-input"
                                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                      >
                                        <svg
                                          className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="text-end md:order-4 md:w-32">
                                      <p className="text-base font-bold text-gray-900 dark:text-gray-900">
                                        $1,499
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                                    <p className="text-sm text-gray-500 font-bold">
                                      ผลไม้แปรรูป
                                    </p>
                                    <a
                                      href="#"
                                      className="text-base font-medium text-gray-900 hover:underline dark:text-gray-800"
                                    >
                                      {product.name}
                                    </a>
                                    <div className="flex items-center gap-4">
                                      <button
                                        type="button"
                                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                      >
                                        <svg
                                          className="me-1.5 h-5 w-5"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18 17.94 6M18 18 6.06 6"
                                          />
                                        </svg>
                                        ลบสินค้า
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

              );
            })}
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-800">
                  สรุปการสั่งซื้อ
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-800 dark:text-gray-800">
                        ราคาเดิม
                      </dt>
                      <dd className="text-base font-medium text-gray-800 dark:text-gray-800">
                        $7,592.00
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-800 dark:text-gray-800">
                        ค่าจัดส่ง
                      </dt>
                      <dd className="text-base font-medium text-gray-800 dark:text-gray-800">
                        - $99
                      </dd>
                    </dl>
                  </div>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-800">
                    <dt className="text-base font-bold text-gray-800 dark:text-gray-800">
                      ราคารวม
                    </dt>
                    <dd className="text-base font-medium text-green-600">
                      $7,493
                    </dd>
                  </dl>
                </div>
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  ดำเนินการชำระเงิน
                </a>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-800 dark:text-gray-800">
                    {" "}
                    หรือ{" "}
                  </span>
                  <a
                    href="#"
                    title=""
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    ช้อปปิ้งต่อ
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </div>

          
        </div>
      </section>
      <Footer />
    </div>
    
  );
});
