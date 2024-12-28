import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import AddressScreen from "../AddressScreen";
import SummaryScreen from "../SummaryScreen";
import { useStore } from "../../store/store";
import MyContent from "../../component/MyContent";
import SuccessComponent from "../../layout/component/SuccessComponent";
import { imageLocal } from "../../constants/RoutePath";
import { useParams } from "react-router-dom";

const OrderSummary = () => {
  const { id } = useParams<{ id: string }>();

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

  console.log("Number(id)", Number(id));

  const [paging, setPaging] = useState<number>(
    Number(id) !== 3 ? Number(id) : 2
  );

  console.log("paging", paging);

  const onChangePaging = (pageNumber: number) => {
    setPaging(pageNumber);
  };

  const screens = [
    <AddressScreen onChangePaging={onChangePaging} />,
    <SummaryScreen onChangePaging={onChangePaging} />,
    <SuccessComponent />,
  ];

  return (
    <>
      <div className="flex items-center justify-center bg-gray-50 ">
        <div className="xl:w-10/12 w-full px-8">
          <div className="pt-10 flex flex-wrap items-center justify-center">
            {data.map((item) => (
              <div
                className="w-62 h-16 relative lg:mt-0 mt-4 mb-8"
                // onClick={() => onChangePaging(item.id)}
              >
                <img
                  src={
                    // item.image +
                    item.id === paging
                      ? // ? "wNZ4nzy/Steps2.png"
                        imageLocal.step2
                      : item.id >= paging + 1
                      ? // ? "XCdjrhm/Steps4.png"
                        imageLocal.step4
                      : // : "DwNs7zG/Steps.png")
                        imageLocal.step
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
                        ? "text-gray-500"
                        : item.id >= paging + 1
                        ? "text-indigo-800"
                        : "text-white")
                    }
                  >
                    <MyContent name={item.name} fontSize="littlenormal" />
                  </p>
                  <p
                    className={
                      "w-full text-xs mt-1 leading-none" +
                      " " +
                      (item.id === paging
                        ? "text-gray-500"
                        : item.id >= paging + 1
                        ? "text-indigo-800"
                        : "text-white")
                    }
                  >
                    <MyContent name={item.description} fontSize="small" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {screens[paging - 1]}
    </>
  );
};

export default observer(OrderSummary);
