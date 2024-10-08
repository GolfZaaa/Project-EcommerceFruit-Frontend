import React, { useEffect, useState } from "react";
import Footer from "../layout/screen/Footer";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { NavLink, useNavigate } from "react-router-dom";
import { pathImages, RoutePath } from "../constants/RoutePath";
import BannerComponent from "../layout/component/BannerComponent";
import { resetScroll } from "../api/agent";
import CircularProgress from "@mui/material/CircularProgress";

// Define types for cart items and products
interface Product {
  id: string;
  price: number;
  images: string | null;
  quantityInCartItem: number;
  quantity: number;
}

interface CartItem {
  id: string;
  storeName: string;
  productName: string;
  products: Product[];
  cartItemId: any;
  categoryName: string;
}

const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default observer(function CartScreen() {
  const navigate = useNavigate();

  const [formattedTotalPrice, setFormattedTotalPrice] = useState<string>("");

  const {
    GetCartItemByUser,
    cartItems,
    GetCartItemByUserOrderStore,
    cartItemsStore,
    RemoveToCart,
    AddToCart,
    selectMyCart,
    setselectMyCart,
  } = useStore().cartStore;

  const { getAddressgotoOrderByUserId } = useStore().addressStore;

  useEffect(() => {
    GetCartItemByUser();
    GetCartItemByUserOrderStore();
    getAddressgotoOrderByUserId();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      return selectMyCart.reduce((total, item: CartItem) => {
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
    setFormattedTotalPrice(formatNumberWithCommas(totalPrice));
  }, [selectMyCart]);

  const handleRemoveItem = async (item: CartItem) => {
    const CartItemId = item.cartItemId;
    const Quantity = 1;

    await RemoveToCart({ CartItemId, Quantity });
    await GetCartItemByUser();
    await GetCartItemByUserOrderStore();

    // อัปเดตราคารวมใหม่หลังจากลบสินค้า
    const updatedSelectMyCart = selectMyCart.map((cartItem: CartItem) => {
      if (cartItem.id === item.id) {
        const updatedProducts = cartItem.products.map((product: Product) =>
          product.id === item.products[0].id
            ? { ...product, quantityInCartItem: product.quantityInCartItem - 1 }
            : product
        );
        return { ...cartItem, products: updatedProducts };
      }
      return cartItem;
    });

    // กรองสินค้าออกถ้าจำนวนสินค้าในตะกร้าเป็น 0
    const filteredCart = updatedSelectMyCart.filter((cartItem) =>
      cartItem.products.some((product) => product.quantityInCartItem > 0)
    );

    setselectMyCart(filteredCart);

    // คำนวณราคารวมใหม่
    const calculateTotalPrice = () => {
      return filteredCart.reduce((total, item: CartItem) => {
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
    setFormattedTotalPrice(formatNumberWithCommas(totalPrice));
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
    if (checkedItem) {
      const updatedCart = selectMyCart.map((cartItem: any) => {
        if (cartItem.storeName === checkedItem) {
          const updatedProducts = cartItem.products.map((prod: any) => {
            return prod.id === ProductId &&
              product.quantityInCartItem < product.quantity
              ? { ...prod, quantityInCartItem: prod.quantityInCartItem + 1 }
              : prod;
          });
          return { ...cartItem, products: updatedProducts };
        }
        return cartItem;
      });

      const productInExistingCart = updatedCart.find((item) =>
        item.products.some((prod: any) => prod.id === ProductId)
      );
      if (!productInExistingCart) {
        updatedCart.push({
          id: `${Date.now()}`,
          storeName: checkedItem,
          productName: product.id,
          products: [{ ...product, quantityInCartItem: 1 }],
          cartItemId: null,
        });
      }

      setselectMyCart(updatedCart);
    }

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

  const [checkedItem, setCheckedItem] = useState<string | null>(null);

  const handleCheckboxChange = (items: any, storeName: string) => {
    setCheckedItem((prevCheckedItem) =>
      prevCheckedItem === storeName ? null : storeName
    );
    setselectMyCart(items);
  };

  const handleToOrderSummary = () => {
    setLoadingUser(true)
    setTimeout(() => {
      setLoadingUser(false)
    navigate(RoutePath.orderSummary);
    resetScroll();
    }, 700);
  };

  const handleBackHomeScreen = () => {
    navigate(RoutePath.homeScreen);
    resetScroll();
  }

  const { setLoadingUser, loadingUser } =
  useStore().userStore;


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
                    key={storeName + items}
                    className="w-full flex flex-col space-y-6 lg:max-w-2xl xl:max-w-4xl"
                  >
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                            ชื่อร้านค้า : {storeName}
                          </span>

                          <input
                            type="checkbox"
                            className="mr-2"
                            style={{
                              width: 50,
                              height: 50,
                            }}
                            checked={checkedItem === storeName}
                            onChange={() =>
                              handleCheckboxChange(items, storeName)
                            }
                          />
                        </div>

                        {items.map((item: CartItem, i: number) => {
                          return (
                            <div key={i} className="space-y-6">
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
                                      <div className="flex items-center">
                                        <a
                                          href="#"
                                          className="shrink-0 md:order-1"
                                        >
                                          <img
                                            className="hidden h-20 w-20 dark:block"
                                            src={
                                              pathImages.product +
                                              product.images
                                            }
                                            alt="product image"
                                          />
                                        </a>
                                      </div>
                                      <label className="sr-only">
                                        Choose quantity:
                                      </label>
                                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                                        <div className="flex items-center">
                                          <button
                                            onClick={() =>
                                              handleRemoveItem(item)
                                            }
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
                                            onClick={() =>
                                              handleAddItem(product)
                                            }
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
                                          {item.categoryName}
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
                          );
                        })}
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
                          {!checkedItem ? 0 : formattedTotalPrice} บาท
                        </dd>
                      </dl>
                    </div>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-800"></dl>
                  </div>
                  <button
                    onClick={handleToOrderSummary}
                    disabled={!checkedItem && loadingUser}
                    className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 ${
                      !checkedItem
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-green-500 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    }`}
                  >
                   {loadingUser ? <div><CircularProgress size={17} color="inherit" /></div>:<div><p>ดำเนินการชำระเงิน</p></div>} 
                  </button>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-800 dark:text-gray-800">
                      {" "}
                      หรือ{" "}
                    </span>
                    <button
                      title=""
                      onClick={handleBackHomeScreen}
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
                    </button>
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
