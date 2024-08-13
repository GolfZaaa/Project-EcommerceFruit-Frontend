import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import AddressScreen from "../AddressScreen";

const TestOrderSummary = () => {
  const [paging, setPaging] = useState<number>(1);

  const data = [
    {
      id: 1,
      name: "ที่อยู่",
      color: "",
      image: "https://i.ibb.co/",
      description: "เพิ่มที่อยู่ของผู้ใช้งาน",
    },
    {
      id: 2,
      name: "ชำระเงิน",
      color: "",
      image: "https://i.ibb.co/",
      description: "ชำระสินค้าของผู้ใช้งาน",
    },
    {
      id: 3,
      name: "สำเร็จ",
      color: "",
      image: "https://i.ibb.co/",
      description: "ทำรายการเสร็จสิ้น",
    },
  ];

  const onChangePaging = (pageNumber: number) => {
    setPaging(pageNumber);
  };

  const test = [<AddressScreen />];

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="xl:w-10/12 w-full px-8">
          <div className="pt-10 flex flex-wrap items-center justify-center">
            {data.map((item) => (
              <div
                className="w-52 h-16 relative lg:mt-0 mt-4"
                onClick={() => onChangePaging(item.id)}
              >
                <img
                  src={
                    item.image +
                    (item.id === paging
                      ? "DwNs7zG/Steps.png"
                      : item.id === paging + 1
                      ? "wNZ4nzy/Steps2.png"
                      : "XCdjrhm/Steps4.png")
                  }
                  alt={"step" + item.id}
                  className="w-full h-full"
                />
                <div className="absolute w-full flex flex-col px-6 items-center justify-center inset-0 m-0">
                  <p
                    className={
                      "w-full text-sm font-medium leading-4" +
                      " " +
                      (item.id === paging
                        ? "text-white"
                        : item.id === paging + 1
                        ? "text-indigo-800"
                        : "text-gray-700")
                    }
                  >
                    {item.name}
                  </p>
                  <p
                    className={
                      "w-full text-xs mt-1 leading-none" +
                      " " +
                      (item.id === paging
                        ? "text-white"
                        : item.id === paging + 1
                        ? "text-indigo-800"
                        : "text-gray-500")
                    }
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {test[0]}
    </>
  );
};

export default observer(TestOrderSummary);
