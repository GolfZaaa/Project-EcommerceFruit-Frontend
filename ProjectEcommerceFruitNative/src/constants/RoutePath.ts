import { port } from "../api/agent";

export const config = {
  baseURL: null,
};

const HOST = config.baseURL ?? "/";

const path = config.baseURL ?? port;

export const pathImagesApp = {
  paymentImage: `${path}paymentImage/`,
  product_GI: `${path}product-gi/`,
  product: `${path}product/`,
  image_web: `${path}image-web/`,
  slideShow: `${path}slide-show/`,
  news: `${path}image-news/`,
};
