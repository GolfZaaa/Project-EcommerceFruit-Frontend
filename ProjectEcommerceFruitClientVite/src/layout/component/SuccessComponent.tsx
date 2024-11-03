import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../constants/RoutePath";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import animationData from "../../assets/successorder.mp4";
import { resetScroll } from "../../api/agent";
import MyContent from "../../component/MyContent";
import { formatDateThai } from "../../helper/components";

const OrderDetail = ({ title, content }:any) => (
  <dl className="flex items-center justify-between gap-4">
    <dt className="font-normal text-gray-500 dark:text-gray-400">
      <MyContent name={title} fontSize="small" />
    </dt>
    <dd className="font-medium text-gray-900 dark:text-black text-end">
      <MyContent name={content} fontSize="small" />
    </dd>
  </dl>
);

export default observer(function SuccessComponent() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { myAddressgotoOrder, getAddressgotoOrderByUserId } =
    useStore().addressStore;
  const { GetCartItemByUser, GetCartItemByUserOrderStore } =
    useStore().cartStore;

  useEffect(() => {
    GetCartItemByUser();
    getAddressgotoOrderByUserId();
    GetCartItemByUserOrderStore();
  }, []);

  const handleToProductScreen = () => {
    navigate(RoutePath.homeScreen);
    resetScroll();
  };

  const handleCheckOrder = () => {
    navigate(RoutePath.checkorderScreen);
  };

  return (
<div className="container mx-auto p-4">
  <section className="bg-white py-8 antialiased dark:bg-white md:py-16 rounded-lg">
    <div className="flex items-center justify-center mb-8">
      <video
        className="w-40 h-40 md:w-52 md:h-52 lg:w-56 lg:h-56"
        autoPlay
        muted
        loop
      >
        <source src={animationData} type="video/mp4" />
      </video>
    </div>

    <div className="mx-auto max-w-2xl px-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-black mb-4 text-center">
        <MyContent name="ขอบคุณสำหรับการสั่งซื้อครับ!" fontSize="large" />
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
        <MyContent
          name="คำสั่งซื้อของคุณจะถูกดำเนินการภายใน 24 ชั่วโมงในวันทำการ"
          fontSize="normal"
        />
      </p>

      <div className="space-y-4 p-6 bg-gray-50 border border-gray-50 rounded-lg dark:border-gray-500">
        <OrderDetail
          title="เวลาในการชำระสินค้า :"
          content={formatDateThai(currentTime, +543, 1)}
        />
        <OrderDetail
          title="ชื่อผู้ซื้อ :"
          content={myAddressgotoOrder?.user?.fullName || "N/A"}
        />
        <OrderDetail
          title="ที่อยู่ :"
          content={`${myAddressgotoOrder?.detail || ""}, ${
            myAddressgotoOrder?.subDistrict || ""
          }, ${myAddressgotoOrder?.district || ""}, ${
            myAddressgotoOrder?.province || ""
          }, ${myAddressgotoOrder?.postCode || ""}`}
        />
        <OrderDetail
          title="เบอร์โทรศัพท์ :"
          content={myAddressgotoOrder?.user?.phoneNumber || "N/A"}
        />
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleToProductScreen}
          className="bg-blue-700 text-white rounded-lg px-6 py-2.5 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition duration-200"
        >
          <MyContent name="กลับไปยังหน้าเลือกสินค้า" fontSize="small" />
        </button>
      </div>
    </div>
  </section>
</div>

  );
});
