import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PublicRoute } from "./route/PublicRoute";
import { AdminRoute, PrivateRoute } from "./route/PrivateRoute";
import Navbar from "./layout/screen/Navbar";
import Footer from "./layout/screen/Footer";
import { useEffect, useState } from "react";
import { useStore } from "./store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { observer } from "mobx-react-lite";

function App() {
  const Routers = [...PublicRoute, ...PrivateRoute];

  const { token } = useStore().commonStore;
  const { getUserDetailbyId, logout, isLoggedIn, user } = useStore().userStore;

  useEffect(() => {
    getUserDetailbyId();
    // if (token !== null) {
    //   getUserDetailbyId();
    //   getUserDetailbyId().then((result) => {
    //     if (result?.response?.request?.status !== undefined) {
    //       if (result.response.request.status === 401) {
    //         logout();
    //       }
    //     }
    //   });
    // }
  }, []);

  const route = isLoggedIn
    ? user?.roleId === 1
      ? [...PublicRoute, ...PrivateRoute, ...AdminRoute]
      : [...PublicRoute, ...PrivateRoute]
    : PublicRoute;

  console.log("user", user);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {route.map((item: any) => (
          <Route key={item.id} element={item.element} path={item.path} />
        ))}
      </Routes>
      {/* <Footer /> */}
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default observer(App);
