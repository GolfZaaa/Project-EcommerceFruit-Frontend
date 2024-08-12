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
  myaccountScreen: `${HOST}my-account-screen`,

  addressScreen: `${HOST}Address-screen`,
  summaryScreen: `${HOST}summary-screen`,

  
  productDetail: (id: string) => `${HOST}product-detail-screen/${id}`,

  createshop: `${HOST}create-shop`,
  cartScreen: `${HOST}cart-screen`,

  // private routes
  dashboardShopScreen: `${HOST}dashboard-shop-screen`,
};
