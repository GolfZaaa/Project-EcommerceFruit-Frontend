import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Product } from "../models/Product";
import { Category, ProductGI } from "../models/ProductGI";
import { store } from "./store";

export default class ProductStore {
  product: Product[] = [];
  productDetail: Product | null = null;
  productGI: ProductGI[] = [];
  category: Category[] = [];
  loadingPGI: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingPGI = (state: boolean) => (this.loadingPGI = state);

  getProduct = async (categoryId: number) => {
    try {
      const result = await agent.Product.getProduct(categoryId);
      this.product = result;
    } catch (error) {
      return error;
    }
  };

  getProductById = async (productId: number) => {
    try {
      const result = await agent.Product.getProductById(productId);
      this.productDetail = result;
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
      return await agent.Product.removeProduct(id);
    } catch (error) {
      return error;
    }
  };

  DeleteProduct = async (productId: number) => {
    try {
      await agent.Product.deleteProduct(productId);
      this.getProduct(0);
    } catch (error) {
      return error;
    }
  };

  addStockProduct = async ({
    productId,
    quantity,
  }: {
    productId: number;
    quantity: number;
  }) => {
    const data = { productId, quantity };
    try {
      const result = await agent.Product.addStockProduct(data);
      return result;
    } catch (error) {
      return error;
    }
  };

  //-------------------------------------------- product-GI ----------------------------------------------------//

  getProductGI = async (id?: any | null) => {
    this.setLoadingPGI(true);
    try {
      const result = await agent.Product.getProductGI(id);

      this.productGI = result;

      this.setLoadingPGI(false);
    } catch (error) {
      this.setLoadingPGI(false);
      return error;
    }
  };

  createUpdateProductGI = async (values: any, files: any) => {
    try {
      const result = await agent.Product.createUpdateProductGI(values, files);
      this.getProductGI(1);
      return result;
    } catch (error) {
      return error;
    }
  };

  removeProductGI = async (id: number) => {
    try {
      await agent.Product.removeProductGI(id);
      this.getProductGI(1);
    } catch (error) {
      return error;
    }
  };

  removeImage = async (id: number) => {
    try {
      await agent.Product.removeImage(id);
      this.getProductGI(1);
    } catch (error) {
      return error;
    }
  };

  getProductGIAll = async () => {
    try {
      const result = await agent.Product.getProductGIAll();
      this.productGI = result;
    } catch (error) {
      return error;
    }
  };

  HiddenProductGI = async (productGIId: number) => {
    try {
      await agent.Product.hiddenProductGi(productGIId);
      this.getProductGIAll();
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
