import { createFormData, requests } from "./agent";

export const Product = {
  getProduct: (categoryId: number) =>
    requests.get(`Product/GetProduct?categoryId=${categoryId}`),
  getProductByStore: (storeId: number) =>
    requests.get(`Product/GetProductByStore?storeId=${storeId}`),
  createUpdateProduct: (values: any) =>
    requests.post(`Product/CreateUpdateProduct`, createFormData(values)),
  getProductById: (productId: number) =>
    requests.get(`Product/GetProductById?productId=${productId}`),
  removeProduct: (productId: number) =>
    requests.delete(`Product/RemoveProductById?productId=${productId}`),

  //-------------------------------------------- product-GI ----------------------------------------------------//

  getProductGI: () => requests.get(`ProductGI/GetProductGI`),
  createUpdateProductGI: (values: any, files: any) => {
    const data = createFormData(values);

    for (var formfile of files) {
      data.append("formFiles", formfile);
      console.log("sand formfile", formfile);
    }

    console.log("data", ...data);

    return requests.post(`ProductGI/CreateUpdateProductGI`, data);
  },
  removeProductGI: (id: number) =>
    requests.delete(`ProductGI/RemoveProductGI?productGIId=${id}`),
  removeImage: (id: number) =>
    requests.delete(`ProductGI/RemoveImage?productGiId=${id}`),

  //-------------------------------------------- category ----------------------------------------------------//

  getCategory: () => requests.get("ProductGI/GetCategories"),
};
