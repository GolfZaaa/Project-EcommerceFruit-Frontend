import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import { PublicRoute } from './route/PublicRoute';
import { PrivateRoute } from './route/PrivateRoute';
import Navbar from "./layout/screen/Navbar";
import Footer from "./layout/screen/Footer";

function App() {
  const Routers = [...PublicRoute, ...PrivateRoute];
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {Routers.map((item: any) => (
          <Route key={item.id} element={item.element} path={item.path} />
        ))}
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}


export default App
