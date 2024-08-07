import { createFormData, requests } from "./agent";

export const Product = {
  getProduct: (categoryId: number) =>
    requests.get(`Product/GetProduct?categoryId=${categoryId}`),
  getProductByStore: (storeId: number) =>
    requests.get(`Product/GetProductByStore?storeId=${storeId}`),
  createUpdateProduct: (values: any) =>
    requests.post(`Product/CreateUpdateProduct`, values),
  getProductById: (productId: number) =>
    requests.get(`Product/GetProductById?productId=${productId}`),
  removeProduct: (productId: number) =>
    requests.delete(`Product/RemoveProductById?productId=${productId}`),

  //-------------------------------------------- product-GI ----------------------------------------------------//

  getProductGI: () => requests.get(`ProductGI/GetProductGI`),
  createUpdateProductGI: (values: any) =>
    requests.post(`ProductGI/CreateUpdateProductGI`, createFormData(values)),
  removeProductGI: (id: number) =>
    requests.delete(`ProductGI/RemoveProductGI?productGIId=${id}`),

  //-------------------------------------------- category ----------------------------------------------------//

  getCategory: () => requests.get("ProductGI/GetCategories"),
};
