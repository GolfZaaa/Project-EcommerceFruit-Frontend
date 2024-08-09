  import { observer } from "mobx-react-lite";
  import React from "react";
  import { Link } from "react-router-dom";
  import { useStore } from "../store/store";
  import { createFormData } from "../api/agent";
  import { RoutePath } from "../constants/RoutePath";
  

  
  export default observer(function RegisterScreen() {
    const { register } = useStore().userStore;
  
    const handleSubmit = async (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const formData: any = Object.fromEntries(data.entries());
     const user = await register(formData);

      // register(formData);
      console.log("formData",user)
    };
  
    return (
      <div className="py-16">
      {/* {showToast && <ToastLogin Check={checkToast} />} */}
      <form onSubmit={handleSubmit}>
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                "url('https://img.kapook.com/u/2020/surauch/shutterstock_1127278484.jpg')",
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <div className="align-middle justify-center flex items-center">
              <img
                className="w-16 h-24"
                src="https://www.kru.ac.th/kru/assets/img/kru/logo/kru_color.png"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-600 text-center">
              มหาวิทยาลัยราชภัฏกาญจนบุรี
            </h2>
            {/* <p className="text-xl text-gray-600 text-center">ยินดีต้อนรับ</p> */}
            <a
              href="#"
              className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
            ></a>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p
                className="text-2xl text-center text-gray-700 uppercase"
              >
                สมัครสมาชิก
              </p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ชื่อ - นามสกุล
              </label>
              <input
                id="FullName"
                name="FullName"
                type="text"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                id="PhoneNumber"
                name="PhoneNumber"
                type="text"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  รหัสผ่าน
                </label>
              </div>
              <input
                id="Password"
                name="Password"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              />
            </div>

            <div className="mt-4 flex justify-end items-center">
              <p className="text-sm text-gray-500 uppercase mr-2">
                มีสมาชิกแล้ว?
              </p>
              <a href="#" className="text-blue-500 hover:underline">
                เข้าสู่ระบบ
              </a>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    );
  });
  