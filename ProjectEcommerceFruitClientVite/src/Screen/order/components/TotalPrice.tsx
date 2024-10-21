import React from "react";
import MyContent from "../../../component/MyContent";

interface props {
  formattedTotalPrice: number;
  ShippingFee: number;
}

const TotalPrice = ({ formattedTotalPrice, ShippingFee }: props) => {
  return (
    <div className="rounded-sm flex flex-col px-4 xl:p-6 w-full bg-white">
      <div className="flex justify-between items-center w-full mb-3">
        <p className="text-base leading-4 text-gray-800">
          <MyContent name="ราคารวม" fontSize="small" />
        </p>
        <p className="text-base leading-4 text-gray-600">
          <MyContent name={`${formattedTotalPrice} บาท`} fontSize="small" />
        </p>
      </div>
      <div className="flex justify-between items-center w-full mb-3">
        <p className="text-base leading-4 text-gray-800">
          {" "}
          <MyContent name="ค่าจัดส่ง" fontSize="small" />
        </p>
        <p className="text-base leading-4 text-gray-600">
          {" "}
          <MyContent name={`${ShippingFee} บาท`} fontSize="small" />
        </p>
      </div>
      <div className="flex justify-between items-center w-full">
        <p className="text-base font-semibold leading-4 text-gray-800">
          <MyContent name="ราคารวมทั้งหมด" fontSize="small" />
        </p>
        <p className="text-base font-semibold leading-4 text-gray-600">
          <MyContent
            name={`${formattedTotalPrice + ShippingFee} บาท`}
            fontSize="small"
          />
        </p>
      </div>
    </div>
  );
};

export default TotalPrice;
