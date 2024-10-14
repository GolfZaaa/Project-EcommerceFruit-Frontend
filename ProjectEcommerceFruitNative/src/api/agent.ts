import axios, { AxiosResponse } from "axios";
import { store } from "../store/store";
import { Common } from "./common.api";
import { User } from "./user.api";
import { Product } from "./product.api";

// axios.defaults.baseURL = "https://localhost:7168/api/";
axios.defaults.baseURL = "https://695a-202-28-123-199.ngrok-free.app/api/";

const multipartForm = {
  headers: { "Content-Type": "multipart/form-data" },
};

const responseBody = <T>(res: AxiosResponse<T>) => res.data;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;

  console.log("Request token", token);

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
    axios.post(url, data, multipartForm).then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios.put(url, data, multipartForm).then(responseBody),
};

export default {
  Common,
  User,
  Product,
};
