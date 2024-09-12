import React from "react";

export default function ToastLoginRegister({ Check }: any) {
  return (
    <div>
      {Check === "Login Success" ? (
        <div className="fixed top-4 right-4 z-50">
          <div className="m-auto">
            <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
              <div className="flex flex-row">
                <div className="px-2 mt-1">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 1792 1792"
                    fill="#44C997"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
                  </svg>
                </div>
                <div className="ml-2 mr-6">
                  <span className="font-semibold">เข้าสู่ระบบเสร็จสิ้น</span>
                  <span className="block text-gray-500 text-xs">
                    การเข้าสู่ระบบเสร็จสมบูรณ์ เราจะนำท่านไปยังหน้าหลัก
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : Check === "Password Wrong" ? (
        <>
          <div className="fixed top-4 right-4 z-50">
            <div className="m-auto">
              <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
                <div className="flex flex-row">
                  <div className="px-2 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff0000"
                      stroke-width="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <div className="ml-2 mr-6">
                    <span className="font-semibold">เข้าสู่ระบบไม่สำเร็จ</span>
                    <span className="block text-gray-500 text-xs">
                      รหัสผ่านของคุณผิดพลาด กรุณาลองใหม่อีกครั้ง
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : Check === "PhoneNumber Wrong" ? (
        <>
          <div className="fixed top-4 right-4 z-50">
            <div className="m-auto">
              <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
                <div className="flex flex-row">
                  <div className="px-2 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff0000"
                      stroke-width="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <div className="ml-2 mr-6">
                    <span className="font-semibold">เข้าสู่ระบบไม่สำเร็จ</span>
                    <span className="block text-gray-500 text-xs">
                      เบอร์โทรศัพท์ของคุณผิดพลาด กรุณาลองใหม่อีกครั้ง
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ): Check === "Register Success" ? (
          <>
           <div className="fixed top-4 right-4 z-50">
            <div className="m-auto">
              <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
                <div className="flex flex-row">
                  <div className="px-2 mt-1">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 1792 1792"
                    fill="#44C997"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
                  </svg>
                  </div>
                  <div className="ml-2 mr-6">
                    <span className="font-semibold">สมัครสมาชิกเสร็จสิ้น</span>
                    <span className="block text-gray-500 text-xs">
                       การสมัครสมาชิกเสร็จสมบูรณ์ เราจะนำท่านไปยังหน้าเข้าสู่ระบบ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
      ):(
        <>
           <div className="fixed top-4 right-4 z-50">
            <div className="m-auto">
              <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
                <div className="flex flex-row">
                  <div className="px-2 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff0000"
                      stroke-width="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <div className="ml-2 mr-6">
                    <span className="font-semibold">สมัครสมาชิกไม่สำเร็จ</span>
                    <span className="block text-gray-500 text-xs">
                       การสมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบเบอร์โทรศัพท์ของท่าน
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
