import React, { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import AddressList from "./address/AddressList";
import { useNavigate } from "react-router-dom";
import { pathImages, RoutePath } from "../constants/RoutePath";
import DropZoneImageComponent from "../layout/component/DropZoneImageComponent";
import dayjs from "dayjs";
import { formatDateThai, myToast } from "../helper/components";
import { resetScroll } from "../api/agent";
import CircularProgress from "@mui/material/CircularProgress";
import MyContent from "../component/MyContent";

import { useStripe, useElements } from "@stripe/react-stripe-js";
import { CardCvcElement } from "@stripe/react-stripe-js";
import { CardExpiryElement } from "@stripe/react-stripe-js";
import { CardNumberElement } from "@stripe/react-stripe-js";

interface CartItem {
  id: string;
  storeName: string;
  productName: string;
  products: Product[];
  cartItemId: any;
}

interface Product {
  id: string;
  price: number;
  quantityInCartItem: number;
  images: string;
}

const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default observer(function SummaryScreen() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [dropZoneImage, setDropZoneImage] = useState(null);
  const [tag, setTag] = useState("");

  const [isImageValid, setIsImageValid] = useState(true);

  const { setLoadingUser, loadingUser } = useStore().userStore;

  const {
    myAddressgotoOrder,
    getAddressgotoOrderByUserId,
    getAddressByUserId,
  } = useStore().addressStore;

  const {
    GetCartItemByUser,
    GetCartItemByUserOrderStore,
    selectMyCart,
  } = useStore().cartStore;

  const { CreateUpdateOrderById } = useStore().orderStore;
  const { systemSetting } = useStore().systemSettingStore;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);

  const [onChangeAddress, setOnChangeAddress] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const getData = async () => {
    await GetCartItemByUser();
    await getAddressgotoOrderByUserId();
    await GetCartItemByUserOrderStore();
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e: any) => {
    setSelectedPaymentMethod(Number(e.target.value));

    if (Number(e.target.value) !== 0) {
      setIsImageValid(true);
    }

    setDropZoneImage(null);
  };

  console.log("DropZoneImage",dropZoneImage)

  const confirmChangeAddress = () => {
    setOnChangeAddress(false);
  };

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
  const formattedTotalPrice = formatNumberWithCommas(
    totalPrice + systemSetting[0]?.shippingCost
  );

  const handleImageUpload = (file: any) => {
    setDropZoneImage(file);
    setIsImageValid(!!file);
  };

  const [checkCardNumberElement, setCheckCardNumberElement] = useState(false);
  const [checkCardExpiryElement, setCheckCardExpiryElement] = useState(false);
  const [checkCardCvcElement, setCheckCardCvcElement] = useState(false);

  const handleCheckCardNumber = (event: any) => {
    setCheckCardNumberElement(event.complete);
  };

  const handleCheckCardExpiry = (event: any) => {
    setCheckCardExpiryElement(event.complete);
  };

  const handleCheckCardCvc = (event: any) => {
    setCheckCardCvcElement(event.complete);
  };

  const handleSubmit = async (value: any) => {
    if (selectedPaymentMethod === 0 && !dropZoneImage) {
      setIsImageValid(false);
      myToast("กรุณาเพิ่มรูปภาพสลิป");
      return;
    }

    setLoadingUser(true);
    setIsProcessingPayment(true);
    setTimeout(() => {
      setLoadingUser(false);
    }, 700);

    const Data = {
      PaymentImage: dropZoneImage,
      Tag: tag,
      StoreId: value[0].storeId,
      PaymentMethod: selectedPaymentMethod,
    };

    const test = await CreateUpdateOrderById(Data);

    console.log("test", test);

    if (selectedPaymentMethod == 1) {
      if (!stripe || !elements) {
        return;
      }

      try {
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(
            CardNumberElement,
            CardExpiryElement,
            CardCvcElement
          ),
        });

        if (error) {
          console.error("Error creating payment method:", error);
        } else {
          const paymentMethodId = paymentMethod.id;

          const { paymentIntent, error: confirmError } =
            await stripe.confirmCardPayment(test.clientSecret, {
              payment_method: paymentMethodId,
            });

          if (confirmError) {
            console.error("Error confirming card payment:", confirmError);
          } else if (paymentIntent.status === "succeeded") {
            console.log("Payment succeeded:", paymentIntent);
            navigate(RoutePath.successScreen);
            resetScroll();
          }
        }
      } catch (error) {
        console.error("Error making API request:", error);
      }
    } else if (test) {
      navigate(RoutePath.successScreen);
      resetScroll();
    } else {
      alert("error");
    }
    setIsProcessingPayment(false);
  };

  if (!selectMyCart.length) {
    navigate(RoutePath.cartScreen);
  }

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        "::placeholder": {
          color: "#a0aec0",
        },
        padding: "12px 16px",
        backgroundColor: "#ffffff",
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  return (
    <div className="bg-gray-50 -mt-8">
      <div className="ml-10 mr-10">
        <div className="mt-8 flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
          <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-white space-y-6 shadow-md rounded-sm">
            <div className="flex items-center space-x-2">
              <svg
                className="-mt-1"
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#06ff00"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h3 className="text-xl font-medium leading-5 text-gray-700">
                <MyContent name="ที่อยู่ในการจัดส่ง" fontSize="normal" />
              </h3>
            </div>

            {!onChangeAddress ? (
              <div className="flex flex-col xl:flex-row xl:justify-between items-start xl:items-center w-full space-y-4 xl:space-y-0">
                <div>
                  <p className="text-lg leading-4 text-gray-800 font-semibold">
                    <MyContent
                      name={`${myAddressgotoOrder?.user?.fullName} เบอร์ :
            ${myAddressgotoOrder?.user?.phoneNumber}`}
                      fontSize="small"
                    />
                  </p>
                </div>
                <div>
                  <p className="text-lg leading-4 text-gray-800 font-medium">
                    <MyContent
                      name={`${myAddressgotoOrder?.detail} แขวง/ตำบล
            ${myAddressgotoOrder?.subDistrict} เขต/อำเภอ
            ${myAddressgotoOrder?.district} จังหวัด
            ${myAddressgotoOrder?.province} รหัสไปรษณีย์
            ${myAddressgotoOrder?.postCode}`}
                      fontSize="small"
                    />
                  </p>
                </div>
                <div className="flex items-center justify-center xl:justify-end">
                  <button
                    onClick={() => {
                      getAddressByUserId();
                      setOnChangeAddress(true);
                    }}
                    className="text-lg leading-4 text-blue-700 font-medium"
                  >
                    <MyContent name="เปลี่ยน" fontSize="small" />
                  </button>
                </div>
              </div>
            ) : (
              <AddressList confirmChangeAddress={confirmChangeAddress} />
            )}
          </div>
        </div>

        <div className=" py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
          <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
            <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
              <div className=" shadow-md rounded-smflex flex-col justify-start items-start bg-white px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                <div className="flex justify-start item-start space-y-2 flex-col mb-6">
                  <a className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">
                    <MyContent name="การชำระเงิน" fontSize="large" />
                  </a>
                  <p className="text-base font-medium leading-6 text-gray-600">
                    <MyContent
                      name={formatDateThai(new Date(), 0, 2)}
                      fontSize="small"
                    />
                  </p>
                </div>

                <div className="flex justify-between w-full px-4">
                  <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 w-1/4">
                    <MyContent name="ตะกร้าสินค้า" fontSize="small" />
                  </p>
                  <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 w-1/4 text-center">
                    <MyContent name="ราคาสินค้า" fontSize="small" />
                  </p>
                  <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 w-1/4 text-center">
                    <MyContent name="จำนวน" fontSize="small" />
                  </p>
                  <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 w-1/4 text-right">
                    <MyContent name="ราคารวม" fontSize="small" />
                  </p>
                </div>

                {selectMyCart &&
                  selectMyCart.map((items: CartItem, i: number) => (
                    <div key={i}>
                      {items.products.map((item, i: number) => {
                        const TotalPriceForProduct =
                          item.price * item.quantityInCartItem;
                        const formatTotalPriceForProduct =
                          formatNumberWithCommas(TotalPriceForProduct);

                        return (
                          <div key={i}>
                            <div className="mt-4 md:mt-6 flex justify-between items-center w-full">
                              {/* ตะกร้าสินค้า */}
                              <div className="w-1/4 flex items-center space-x-4">
                                <img
                                  src={pathImages.product + item.images}
                                  alt={item.images || "product image"}
                                  onClick={() => {
                                    navigate(RoutePath.productDetail(item.id));
                                    resetScroll();
                                  }}
                                  style={{
                                    width: "50%",
                                    cursor: "pointer",
                                  }}
                                />
                                <h3 className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                                  <MyContent
                                    name={items.productName}
                                    fontSize="small"
                                  />
                                </h3>
                              </div>

                              {/* ราคาสินค้า */}
                              <div className="w-1/4 text-center">
                                <p className="text-base xl:text-lg leading-6">
                                  <MyContent
                                    name={`${item.price.toLocaleString()} บาท`}
                                    fontSize="small"
                                  />
                                </p>
                              </div>
                              {/* จำนวน */}
                              <div className="w-1/4 text-center">
                                <p className="text-base xl:text-lg leading-6 text-gray-800">
                                  <MyContent
                                    name={item.quantityInCartItem}
                                    fontSize="small"
                                  />
                                </p>
                              </div>
                              {/* ราคารวม */}
                              <div className="w-1/4 text-right">
                                <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                                  <MyContent
                                    name={`${formatTotalPriceForProduct} บาท`}
                                    fontSize="small"
                                  />
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
              </div>

              <div className="flex justify-center md:flex-row flex-col items-start w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-white space-y-6 shadow-lg rounded-lg relative">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800">
                    <MyContent name="วิธีการชำระเงิน" fontSize="normal" />
                  </h3>
                  <div className="flex justify-center flex-wrap gap-4 items-center">
                    <label
                      className={`flex items-center space-x-3 p-3 ${
                        selectedPaymentMethod === 1
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }  rounded-lg shadow-sm cursor-pointer w-44 h-16 justify-center`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={1}
                        checked={selectedPaymentMethod === 1}
                        onChange={handleChange}
                        className={`form-radio text-blue-500 w-4 h-4 `}
                      />
                      <span
                        className={`text-base font-medium text-gray-800 ml-2 ${
                          selectedPaymentMethod === 1
                            ? "text-white font-bold"
                            : "text-gray-800"
                        }`}
                      >
                        <MyContent name="บัตรเครดิต" fontSize="small" />
                      </span>
                    </label>
                    <label
                      className={`flex items-center space-x-3 p-3 ${
                        selectedPaymentMethod === 0
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }  rounded-lg shadow-sm cursor-pointer w-44 h-16 justify-center `}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={0}
                        checked={selectedPaymentMethod === 0}
                        onChange={handleChange}
                        className={`form-radio text-blue-500 w-4 h-4 ${
                          selectedPaymentMethod === 0
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />

                      <span
                        className={`text-base font-medium ml-2 ${
                          selectedPaymentMethod === 0
                            ? "text-white font-bold"
                            : "text-gray-800"
                        }`}
                      >
                        <MyContent name="สลีปการโอน" fontSize="small" />
                      </span>
                    </label>
                  </div>

                  {selectedPaymentMethod === 0 ? (
                    <div>
                      <div
                        style={{ paddingLeft: "0px", marginTop: "20px" }}
                        className="payment-form-container"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "5px",
                          }}
                        >
                          <DropZoneImageComponent
                            onImageUpload={handleImageUpload}
                          />
                        </div>
                        {!isImageValid && (
                          <div
                            style={{
                              textAlign: "center",
                              color: "red",
                            }}
                            className="text-red-500 text-sm mt-2"
                          >
                            <MyContent
                              name="กรุณาอัปโหลดรูปภาพสลีปการโอน"
                              fontSize="small"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="">
                        <div className="max-w-md mx-auto p-6">
                          <div className="flex flex-col space-y-1">
                            <label className="text-gray-600">
                              {" "}
                              <MyContent name="หมายเลขบัตร" fontSize="small" />
                            </label>
                            <CardNumberElement
                              options={cardStyle}
                              onChange={handleCheckCardNumber}
                              className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-500 transition-shadow duration-300 shadow-sm hover:shadow-md bg-white focus:bg-gray-100"
                            />
                          </div>

                          <div className="flex space-x-4 mt-4">
                            <div className="flex flex-col space-y-1 flex-1">
                              <label className="text-gray-600 ">
                                <MyContent name="วันหมดอายุ" fontSize="small" />
                              </label>
                              <CardExpiryElement
                                options={cardStyle}
                                onChange={handleCheckCardExpiry}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-500 transition-shadow duration-300 shadow-sm hover:shadow-md bg-white focus:bg-gray-100"
                              />
                            </div>

                            <div className="flex flex-col space-y-1 flex-1">
                              <label className="text-gray-600">
                                <MyContent name="รหัส CVC" fontSize="small" />
                              </label>
                              <CardCvcElement
                                options={cardStyle}
                                onChange={handleCheckCardCvc}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-500 transition-shadow duration-300 shadow-sm hover:shadow-md bg-white focus:bg-gray-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className=" shadow-md rounded-sm  flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-white space-y-6">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800">
                    <MyContent name="สรุปการสั่งซื้อ" fontSize="normal" />
                  </h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base leading-4 text-gray-800">
                        <MyContent name="รายการทั้งหมด" fontSize="small" />
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        <MyContent
                          name={`${selectMyCart.length} รายการ`}
                          fontSize="small"
                        />
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base leading-4 text-gray-800">
                        <MyContent name="ราคารวม" fontSize="small" />
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        <MyContent
                          name={`${totalPrice.toLocaleString()} บาท`}
                          fontSize="small"
                        />
                      </p>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <p className="text-base leading-4 text-gray-800">
                        <MyContent name="ค่าจัดส่ง" fontSize="small" />
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        <MyContent
                          name={`${systemSetting[0]?.shippingCost} บาท`}
                          fontSize="small"
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      <MyContent name="ราคารวมทั้งหมด" fontSize="small" />
                    </p>
                    <p className="text-base font-semibold leading-4 text-gray-600">
                      <MyContent
                        name={`${formattedTotalPrice} บาท`}
                        fontSize="small"
                      />
                    </p>
                  </div>

                  <div className="text-end">
                    {selectedPaymentMethod == 0 ? (
                      <button
                        type="button"
                        onClick={() => handleSubmit(selectMyCart)}
                        className="px-8 py-3 font-semibold rounded dark:bg-gray-800 dark:text-gray-100"
                        disabled={loadingUser}
                      >
                        {loadingUser ? (
                          <div className="px-23 ">
                            <CircularProgress size={27} color="inherit" />
                          </div>
                        ) : (
                          <div>
                            <p>
                              <MyContent name="ชำระเงิน" fontSize="small" />
                            </p>
                          </div>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSubmit(selectMyCart)}
                        className="px-8 py-3 font-semibold rounded dark:bg-gray-800 dark:text-gray-100"
                        disabled={
                          loadingUser ||
                          isProcessingPayment ||
                          !checkCardNumberElement ||
                          !checkCardExpiryElement ||
                          !checkCardCvcElement
                        }
                      >
                        {loadingUser || isProcessingPayment ? (
                          <div className="px-23 ">
                            <CircularProgress size={27} color="inherit" />
                          </div>
                        ) : (
                          <div>
                            <p>
                              <MyContent name="ชำระเงิน" fontSize="small" />
                            </p>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
