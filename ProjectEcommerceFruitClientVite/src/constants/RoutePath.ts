import { baseUrlImage } from "../api/agent";
import { config } from "../helper/config";

// const HOST = config.baseURL ?? "/";

const HOST = import.meta.env.VITE_HOST;

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
  orderSummary: (id: string) => `${HOST}order-summary/${id}`,
  test: `${HOST}test`,
  successScreen: `${HOST}order-success-screen`,
  checkorderScreen: `${HOST}check-order-user`,

  addressScreen: `${HOST}Address-screen`,
  summaryScreen: `${HOST}summary-screen`,

  dashboardforuser: `${HOST}dashboard-for-user`,

  orderReceiptList: `${HOST}order-receipt-list`,

  productDetail: (id: string) => `${HOST}product-detail-screen/${id}`,
  shopDetail: (id: string) => `${HOST}shop-detail-screen/${id}`,

  newsList: `${HOST}news-list`,
  newsListDetail: (id: string) => `${HOST}news-list-detail-screen/${id}`,

  createshop: `${HOST}create-shop`,
  cartScreen: `${HOST}cart-screen`,

  // private routes Dashboard ShopUser
  dashboardShopScreen: `${HOST}dashboard-shop-screen`,

  // private routes Dashboard Admin
  dashboardAdminHomePageScreen: `${HOST}dashboard-admin-homePage-screen`,
};

const path = config.baseURL ?? baseUrlImage;

export const pathImages = {
  paymentImage: `${path}paymentImage/`,
  product_GI: `${path}product-gi/`,
  product: `${path}product/`,
  image_web: `${path}image-web/`,
  slideShow: `${path}slide-show/`,
  news: `${path}image-news/`,
  sendedOrder: `${path}sendedOrder/`,
};

const ass = HOST + "assets/";

const local = "../assets/images/";
const local_assets = "/src/assets/images/";

export const imageLocal = {
  noPicture: `${
    config.baseURL ? ass + "1-00f046f9" : local_assets + "no-pictures"
  }.png`,
  step: `${config.baseURL ? ass + "1-0" : local_assets + "Steps"}.png`,
  step2: `${config.baseURL ? ass + "1-0" : local_assets + "Steps2"}.png`,
  step4: `${config.baseURL ? ass + "1-0" : local_assets + "Steps4"}.png`,
};

// export const imageLocal = {
//   kru: `${config.baseURL ? ass + "KRU-690f1497" : local_assets + "KRU"}.png`,
//   image1: `${config.baseURL ? ass + "1-00f046f9" : local + "1"}.jpg`,
//   image6: `${config.baseURL ? ass + "6-68784b1a" : local + "6"}.jpg`,
//   image3: `${config.baseURL ? ass + "3-822327b0" : local + "3"}.jpg`,
//   image4: `${config.baseURL ? ass + "4-9f07937a" : local + "4"}.jpg`,
//   image7: `${config.baseURL ? ass + "7-71686636" : local + "7"}.jpg`,
//   image8: `${config.baseURL ? ass + "8-aa5ad172" : local + "8"}.jpg`,
//   userImage: `${
//     config.baseURL ? ass + "userImage-3ec890e4" : local_assets + "userImage"
//   }.webp`,
// };
