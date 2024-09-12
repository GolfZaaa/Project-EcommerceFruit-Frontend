import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Product } from "../models/Product";
import { Store } from "../models/Store";

interface CreateandUpdateInterface {
  id: number;
  name: string;
  description: string;
}


export default class ShopUserStore {
  usershop: Store | null = null;
  shopAll: Store[] = [];
  shopProductUser: Product[] = [];


  constructor() {
    makeAutoObservable(this);
  }

  setUserShop = (state: any) => (this.usershop = state);

  createandupdate = async (value: CreateandUpdateInterface) => {
    try {
      const func = await agent.Shop.CreateandUpdate(value);
      return func;
    } catch (error) {
      return error;
    }
  };

  GetShopByUserId = async () => {
    try {
      const func = await agent.Shop.GetShopByUserId();
      this.usershop = func;
    } catch (error) {
      return error;
    }
  };

  getStoreAll = async () => {
    try {
      const result = await agent.Shop.GetStoreAll();
      this.shopAll = result;
      return result;
    } catch (error) {
      return error;
    }
  };

  DeleteStore = async (id: number) => {
    try {
      await agent.Shop.deleteStore(id);
      this.getStoreAll();
    } catch (error) {
      return error;
    }
  };

  GetStoreProductUser = async (id: number) => {
    try {
      const result = await agent.Shop.GetStoreProductUser(id);
      this.shopProductUser = result;
      this.getStoreAll();
    } catch (error) {
      return error;
    }
  };

}
