import { requests } from "./agent";

export const Shop = {
  CreateandUpdate: (value: any) =>
    requests.post("Store/CreateUpdateStore", value),
  GetShopByUserId: () => requests.get("Store/GetStoreByUserId"),
  GetStoreAll: () => requests.get("Store/StoreAll"),
  deleteStore: (id: any) => requests.delete(`Store/RemoveStoreById?storeId=${id}`),
  GetStoreProductUser: (id: any) => requests.get(`Store/GetStoreProductUser?userid=${id}`),
  GetStoreDetailByUserId: (id: any) => requests.get(`Store/GetStoreDetailByUserId?userid=${id}`),

};
