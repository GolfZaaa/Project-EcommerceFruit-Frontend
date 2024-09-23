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
import CheckOrderScreen from "../Screen/CheckOrderScreen";
import OrderReceiptList from "../Screen/order/OrderReceiptList";

export const PublicRoute: any = [
  {
    id: 0,
    path: RoutePath.registerScreen,
    element: <RegisterScreen />,
  },
  {
    id: 1,
    path: RoutePath.loginScreen,
    element: <LoginScreen />,
  },
  {
    id: 2,
    path: RoutePath.createShopScreen,
    element: <CreateShopScreen />,
  },
  {
    id: 3,
    path: RoutePath.successShopScreen,
    element: <SuccessShopScreen />,
  },
  {
    id: 4,
    path: RoutePath.shopAddressScreen,
    element: <ShopAddressScreen />,
  },
  // {
  //   id: 5,
  //   path: "/create-fruitGI-screen",
  //   element: <CreateFruitGIScreen />,
  // },
  {
    id: 6,
    path: RoutePath.createProductScreen,
    element: <CreateProductScreen />,
  },
  {
    id: 7,
    path: RoutePath.homeScreen,
    element: <HomeScreen />,
  },
  {
    id: 8,
    path: "*",
    element: <NotFoundScreen />,
  },
  // {
  //   id: 9,
  //   path: "/FirstScreen",
  //   element: <FirstScreen />,
  // },
  {
    id: 10,
    path: RoutePath.cartScreen,
    element: <CartScreen />,
  },
  {
    id: 11,
    path: RoutePath.firstscreen + "product-detail-screen/:id",
    element: <ProductDetailScreen />,
  },
  {
    id: 12,
    path: RoutePath.firstscreen,
    element: <FirstScreenNew />,
  },
  {
    id: 13,
    path: RoutePath.addressScreen,
    element: <AddressScreen />,
  },
  {
    id: 14,
    path: RoutePath.myaccountScreen,
    element: <MyAccountScreen />,
  },
  {
    id: 15,
    path: RoutePath.orderSummary,
    element: <OrderSummary />,
  },
  {
    id: 16,
    path: RoutePath.summaryScreen,
    element: <SummaryScreen />,
  },
  {
    id: 17,
    path: RoutePath.successScreen,
    element: <SuccessComponent />,
  },
  {
    id: 18,
    path: RoutePath.dashboardforuser,
    element: <DashboardForUser />,
  },
  {
    id: 19,
    path: RoutePath.checkorderScreen,
    element: <CheckOrderScreen />,
  },
  {
    id: 20,
    path: RoutePath.orderReceiptList,
    element: <OrderReceiptList />,
  },
];
