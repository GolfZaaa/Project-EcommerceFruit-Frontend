import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../constants/RoutePath";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";

// import { Player, Controls } from '@lottiefiles/react-lottie-player';
import animationData from "../../assets/successorder.mp4";

export default observer(function SuccessComponent() {
  const navigate = useNavigate();

  const handleToProductScreen = () => {
    navigate(RoutePath.homeScreen);
  };

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

  const handleCheckOrder = () => {
    navigate(RoutePath.checkorderScreen);
  };

  return (
    <div>
      <section className="bg-white py-8 antialiased dark:bg-white md:py-16">
        <div className="flex items-center justify-center min-w-screen -mt-16 mb-5">
          {/* <Player
        autoplay
        loop
        src={animationData}
        style={{ height: '250px', width: '200px' }}
      >
      </Player> */}
          <video width="250" height="250" autoPlay muted loop>
            <source src={animationData} type="video/mp4" />
          </video>
        </div>

        <div className="mx-auto max-w-2xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-black sm:text-2xl mb-2">
            ขอบคุณสำหรับการสั่งซื้อครับ!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
            คำสั่งซื้อ{" "}
            {/* <a
              href="#"
              className="font-medium text-gray-900 dark:text-black hover:underline"
            >
              #7564804
            </a>{" "} */}
            ของคุณจะถูกดำเนินการภายใน 24 ชั่วโมงในวันทำการ
          </p>
          <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-white mb-6 md:mb-8">
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                เวลาในการชำระสินค้า :
              </dt>
              <dd className="font-medium text-gray-900 dark:text-black sm:text-end">
                {currentTime.toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                ชื่อผู้ซื้อ :
              </dt>
              <dd className="font-medium text-gray-900 dark:text-black sm:text-end">
                {myAddressgotoOrder?.user?.fullName}
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                ที่อยู่ :
              </dt>
              <dd className="font-medium text-gray-900 dark:text-black sm:text-end w-52">
                <div className="flex-1">
                  <p className="text-base leading-4 text-gray-800 font-normal">
                    {myAddressgotoOrder?.detail}{" "}
                    {myAddressgotoOrder?.subDistrict}, &nbsp;
                    {myAddressgotoOrder?.district}, &nbsp;
                    {myAddressgotoOrder?.province}
                    {myAddressgotoOrder?.postCode}
                  </p>
                </div>
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                เบอร์โทรศัพท์ :
              </dt>
              <dd className="font-medium text-gray-900 dark:text-black sm:text-end">
                {myAddressgotoOrder?.user?.phoneNumber}
              </dd>
            </dl>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={handleCheckOrder}
              className="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >
              ตรวจสอบคำสั่งซื้อ
            </button> */}

            <button
              onClick={handleToProductScreen}
              className="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >
              กลับไปยังหน้าเลือกสินค้า
            </button>

            {/* <button
              onClick={handleToProductScreen}
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              กลับไปยังหน้าเลือกสินค้า
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
});
