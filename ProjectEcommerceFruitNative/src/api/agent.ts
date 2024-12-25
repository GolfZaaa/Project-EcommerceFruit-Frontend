import axios, { AxiosResponse } from "axios";
import { store } from "../store/store";
import { Common } from "./common.api";
import { User } from "./user.api";
import { Product } from "./product.api";
import { Cart } from "./cart.api";
import { SystemSetting } from "./systemsetting.api";
import { Address } from "./address.api";
import { Order } from "./order.api";
import { Shop } from "./shop.api";

// axios.defaults.baseURL = "https://localhost:7168/api/";

export const port =
  "https://871b-182-53-139-116.ngrok-free.app/";

axios.defaults.baseURL = port + "api/";

const multipartForm = {
  headers: { "Content-Type": "multipart/form-data" },
};

const responseBody = <T>(res: AxiosResponse<T>) => res.data;

export type RootStackParamList = {
  ProductDetailsScreen: { id: number };
  storedetail: { id: number };
};

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;

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

export const createFormDataUseMyName = (item: any, name: string) => {
  let formData = new FormData();
  for (const key in item) {
    if (item[key] !== null && item[key] !== undefined) {
      formData.append(name, item[key]);
    }
  }

  return formData;
};

export const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  getFormAny: (url: string, params?: any) =>
    axios.get(url, { params }).then(responseBody),
  onlyGet: (url: string, params?: any) =>
    axios.get(url + params).then(responseBody),
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
    axios.put(url, data, multipartForm).then(responseBody),
};

export default {
  Common,
  User,
  Product,
  Cart,
  SystemSetting,
  Address,
  Order,
  Shop,
};
