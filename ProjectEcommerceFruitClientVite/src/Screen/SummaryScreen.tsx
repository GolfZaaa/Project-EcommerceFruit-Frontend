import React, { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import AddressList from "./address/AddressList";
import { useNavigate } from "react-router-dom";
import { pathImages, RoutePath } from "../constants/RoutePath";
import DropZoneImageComponent from "../layout/component/DropZoneImageComponent";
import dayjs from "dayjs";
import { myToast } from "../helper/components";
import { resetScroll } from "../api/agent";
import CircularProgress from "@mui/material/CircularProgress";

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
    cartItems,
    GetCartItemByUserOrderStore,
    cartItemsStore,
    selectMyCart,
  } = useStore().cartStore;

  const { CreateUpdateOrderById } = useStore().orderStore;
  const { systemSetting } = useStore().systemSettingStore;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("slip");

  const [onChangeAddress, setOnChangeAddress] = useState(false);

  const getData = async () => {
    await GetCartItemByUser();
    await getAddressgotoOrderByUserId();
    await GetCartItemByUserOrderStore();
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e: any) => {
    setSelectedPaymentMethod(e.target.value);

    if (e.target.value !== "slip") {
      setIsImageValid(true);
    }
  };

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

  const handleSubmit = async (value: any) => {
    if (selectedPaymentMethod === "slip" && !dropZoneImage) {
      setIsImageValid(false);

      myToast("กรุณาเพิ่มรูปภาพสลิป");

      return;
    }

    setLoadingUser(true);

    setTimeout(() => {
      setLoadingUser(false);
    }, 700);

    const Data = {
      PaymentImage: dropZoneImage,
      Tag: tag,
      StoreId: value[0].storeId,
    };

    const test = await CreateUpdateOrderById(Data);

    if (!!test) {
      navigate(RoutePath.successScreen);
      resetScroll();
    } else {
      alert("error");
    }
  };

  if (!selectMyCart.length) {
    navigate(RoutePath.cartScreen);
  }

  return (
    <div className="bg-gray-50 -mt-8">
      <div className="ml-10 mr-10">
        <div className="mt-8 flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
          <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-white space-y-6 shadow-md rounded-sm">
            <div className="flex">
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
                ที่อยู่ในการจัดส่ง
              </h3>
            </div>

            {!onChangeAddress ? (
              <div className="flex flex-col md:flex-row md:justify-between items-center w-full space-y-4 md:space-y-0">
                <div className="flex-1">
                  <p className="text-lg leading-4 text-gray-800 font-semibold">
                    {myAddressgotoOrder?.user?.fullName} เบอร์ :
                    {myAddressgotoOrder?.user?.phoneNumber}
                  </p>
                </div>
                <div className="flex-1 -ml-96">
                  <p className="text-lg leading-4 text-gray-800 font-medium">
                    {myAddressgotoOrder?.detail} แขวง/ตำบล
                    {myAddressgotoOrder?.subDistrict} เขต/อำเภอ
                    {myAddressgotoOrder?.district} จังหวัด
                    {myAddressgotoOrder?.province} รหัสไปรษณีย์{" "}
                    {myAddressgotoOrder?.postCode}
                  </p>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <button
                    onClick={() => {
                      getAddressByUserId();
                      setOnChangeAddress(true);
                    }}
                    className="text-lg leading-4 text-blue-700 font-medium"
                  >
                    เปลี่ยน
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
                    การชำระเงิน
                  </a>
                  <p className="text-base font-medium leading-6 text-gray-600">
                    {dayjs(new Date()).add(543, "year").format("DD/MM/YYYY")}
                  </p>
                </div>

                <div className="flex justify-between w-full px-4">
                  <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 w-1/4">
                    ตะกร้าสินค้า
                  </p>
                  <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 w-1/4 text-center">
                    ราคาสินค้า
                  </p>
                  <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 w-1/4 text-center">
                    จำนวน
                  </p>
                  <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 w-1/4 text-right">
                    ราคารวม
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
                                  className="w-20 h-20"
                                  src={pathImages.product + item.images}
                                  alt={item.images || "product image"}
                                />
                                <h3 className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                                  {items.productName}
                                </h3>
                              </div>

                              {/* ราคาสินค้า */}
                              <div className="w-1/4 text-center">
                                <p className="text-base xl:text-lg leading-6">
                                  {item.price.toLocaleString()} บาท
                                </p>
                              </div>
                              {/* จำนวน */}
                              <div className="w-1/4 text-center">
                                <p className="text-base xl:text-lg leading-6 text-gray-800">
                                  {item.quantityInCartItem}
                                </p>
                              </div>
                              {/* ราคารวม */}
                              <div className="w-1/4 text-right">
                                <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                                  {formatTotalPriceForProduct} บาท
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
                    วิธีการชำระเงิน
                  </h3>
                  <div className="flex justify-center flex-wrap gap-4 items-center">
                    <label
                      className={`flex items-center space-x-3 p-3 ${
                        selectedPaymentMethod === "credit-card"
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }  rounded-lg shadow-sm cursor-pointer w-44 h-16 justify-center`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value="credit-card"
                        checked={selectedPaymentMethod === "credit-card"}
                        onChange={handleChange}
                        className={`form-radio text-blue-500 w-4 h-4 `}
                      />
                      <span
                        className={`text-base font-medium text-gray-800 ml-2 ${
                          selectedPaymentMethod === "credit-card"
                            ? "text-white font-bold"
                            : "text-gray-800"
                        }`}
                      >
                        บัตรเครดิต
                      </span>
                    </label>
                    <label
                      className={`flex items-center space-x-3 p-3 ${
                        selectedPaymentMethod === "slip"
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }  rounded-lg shadow-sm cursor-pointer w-44 h-16 justify-center `}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value="slip"
                        checked={selectedPaymentMethod === "slip"}
                        onChange={handleChange}
                        className={`form-radio text-blue-500 w-4 h-4 ${
                          selectedPaymentMethod === "slip"
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />

                      <span
                        className={`text-base font-medium ml-2 ${
                          selectedPaymentMethod === "slip"
                            ? "text-white font-bold"
                            : "text-gray-800"
                        }`}
                      >
                        สลีปการโอน
                      </span>
                    </label>
                  </div>

                  {selectedPaymentMethod === "slip" ? (
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
                            กรุณาอัปโหลดรูปภาพสลีปการโอน
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p>กรอกบัตรเครดิต</p>
                    </div>
                  )}
                </div>

                <div className=" shadow-md rounded-sm  flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-white space-y-6">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800">
                    สรุปการสั่งซื้อ
                  </h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base leading-4 text-gray-800">
                        รายการทั้งหมด
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        {selectMyCart.length} รายการ
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base leading-4 text-gray-800">
                        ราคารวม
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        {totalPrice.toLocaleString()} บาท
                      </p>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <p className="text-base leading-4 text-gray-800">
                        ค่าจัดส่ง
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        {systemSetting[0]?.shippingCost} บาท
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      ราคารวมทั้งหมด
                    </p>
                    <p className="text-base font-semibold leading-4 text-gray-600">
                      {formattedTotalPrice} บาท
                    </p>
                  </div>

                  <div className="text-end">
                    <button
                      type="button"
                      onClick={() => handleSubmit(selectMyCart)}
                      className="px-8 py-3 font-semibold rounded dark:bg-gray-800 dark:text-gray-100"
                      disabled={loadingUser}
                    >
                      {loadingUser ? (
                        <div className="px-22 ">
                          <CircularProgress size={17} color="inherit" />
                        </div>
                      ) : (
                        <div>
                          <p>ชำระเงิน</p>
                        </div>
                      )}
                    </button>
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