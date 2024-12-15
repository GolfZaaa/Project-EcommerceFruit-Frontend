import { RoutePath } from "../constants/RoutePath";
import SuccessComponent from "../layout/component/SuccessComponent";
import AddressScreen from "../Screen/AddressScreen";
import CartScreen from "../Screen/CartScreen";
import CheckOrderScreen from "../Screen/CheckOrderScreen";
import DashboardForUser from "../Screen/my/DashboardForUser";
import OrderReceiptList from "../Screen/order/OrderReceiptList";
import OrderSummary from "../Screen/order/OrderSummary";
import DashboardAdminHomePageScreen from "../Screen/Private/DashboardAdmin/DashboardAdminHomePageScreen";
import DashboardShopScreen from "../Screen/Private/DashboardShopScreen";
import MyAccountScreen from "../Screen/Private/MyAccountScreen";
import ShopAddressScreen from "../Screen/ShopAddressScreen";
import CreateProductScreen from "../Screen/Shopping/CreateProductScreen";
import CreateShopScreen from "../Screen/Shopping/CreateShopScreen";
import SuccessShopScreen from "../Screen/Shopping/SuccessShopScreen";
import SummaryScreen from "../Screen/SummaryScreen";

export const PrivateRoute: any = [
  // ShopUser
  {
    id: 22,
    path: RoutePath.dashboardShopScreen,
    element: <DashboardShopScreen />,
  },
  {
    id: 14,
    path: RoutePath.myaccountScreen,
    element: <MyAccountScreen />,
  },
  {
    id: 13,
    path: RoutePath.addressScreen,
    element: <AddressScreen />,
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
  {
    id: 10,
    path: RoutePath.cartScreen,
    element: <CartScreen />,
  },
  {
    id: 6,
    path: RoutePath.createProductScreen,
    element: <CreateProductScreen />,
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
];

export const AdminRoute: any = [
  {
    id: 23,
    path: RoutePath.dashboardAdminHomePageScreen,
    element: <DashboardAdminHomePageScreen />,
  },
];
