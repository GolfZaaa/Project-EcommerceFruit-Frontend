import CreateShopScreen from "../Screen/Shopping/CreateShopScreen";
import LoginScreen from "../Screen/LoginScreen";
import RegisterScreen from "../Screen/RegisterScreen";
import SuccessShopScreen from "../Screen/Shopping/SuccessShopScreen";
import ShopAddressScreen from "../Screen/ShopAddressScreen";
import CreateProductScreen from "../Screen/Shopping/CreateProductScreen";
import HomeScreen from "../Screen/HomeScreen";
import NotFoundScreen from "../Screen/NotFoundScreen";
import FirstScreen from "../Screen/FirstScreen";
import FirstScreenNew from "../Screen/FirstScreenNew";
import ProductDetailScreen from "../Screen/product/ProductDetailScreen";
import CreateFruitGIScreen from "../Screen/Shopping/CreateFruitGIScreen";
import CartScreen from "../Screen/CartScreen";
import AddressScreen from "../Screen/AddressScreen";
import { RoutePath } from "../constants/RoutePath";
import MyAccountScreen from "../Screen/Private/MyAccountScreen";
import SummaryScreen from "../Screen/SummaryScreen";
import OrderSummary from "../Screen/order/OrderSummary";
import SuccessComponent from "../layout/component/SuccessComponent";
import DashboardForUser from "../Screen/my/DashboardForUser";

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
  // {
  //   id: 5,
  //   path: "/create-fruitGI-screen",
  //   element: <CreateFruitGIScreen />,
  // },
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
    path: "/FirstScreen",
    element: <FirstScreen />,
  },
  {
    id: 10,
    path: "/cart-screen",
    element: <CartScreen />,
  },
  {
    id: 11,
    path: "/product-detail-screen/:id",
    element: <ProductDetailScreen />,
  },
  {
    id: 12,
    path: "/",
    element: <FirstScreenNew />,
  },
  {
    id: 13,
    path: "/Address-screen",
    element: <AddressScreen />,
  },
  {
    id: 14,
    path: RoutePath.myaccountScreen,
    element: <MyAccountScreen />,
  },
  {
    id: 15,
    path: RoutePath.OrderSummary,
    element: <OrderSummary />,
  },
  {
    id: 16,
    path: "/summary-screen",
    element: <SummaryScreen />,
  },
  {
    id: 17,
    path: "/order-success-screen",
    element: <SuccessComponent />,
  },
  {
    id: 18,
    path: "/dashboard-for-user",
    element: <DashboardForUser />,
  },
];
