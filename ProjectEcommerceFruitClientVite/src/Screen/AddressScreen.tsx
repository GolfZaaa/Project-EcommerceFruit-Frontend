import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { RoutePath } from "../constants/RoutePath";
import { Address } from "../models/Address";
import { TextField, Box } from "@mui/material";
import { CreateInput } from "thai-address-autocomplete-react";
import { NavLink } from "react-router-dom";
import { myToast } from "../helper/components";

const InputThaiAddress = CreateInput();

export default observer(function AddressScreen({ onChangePaging }: any) {
  const {
    createUpdateAddress,
    getAddressByUserId,
    getAddressgotoOrderByUserId,
  } = useStore().addressStore;

  const [createAddress, setCreateAddress] = useState<Address | any>({
    district: "",
    amphoe: "",
    province: "",
    zipcode: "",
    detail: "",
  });

  const { GetCartItemByUser, cartItems, GetCartItemByUserOrderStore } =
    useStore().cartStore;

  const getData = async () => {
    await GetCartItemByUser();
    await GetCartItemByUserOrderStore();
    await getAddressgotoOrderByUserId();
  };

  useEffect(() => {
    getData();
  }, []);

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
      isUsed: true,
      gps: "",
    };

    await createUpdateAddress(dataAddress).then((result) => {
      if (!!result) {
        myToast("เพิ่มที่อยู่สำเร็จ");
        getAddressByUserId();
        onChangePaging(2);
        window.scrollTo(0, 0);
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
                className="focus:outline-none focus:ring-gray-500 focus:ring-offset-2 mt-8 text-base font-medium focus:ring-2 focus:ring-ocus:ring-gray-800 leading-4 hover:bg-black py-4 w-full md:w-4/12 lg:w-full text-white bg-gray-800"
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
