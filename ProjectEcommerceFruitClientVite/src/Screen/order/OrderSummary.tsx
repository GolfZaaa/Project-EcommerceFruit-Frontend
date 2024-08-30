import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import AddressScreen from "../AddressScreen";
import SummaryScreen from "../SummaryScreen";
import { useStore } from "../../store/store";

const OrderSummary = () => {
  const { myAddressgotoOrder, getAddressgotoOrderByUserId } =
    useStore().addressStore;

  const [paging, setPaging] = useState<number>(1);

  console.log("myAddressgotoOrder", JSON.stringify(myAddressgotoOrder));
  console.log("myAddressgotoOrder2", myAddressgotoOrder);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await getAddressgotoOrderByUserId().then(() => {
      if (myAddressgotoOrder) {
        setPaging(2);
      } else {
        setPaging(1);
      }
    });
  };

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

  const screens = [
    <AddressScreen onChangePaging={onChangePaging} />,
    <SummaryScreen />,
  ];

  return (
    <>
      <div className="flex items-center justify-center bg-gray-50 ">
        <div className="xl:w-10/12 w-full px-8">
          <div className="pt-10 flex flex-wrap items-center justify-center">
            {data.map((item) => (
              <div
                className="w-52 h-16 relative lg:mt-0 mt-4 mb-8"
                // onClick={() => onChangePaging(item.id)}
              >
                <img
                  src={
                    item.image +
                    (item.id === paging
                      ? "wNZ4nzy/Steps2.png"
                      : item.id === paging + 1
                      ? "XCdjrhm/Steps4.png"
                      : "DwNs7zG/Steps.png")
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
                        : item.id === paging + 1
                        ? "text-indigo-800"
                        : "text-white")
                    }
                  >
                    {item.name}
                  </p>
                  <p
                    className={
                      "w-full text-xs mt-1 leading-none" +
                      " " +
                      (item.id === paging
                        ? "text-gray-500"
                        : item.id === paging + 1
                        ? "text-indigo-800"
                        : "text-white")
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

      {screens[paging - 1]}
    </>
  );
};

export default observer(OrderSummary);
