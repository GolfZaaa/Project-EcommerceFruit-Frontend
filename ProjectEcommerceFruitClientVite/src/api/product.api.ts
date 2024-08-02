import { requests } from "./agent";

export const Product = {
  getProduct: (categoryId: number) =>
    requests.get(`Product/GetProduct?categoryId=${categoryId}`),

  //-------------------------------------------- category ----------------------------------------------------//

  getCategory: () => requests.get("ProductGI/GetCategories"),
};
