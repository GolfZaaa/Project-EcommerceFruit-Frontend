import React from "react";

interface props {
  formattedTotalPrice: number;
  ShippingFee: number;
}

const TotalPrice = ({ formattedTotalPrice, ShippingFee }: props) => {
  return (
    <div className="rounded-sm flex flex-col px-4 xl:p-6 w-full bg-white">
      <div className="flex justify-between items-center w-full mb-3">
        <p className="text-base leading-4 text-gray-800">ราคารวม</p>
        <p className="text-base leading-4 text-gray-600">
          {formattedTotalPrice} บาท
        </p>
      </div>
      <div className="flex justify-between items-center w-full mb-3">
        <p className="text-base leading-4 text-gray-800">ค่าจัดส่ง</p>
        <p className="text-base leading-4 text-gray-600">{ShippingFee} บาท</p>
      </div>
      <div className="flex justify-between items-center w-full">
        <p className="text-base font-semibold leading-4 text-gray-800">
          ราคารวมทั้งหมด
        </p>
        <p className="text-base font-semibold leading-4 text-gray-600">
          {formattedTotalPrice + ShippingFee} บาท
        </p>
      </div>
    </div>
  );
};

export default TotalPrice;
