import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Product } from "../models/Product";
import { Category, ProductGI } from "../models/ProductGI";

export default class ProductStore {
  product: Product[] = [];
  productGI: ProductGI[] = [];
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

  getProductByStore = async (storeId: number) => {
    try {
      const result = await agent.Product.getProductByStore(storeId);
      this.product = result;
    } catch (error) {
      return error;
    }
  };

  createUpdateProduct = async (values: any) => {
    try {
      const result = await agent.Product.createUpdateProduct(values);
      return result;
    } catch (error) {
      return error;
    }
  };

  removeProduct = async (id: number) => {
    try {
      await agent.Product.removeProduct(id);
    } catch (error) {
      return error;
    }
  };

  //-------------------------------------------- product-GI ----------------------------------------------------//

  getProductGI = async () => {
    try {
      const result = await agent.Product.getProductGI();

      console.log("result", result);

      this.productGI = result;
    } catch (error) {
      return error;
    }
  };

  createUpdateProductGI = async (values: any) => {
    try {
      const result = await agent.Product.createUpdateProductGI(values);
      this.getProductGI();
      return result;
    } catch (error) {
      return error;
    }
  };

  removeProductGI = async (id: number) => {
    try {
      await agent.Product.removeProductGI(id);
      this.getProductGI();
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
