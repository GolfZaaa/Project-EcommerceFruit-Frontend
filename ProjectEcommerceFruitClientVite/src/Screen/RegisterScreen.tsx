import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useStore } from "../store/store";
import { NavLink, useNavigate } from "react-router-dom";
import { RoutePath } from "../constants/RoutePath";
import ToastLoginRegister from "../layout/component/ToastLoginRegister";
import CircularProgress from "@mui/material/CircularProgress";
import "./css/register-style.css";

export default observer(function RegisterScreen() {
  const { register, loadingUser } = useStore().userStore;
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [checkToast, setCheckToast] = useState("");

  const [fullName, setFullName] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const fullName = formData.FullName;
    const phoneNumber = formData.PhoneNumber;
    const password = formData.Password;
    let valid = true;

    if (!/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError(
        "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก และเป็นตัวเลขเท่านั้น"
      );
      valid = false;
    } else {
      setPhoneNumberError("");
    }

    if (!password) {
      setPasswordError("กรุณากรอกรหัสผ่าน");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!fullName) {
      setFullName("กรุณากรอกชื่อ-นามสกุล");
      valid = false;
    } else {
      setFullName("");
    }

    if (!valid) {
      return;
    }
    const response: any = await register(formData);
    if (response && response.response && response.response.status === 400) {
      setShowToast(true);
      setCheckToast("Register Failed");
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } else {
      setShowToast(true);
      setCheckToast("Register Success");
      setTimeout(() => {
        setShowToast(false);
        resetScroll();
        navigate(RoutePath.loginScreen);
      }, 3000);
    }
  };

  return (
    <div className="py-16">
      {showToast && <ToastLoginRegister Check={checkToast} />}
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
              <p className="text-2xl text-center text-gray-700 uppercase">
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
              {fullName && (
                <p className="text-red-500 text-xs italic">{fullName}</p>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                id="PhoneNumber"
                name="PhoneNumber"
                maxLength={10}
                type="number"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                onInput={(e: any) => {
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />
              {phoneNumberError && (
                <p className="text-red-500 text-xs italic">
                  {phoneNumberError}
                </p>
              )}
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
                type="password"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              />
              {passwordError && (
                <p className="text-red-500 text-xs italic">{passwordError}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end items-center">
              <p className="text-sm text-gray-500 uppercase mr-2">
                มีสมาชิกแล้ว?
              </p>
              <NavLink
                to={RoutePath.loginScreen}
                className="text-blue-500 hover:underline"
              >
                เข้าสู่ระบบ
              </NavLink>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                disabled={loadingUser}
              >
                {loadingUser ? (
                  <div>
                    <CircularProgress size={17} color="inherit" />
                  </div>
                ) : (
                  <div>
                    <p>สมัครสมาชิก</p>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});
