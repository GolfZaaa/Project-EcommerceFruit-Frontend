import DashboardAdminHomePageScreen from "../Screen/Private/DashboardAdmin/DashboardAdminHomePageScreen";
import DashboardShopScreen from "../Screen/Private/DashboardShopScreen";

export const PrivateRoute: any = [

  // ShopUser
  {
    id: 0,
    path: "/dashboard-shop-screen",
    element: <DashboardShopScreen />,
  },

  // Admin
  {
    id: 1,
    path: "/dashboard-admin-homePage-screen",
    element: <DashboardAdminHomePageScreen />,
  },
];
