import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Product } from "../models/Product";
import { Category } from "../models/ProductGI";

export default class ProductStore {
  product: Product[] = [];
  category: Category[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getProduct = async (categoryId: number) => {
    try {
      const result = await agent.Product.getProduct(categoryId);
      this.product = result;
    } catch (error) {
      return error;
    }
  };

  //-------------------------------------------- category ----------------------------------------------------//

  getCategory = async () => {
    try {
      const result = await agent.Product.getCategory();
      this.category = result;
    } catch (error) {
      return error;
    }
  };
}
