import { RoutePath } from "../constants/RoutePath";
import DashboardAdminHomePageScreen from "../Screen/Private/DashboardAdmin/DashboardAdminHomePageScreen";
import DashboardShopScreen from "../Screen/Private/DashboardShopScreen";

export const PrivateRoute: any = [
  // ShopUser
  {
    id: 22,
    path: RoutePath.dashboardShopScreen,
    element: <DashboardShopScreen />,
  },
];

export const AdminRoute: any = [
  {
    id: 23,
    path: RoutePath.dashboardAdminHomePageScreen,
    element: <DashboardAdminHomePageScreen />,
  },
];
