import React, { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import AddressList from "./address/AddressList";

export default observer(function SummaryScreen() {
  const {
    myAddressgotoOrder,
    getAddressgotoOrderByUserId,
    getAddressByUserId,
  } = useStore().addressStore;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("slip");

  const [onChangeAddress, setOnChangeAddress] = useState(false);

  useEffect(() => {
    getAddressgotoOrderByUserId();
  }, []);

  const handleChange = (e: any) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const confirmChangeAddress = () => {
    setOnChangeAddress(false);
  };

  console.log("myAddressgotoOrder", JSON.stringify(myAddressgotoOrder));

  return (
    <div className="bg-gray-50">
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
                    {/* นายอวิรุทธ์ ไชยสงคราม (+66) 925721318 */}
                  </p>
                </div>
                <div className="flex-1 -ml-24">
                  <p className="text-lg leading-4 text-gray-800 font-medium">
                    {myAddressgotoOrder?.detail} แขวง/ตำบล
                    {myAddressgotoOrder?.subDistrict} เขต/อำเภอ
                    {myAddressgotoOrder?.district} จังหวัด
                    {myAddressgotoOrder?.province} รหัสไปรษณีย์{" "}
                    {myAddressgotoOrder?.postCode}
                    {/* ร้านก๊อตไดนาโม, เลขที่ 11/3, หมู่ที่ 2, ตำบล ท่าล้อ,
                  อำเภอท่าม่วง */}
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
                  <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">
                    การชำระเงิน
                  </h1>
                  <p className="text-base font-medium leading-6 text-gray-600">
                    13/8/2567
                  </p>
                </div>

                <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
                  ตะกร้าสินค้า
                </p>
                <div className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full ">
                  <div className="pb-4 md:pb-8 w-full md:w-40">
                    <img
                      className="w-full hidden md:block"
                      src="https://rukminim2.flixcart.com/image/850/1000/l0jwbrk0/plant-seed/f/p/z/10-mm-03-paudha-original-imagcbe2unguekkc.jpeg?q=90&crop=false"
                      alt="dress"
                    />
                    <img
                      className="w-full md:hidden"
                      src="https://i.ibb.co/L039qbN/Rectangle-10.png"
                      alt="dress"
                    />
                  </div>
                  <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                      <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                        ผลมุ้ย
                      </h3>
                    </div>
                    <div className="flex justify-between space-x-8 items-start w-full">
                      <p className="text-base xl:text-lg leading-6">$36.00 </p>
                      <p className="text-base xl:text-lg leading-6 text-gray-800">
                        01
                      </p>
                      <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                        $36.00
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 flex justify-start flex-col md:flex-row  items-start md:items-center space-y-4  md:space-x-6 xl:space-x-8 w-full ">
                  <div className="w-full md:w-40">
                    <img
                      className="w-full hidden md:block"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXgCIuAJeV3avZiSnIR4aw3Wr9nxKf64uvrg&s"
                      alt="dress"
                    />
                    <img
                      className="w-full md:hidden"
                      src="https://i.ibb.co/BwYWJbJ/Rectangle-10.png"
                      alt="dress"
                    />
                  </div>
                  <div className="  flex justify-between items-start w-full flex-col md:flex-row space-y-4 md:space-y-0  ">
                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                      <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                        ผลใช่
                      </h3>
                    </div>
                    <div className="flex justify-between space-x-8 items-start w-full">
                      <p className="text-base xl:text-lg leading-6">$20.00 </p>
                      <p className="text-base xl:text-lg leading-6 text-gray-800">
                        01
                      </p>
                      <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                        $20.00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
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
                </div>

                <div className=" shadow-md rounded-sm  flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-white space-y-6   ">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800">
                    สรุปการสั่งซื้อ
                  </h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base leading-4 text-gray-800">
                        รายการทั้งหมด
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        2 รายการ
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      ราคารวมทั้งหมด
                    </p>
                    <p className="text-base font-semibold leading-4 text-gray-600">
                      $36.00
                    </p>
                  </div>

                  <div className="text-end">
                    <button
                      type="button"
                      className="px-8 py-3 font-semibold rounded dark:bg-gray-800 dark:text-gray-100"
                    >
                      ชำระเงิน
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
