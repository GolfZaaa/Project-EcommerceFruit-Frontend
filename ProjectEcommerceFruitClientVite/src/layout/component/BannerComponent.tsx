import React from "react";

export default function BannerComponent() {
  return (
    <div className="relative bottom-0 left-0 right-0 p-4 ">
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
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </span>
        <div className="flex-1 p-2">
          <p className="text-base dark:text-red-600 font-semibold">
            ท่านสามารถชำระเงินได้ โดยกรุณาเลือกดำเนินการทีละหนึ่งร้านเท่านั้น
          </p>
        </div>
      </div>
    </div>
  );
}
