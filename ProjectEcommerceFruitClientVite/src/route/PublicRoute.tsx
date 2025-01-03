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
import ShopDetailScreen from "../Screen/ShopDetailScreen";
import NewsList from "../Screen/news/NewsList";
import NewsDetailScreen from "../Screen/news/NewsDetailScreen";

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
  // {
  //   id: 5,
  //   path: "/create-fruitGI-screen",
  //   element: <CreateFruitGIScreen />,
  // },
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
    id: 11,
    path: RoutePath.home + "product-detail-screen/:id",
    element: <ProductDetailScreen />,
  },
  {
    id: 12,
    path: RoutePath.firstscreen,
    element: <FirstScreenNew />,
  },
  {
    id: 21,
    path: RoutePath.home + "shop-detail-screen/:id",
    element: <ShopDetailScreen />,
  },
  {
    id: 22,
    path: RoutePath.newsList,
    element: <NewsList />,
  },
  {
    id: 23,
    path: RoutePath.home + "news-list-detail-screen/:id",
    element: <NewsDetailScreen />,
  },
];
