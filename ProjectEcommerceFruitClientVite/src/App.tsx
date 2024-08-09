import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PublicRoute } from "./route/PublicRoute";
import { PrivateRoute } from "./route/PrivateRoute";
import Navbar from "./layout/screen/Navbar";
import Footer from "./layout/screen/Footer";
import { useEffect, useState } from "react";
import { useStore } from "./store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const Routers = [...PublicRoute, ...PrivateRoute];

  const { token } = useStore().commonStore;
  const { getUserDetailbyId } = useStore().userStore;
  useEffect(() => {
    if (token) {
      getUserDetailbyId();
    }
  }, []);
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {Routers.map((item: any) => (
          <Route key={item.id} element={item.element} path={item.path} />
        ))}
      </Routes>
      {/* <Footer /> */}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
