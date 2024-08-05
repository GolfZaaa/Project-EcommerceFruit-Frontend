import { createFormData, requests } from "./agent";

export const Product = {
  getProduct: (categoryId: number) =>
    requests.get(`Product/GetProduct?categoryId=${categoryId}`),
  //-------------------------------------------- product-GI ----------------------------------------------------//
  getProductGI: () => requests.get(`ProductGI/GetProductGI`),
  createUpdateProductGI: (values: any) =>
    requests.post(`ProductGI/CreateUpdateProductGI`, createFormData(values)),
  removeProductGI: (id: number) => requests.delete(`ProductGI/RemoveProductGI?productGIId=${id}`),

  //-------------------------------------------- category ----------------------------------------------------//

  getCategory: () => requests.get("ProductGI/GetCategories"),
};
