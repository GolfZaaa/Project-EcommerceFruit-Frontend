import axios, { AxiosResponse } from "axios";
import { store } from "../store/store";
import { User } from "./user.api";
import { Shop } from "./shop.api";
import { Product } from "./product.api";
import { Order } from "./order.api";
import { Cart } from "./cart.api";
import { Address } from "./address.api";

// axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

axios.defaults.baseURL = "https://localhost:7168/api/";

export const pathImageProduct = "https://localhost:7168/product/"; 

export const pathImagepayment = "https://localhost:7168/paymentImage/"; 

const responseBody = <T>(res: AxiosResponse<T>) => res.data;

axios.interceptors.request.use(async (config: any) => {
  const token = await store.commonStore.token;

  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

export const createFormData = (item: any) => {
  let formData = new FormData();
  for (const key in item) {
    if (item[key] !== null && item[key] !== undefined) {
      formData.append(key, item[key]);
    }
  }
  return formData;
};

export const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, params: {}) => axios.post(url, params).then(responseBody),
  onlyPost: (url: string) => axios.post(url).then(responseBody),
  put: (url: string, params: {}) => axios.put(url, params).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  //   delete: (url: string) => axios.post(url).then(responseBody),
  postForm: (url: string, data: FormData) =>
    axios
      .post(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios
      .put(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
};

export default {
  User,
  Shop,
  Product,
  Order,
  Cart,
  Address,
};
