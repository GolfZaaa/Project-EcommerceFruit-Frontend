import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStore } from "../../store/store";
import { LuSend } from "react-icons/lu";

export default observer(function BannerSendComponent() {
  
  return (
    <div>
        <div>
          <div className="relative bottom-0 left-0 right-0 p-4 -mt-5">
            <div className=" flex flex-row pl-4 py-1 gap-2 items-center border rounded-lg shadow overflow-hidden dark:bg-gray-50 dark:border-red-400">
              <span className="flex-shrink-0 inline-flex mx-3 item-center justify-center leading-none rounded-full  dark:text-gray-50">
              <svg
  xmlns="http://www.w3.org/2000/svg"
  width="37"
  height="57"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#ff0000"
  strokeWidth="3.5"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <rect x="3" y="7" width="18" height="13" rx="2" ry="2"></rect>
  <path d="M3 7l9 6 9-6"></path>
  
</svg>

              </span>
              <div className="flex-1 p-2">
                <p className="text-base dark:text-red-600 font-medium">
                เมื่อกดรับหิ้วสินค้าแล้ว ท่านจำเป็นต้องจัดส่งสินค้าให้ถึงมือผู้รับโดยสมบูรณ์ เพื่อความพึงพอใจและความสะดวกของผู้รับ
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
});
