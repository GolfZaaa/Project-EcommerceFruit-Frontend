import CreateShopScreen from "../Screen/Shopping/CreateShopScreen";
import LoginScreen from "../Screen/LoginScreen";
import RegisterScreen from "../Screen/RegisterScreen";
import SuccessShopScreen from "../Screen/Shopping/SuccessShopScreen";
import ShopAddressScreen from "../Screen/ShopAddressScreen";
import CreateFruitGIScreen from "../Screen/Shopping/CreateFruitGIScreen";
import CreateProductScreen from "../Screen/Shopping/CreateProductScreen";
import HomeScreen from "../Screen/HomeScreen";
import NotFoundScreen from "../Screen/NotFoundScreen";
import FirstScreen from "../Screen/FirstScreen";
import CartScreen from "../Screen/CartScreen";

export const PublicRoute: any = [
  {
    id: 0,
    path: "/register-screen",
    element: <RegisterScreen />,
  },
  {
    id: 1,
    path: "/login-screen",
    element: <LoginScreen />,
  },
  {
    id: 2,
    path: "/create-shop-screen",
    element: <CreateShopScreen />,
  },
  {
    id: 3,
    path: "/success-shop-screen",
    element: <SuccessShopScreen />,
  },
  {
    id: 4,
    path: "/shop-address-screen",
    element: <ShopAddressScreen />,
  },
  {
    id: 5,
    path: "/create-fruitGI-screen",
    element: <CreateFruitGIScreen />,
  },
  {
    id: 6,
    path: "/create-product-screen",
    element: <CreateProductScreen />,
  },
  {
    id: 7,
    path: "/home-screen",
    element: <HomeScreen />,
  },
  {
    id: 8,
    path: "*",
    element: <NotFoundScreen />,
  },
  {
    id: 9,
    path: "/",
    element: <FirstScreen />,
  },
  {
    id: 10,
    path: "/cart-screen",
    element: <CartScreen />,
  },
];
