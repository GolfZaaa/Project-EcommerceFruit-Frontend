import { config } from "../helper/config";

const HOST = config.baseURL ?? "/";

export const RoutePath = {
  // public routes
  firstscreen: HOST,
  homeScreen: `${HOST}home-screen`,
  loginScreen: `${HOST}login-screen`,
  registerScreen: `${HOST}register-screen`,
  createShopScreen: `${HOST}create-shop-screen`,
  successShopScreen: `${HOST}success-shop-screen`,
  shopAddressScreen: `${HOST}shop-address-screen`,
  createFruitGIScreen: `${HOST}create-fruitGI-screen`,
  createProductScreen: `${HOST}create-product-screen`,
  productDetail: `${HOST}product-detail`,
  createshop: `${HOST}create-shop`,

  // private routes
  dashboardShopScreen: `${HOST}dashboard-shop-screen`,
};
