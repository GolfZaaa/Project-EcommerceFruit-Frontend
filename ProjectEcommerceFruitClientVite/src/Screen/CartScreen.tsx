import React, { useEffect } from "react";
import Footer from "../layout/screen/Footer";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { NavLink } from "react-router-dom";
import { RoutePath } from "../constants/RoutePath";
import BannerComponent from "../layout/component/BannerComponent";

// Define types for cart items and products
interface Product {
  id: string;
  price: number;
  quantityInCartItem: number;
}

interface CartItem {
  id: string;
  storeName: string;
  productName: string;
  products: Product[];
  cartItemId: any;
}

const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default observer(function CartScreen() {
  const {
    GetCartItemByUser,
    cartItems,
    GetCartItemByUserOrderStore,
    cartItemsStore,
    RemoveToCart,
    AddToCart,
  } = useStore().cartStore;
  const { getAddressgotoOrderByUserId } = useStore().addressStore;

  useEffect(() => {
    GetCartItemByUser();
    GetCartItemByUserOrderStore();
    getAddressgotoOrderByUserId();
  }, []);

  const calculateTotalPrice = () => {
    return cartItemsStore.reduce((total, item: CartItem) => {
      const storeTotal = item.products.reduce(
        (storeSum: number, product: Product) => {
          return storeSum + product.quantityInCartItem * product.price;
        },
        0
      );
      return total + storeTotal;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();
  const formattedTotalPrice = formatNumberWithCommas(totalPrice);

  const handleRemoveItem = async (item: CartItem) => {
    const CartItemId = item.cartItemId;
    const Quantity = 1;
    await RemoveToCart({ CartItemId, Quantity });
    await GetCartItemByUser();
    await GetCartItemByUserOrderStore();
  };

  const handleRemoveItemAll = async (item: CartItem, product: Product) => {
    const CartItemId = item.cartItemId;
    const Quantity = product.quantityInCartItem;
    await RemoveToCart({ CartItemId, Quantity });
    await GetCartItemByUser();
    await GetCartItemByUserOrderStore();
  };

  const handleAddItem = async (product: Product) => {
    const ProductId = product.id;
    const Quantity = 1;
    await AddToCart({ ProductId, Quantity });
    await GetCartItemByUser();
    await GetCartItemByUserOrderStore();
  };

  const groupedCartItems: Record<string, CartItem[]> = cartItemsStore.reduce(
    (acc: Record<string, CartItem[]>, item: CartItem) => {
      if (!acc[item.storeName]) {
        acc[item.storeName] = [];
      }
      acc[item.storeName].push(item);
      return acc;
    },
    {}
  );

  return (
    <div>
      <BannerComponent />
      <section className="bg-white py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            ตะกร้าสินค้า ({cartItems.length})
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="w-8/12 flex flex-col space-y-6">
              {Object.entries(groupedCartItems).map(
                ([storeName, items]: [string, CartItem[]]) => (
                  <div
                    key={storeName}
                    className="w-full flex flex-col space-y-6 lg:max-w-2xl xl:max-w-4xl"
                  >
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
                      <div className="space-y-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                          ชื่อร้านค้า : {storeName}
                        </span>
                        {items.map((item: CartItem) => (
                          <div key={item.id} className="space-y-6">
                            {item.products.map((product: Product) => {
                              const TotalPriceForProduct =
                                product.price * product.quantityInCartItem;
                              const formatTotalPriceForProduct =
                                formatNumberWithCommas(TotalPriceForProduct);
                              return (
                                <div
                                  key={product.id}
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
                                    <label className="sr-only">
                                      Choose quantity:
                                    </label>
                                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                                      <div className="flex items-center">
                                        <button
                                          onClick={() => handleRemoveItem(item)}
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
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M1 1h16"
                                            />
                                          </svg>
                                        </button>
                                        <p className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-gray-800">
                                          {product.quantityInCartItem}
                                        </p>
                                        <button
                                          type="button"
                                          id="increment-button"
                                          onClick={() => handleAddItem(product)}
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
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M9 1v16M1 9h16"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                      <div className="text-end md:order-4 md:w-32">
                                        <p className="text-base font-bold text-gray-900 dark:text-gray-900">
                                          {formatTotalPriceForProduct} บาท
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
                                        {item.productName}
                                      </a>
                                      <div className="flex items-center gap-4">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveItemAll(item, product)
                                          }
                                          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                        >
                                          <svg
                                            className="me-1.5 h-5 w-5"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M6 18 17.94 6M18 18 6.06 6"
                                            />
                                          </svg>
                                          ลบสินค้า
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {cartItems && cartItems.length > 0 && (
              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white sm:p-6">
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-800">
                    สรุปการสั่งซื้อ
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-bold text-gray-800 dark:text-gray-800">
                          ราคารวม
                        </dt>
                        <dd className="text-base font-medium text-green-600">
                          {formattedTotalPrice} บาท
                        </dd>
                      </dl>
                    </div>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-800"></dl>
                  </div>
                  <NavLink
                    to={RoutePath.OrderSummary}
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-green-500 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    ดำเนินการชำระเงิน
                  </NavLink>
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 12H5m14 0-4 4m4-4-4-4"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
});
