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
  OrderSummary: `${HOST}order-summary`,
  test: `${HOST}test`,
  successScreen: `${HOST}order-success-screen`,
  checkorderScreen: `${HOST}check-order-user`,

  addressScreen: `${HOST}Address-screen`,
  summaryScreen: `${HOST}summary-screen`,

  dashboardforuser: `${HOST}dashboard-for-user`,

  productDetail: (id: string) => `${HOST}product-detail-screen/${id}`,

  createshop: `${HOST}create-shop`,
  cartScreen: `${HOST}cart-screen`,

  // private routes Dashboard ShopUser
  dashboardShopScreen: `${HOST}dashboard-shop-screen`,

  // private routes Dashboard Admin
  dashboardAdminHomePageScreen: `${HOST}dashboard-admin-homePage-screen`,
};

const path = config.baseURL ?? "https://localhost:7168/";

export const pathImages = {
  paymentImage: `${path}paymentImage/`,
  product_GI: `${path}product-gi/`,
  product: `${path}product/`,
  image_web: `${path}image-web/`,
  slideShow: `${path}slide-show/`,
  news: `${path}image-news/`,
};
