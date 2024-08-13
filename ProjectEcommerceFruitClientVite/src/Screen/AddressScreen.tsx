import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../constants/RoutePath";

export default observer(function AddressScreen() {
  const navigate = useNavigate();
  const { myAddress } = useStore().addressStore;
import { Address } from "../models/Address";
import {
  Grid,
  Card,
  CardContent,
  Switch,
  Fab,
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { CreateInput } from "thai-address-autocomplete-react";
import { RoutePath } from "../constants/RoutePath";
import { NavLink } from "react-router-dom";
import { myToast } from "../helper/components";

const InputThaiAddress = CreateInput();

export default observer(function AddressScreen() {
  const { createUpdateAddress, getAddressByUserId } = useStore().addressStore;

  const [createAddress, setCreateAddress] = useState<Address | any>({
    district: "", // ตำบล tambol
    amphoe: "", // อำเภอ amphoe
    province: "", // จังหวัด changwat
    zipcode: "", // รหัสไปรษณีย์ postal code
    detail: "", // รหัสไปรษณีย์ postal code
  });

  const { GetCartItemByUser, cartItems, GetCartItemByUserOrderStore } =
    useStore().cartStore;

  useEffect(() => {
    GetCartItemByUser();
    GetCartItemByUserOrderStore();
  }, []);

  const handleSummaryScreen = () => {
          navigate(RoutePath.summaryScreen);
  }
  console.log("cartItems", cartItems.length);
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const dataAddress = {
      id: 0,
      subDistrict: createAddress.district,
      district: createAddress.amphoe,
      province: createAddress.province,
      postCode: createAddress.zipcode,
      detail: formData.detail,
      isUsed_Store: false,
      isUsed: false,
      gps: "",
    };

    await createUpdateAddress(dataAddress).then((result) => {
      if (!!result) {
        myToast("เพิ่มที่อยู่สำเร็จ");
        getAddressByUserId();
        console.log("formData", formData);
      }
    });
  };

  const handleChange = (scope: string) => (value: string) => {
    setCreateAddress((oldAddr: Address) => ({
      ...oldAddr,
      [scope]: value,
    }));
  };

  const handleSelect = (address: Address) => {
    setCreateAddress(address);
  };

  return (
    <div className="overflow-y-hidden">
      <div className="flex items-center justify-center">
        <div className="xl:w-10/12 w-full px-8">
          <div className=" pt-10 flex flex-wrap items-center justify-center">
            <div className="w-52 h-16 relative md:mt-0 mt-4">
              <img
                src="https://i.ibb.co/DwNs7zG/Steps.png"
                alt="step1"
                className="w-full h-full"
              />
              <div className="absolute w-full flex flex-col px-6 items-center justify-center inset-0 m-0">
                <p className="w-full text-sm font-medium leading-4 text-white">
                  ที่อยู่
                </p>
                <p className="w-full text-xs mt-1 leading-none text-white">
                  เพิ่มที่อยู่ของผู้ใช้งาน
                </p>
              </div>
            </div>
            <div className="w-52 h-16 relative md:mt-0 mt-4">
              <img
                src="https://i.ibb.co/wNZ4nzy/Steps2.png"
                alt="step2"
                className="w-full h-full"
              />
              <div className="absolute w-full flex flex-col px-6 items-center justify-center inset-0 m-0">
                <p className="w-full text-sm font-medium leading-4 text-indigo-800">
                  ชำระเงิน
                </p>
                <p className="w-full text-xs mt-1 leading-none text-indigo-800">
                  ชำระสินค้าของผู้ใช้งาน
                </p>
              </div>
            </div>
            <div className="w-52 h-16 relative lg:mt-0 mt-4">
              <img
                src="https://i.ibb.co/XCdjrhm/Steps4.png"
                alt="step4"
                className="w-full h-full"
              />
              <div className="absolute w-full flex flex-col px-6 items-center justify-center inset-0 m-0">
                <p className="w-full text-sm font-medium leading-4 text-gray-700">
                  สำเร็จ
                </p>
                <p className="w-full text-xs mt-1 leading-none text-gray-500">
                  ทำรายการเสร็จสิ้น
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center 2xl:container 2xl:mx-auto lg:py-16 md:py-12 py-9 px-4 md:px-6 lg:px-20 xl:px-44 ">
        <div className="flex w-full sm:w-9/12 lg:w-full flex-col lg:flex-row justify-center items-center lg:space-x-10 2xl:space-x-36 space-y-12 lg:space-y-0">
          <div className="flex w-full  flex-col justify-start items-start">
            <div>
              <p className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
                เพิ่มที่อยู่ผู้รับ
              </p>
            </div>
            <div className="mt-2">
              <NavLink
                to={RoutePath.cartScreen}
                className="text-base leading-4 underline  hover:text-gray-800 text-gray-600"
              >
                กลับไปยังหน้าตะกร้า
              </NavLink>
            </div>
            <div className="mt-12">
              <p className="text-xl font-semibold leading-5 text-gray-800">
                รายละเอียดที่อยู่การจัดส่ง
              </p>
            </div>
            <div className="mt-8 flex flex-col justify-start items-start w-full space-y-8 ">
              <div className="relative w-full">
                <p
                  id="button1"
                  className=" px-2 border-b border-gray-200 text-left leading-4 text-base text-gray-600 py-4 w-full"
                >
                  {changeText2}
                </p>
                <button
                  onClick={() => setDropdown1(!dropdown1)}
                  className="focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full cursor-pointer absolute bottom-4 right-0"
                >
                  <svg
                    id="close"
                    className={` transform ${dropdown1 ? "rotate-180" : ""}  `}
                    width={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6L8 10L4 6"
                      stroke="#4B5563"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className={`shadow absolute z-10 bg-white top-10  w-full mt-3 ${
                    dropdown1 ? "" : "hidden"
                  }`}
                >
                  <div className="flex flex-col  w-full">
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("London")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      London
                    </p>
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("New York")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      New York
                    </p>
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("Dubai")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      Dubai
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative w-full">
                <p
                  id="button1"
                  className=" px-2 border-b border-gray-200 text-left leading-4 text-base text-gray-600 py-4 w-full"
                >
                  {changeText3}
                </p>
                <button
                  onClick={() => setDropdown1(!dropdown1)}
                  className="focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full cursor-pointer absolute bottom-4 right-0"
                >
                  <svg
                    id="close"
                    className={` transform ${dropdown1 ? "rotate-180" : ""}  `}
                    width={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6L8 10L4 6"
                      stroke="#4B5563"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className={`shadow absolute z-10 bg-white top-10  w-full mt-3 ${
                    dropdown1 ? "" : "hidden"
                  }`}
                >
                  <div className="flex flex-col  w-full">
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("London")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      London
                    </p>
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("New York")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      New York
                    </p>
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("Dubai")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      Dubai
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative w-full">
                <p
                  id="button1"
                  className=" px-2 border-b border-gray-200 text-left leading-4 text-base text-gray-600 py-4 w-full"
                >
                  {changeText4}
                </p>
                <button
                  onClick={() => setDropdown1(!dropdown1)}
                  className="focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full cursor-pointer absolute bottom-4 right-0"
                >
                  <svg
                    id="close"
                    className={` transform ${dropdown1 ? "rotate-180" : ""}  `}
                    width={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6L8 10L4 6"
                      stroke="#4B5563"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className={`shadow absolute z-10 bg-white top-10  w-full mt-3 ${
                    dropdown1 ? "" : "hidden"
                  }`}
                >
                  <div className="flex flex-col  w-full">
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("London")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      London
                    </p>
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("New York")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      New York
                    </p>
                    <p
                      tabIndex={0}
                      onClick={() => HandleText1("Dubai")}
                      className="focus:outline-none cursor-pointer px-3 hover:text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-left  text-base text-gray-600 py-2 w-full"
                    >
                      Dubai
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between flex-col sm:flex-row w-full items-start space-y-8 sm:space-y-0 sm:space-x-8">
                <div className="relative w-full">
                  <input
                    className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-3 w-full"
                    type="text"
                    placeholder="บ้านเลขที่"
                  />
                </div>
                <div className="relative w-full">
                  <input
                    className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-3 w-full"
                    type="text"
                    placeholder="หมู่"
                  />
                </div>
              </div>
              <div className="flex justify-between flex-col sm:flex-row w-full items-start space-y-8 sm:space-y-0 sm:space-x-8">
                <div className="relative w-full">
                  <input
                    className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-3 w-full"
                    type="text"
                    placeholder="ซอย"
                  />
                </div>
                <div className="w-full">
                  <input
                    className="focus:outline-none focus:ring-2 focus:ring-gray-500 px-2 border-b border-gray-200 leading-4 text-base placeholder-gray-600 pt-4 pb-3   w-full"
                    type="text"
                    placeholder="รหัสไปรษณีย์"
                  />
                </div>
              </div>
            </div>
            <button onClick={handleSummaryScreen}  className="focus:outline-none focus:ring-gray-500 focus:ring-offset-2 mt-8 text-base font-medium focus:ring-2 focus:ring-ocus:ring-gray-800 leading-4 hover:bg-black py-4 w-full md:w-4/12 lg:w-full text-white bg-gray-800">
              ดำเนินการชำระเงิน
            </button>
            <Box mt={2} component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="บ้านเลขที่, หมู่, ซอย, ถนน"
                variant="outlined"
                margin="normal"
                name="detail"
                required
              />
              <label>แขวง/ตำบล</label>
              <InputThaiAddress.District
                value={createAddress["district"]}
                onChange={handleChange("district")}
                onSelect={(e: any) => handleSelect(e)}
              />
              <label>เขต/อำเภอ</label>
              <InputThaiAddress.Amphoe
                value={createAddress["amphoe"]}
                onChange={handleChange("amphoe")}
                onSelect={(e: any) => handleSelect(e)}
              />
              <label>จังหวัด</label>
              <InputThaiAddress.Province
                value={createAddress["province"]}
                onChange={handleChange("province")}
                onSelect={(e: any) => handleSelect(e)}
              />
              <label>รหัสไปรษณีย์</label>
              <InputThaiAddress.Zipcode
                value={createAddress["zipcode"]}
                onChange={handleChange("zipcode")}
                onSelect={(e: any) => handleSelect(e)}
              />
              <button
                type="submit"
                className="focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-8 text-base font-medium focus:ring-2 focus:ring-ocus:ring-gray-800 leading-4 hover:bg-black py-4 w-full md:w-4/12 lg:w-full text-white bg-gray-800"
              >
                ดำเนินการชำระเงิน
              </button>
            </Box>
            <div className="mt-4 flex justify-start items-center w-full">
              <NavLink
                to={RoutePath.cartScreen}
                className="text-base leading-4 underline focus:outline-none focus:text-gray-500  hover:text-gray-800 text-gray-600"
              >
                กลับไปยังหน้าตะกร้า
              </NavLink>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start bg-gray-50 w-full p-6 md:p-14">
            <div>
              <h1 className="text-2xl font-semibold leading-6 text-gray-800">
                สรุปการสั่งซื้อ
              </h1>
            </div>
            <div className="flex mt-7 flex-col items-end w-full space-y-6">
              <div className="flex justify-between w-full items-center">
                <p className="text-lg leading-4 text-gray-600">รายการทั้งหมด</p>
                <p className="text-lg font-semibold leading-4 text-gray-600">
                  {cartItems.length} รายการ
                </p>
              </div>
              <div className="flex justify-between w-full items-center">
                <p className="text-lg leading-4 text-gray-600">
                  ค่าใช้จ่ายทั้งหมด
                </p>
                <p className="text-lg font-semibold leading-4 text-gray-600">
                  $2790
                </p>
              </div>
            </div>
            <div className="flex justify-between w-full items-center mt-32">
              <p className="text-xl font-semibold leading-4 text-gray-800">
                ค่าใช้จ่ายทั้งหมด{" "}
              </p>
              <p className="text-lg font-semibold leading-4 text-gray-800">
                $2900
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
