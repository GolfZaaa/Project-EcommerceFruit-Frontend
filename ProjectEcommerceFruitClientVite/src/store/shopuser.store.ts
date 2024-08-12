import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Product } from "../models/Product";
import { Store } from "../models/Store";

interface CreateandUpdateInterface {
  id: number;
  name: string;
  description: string;
}

interface User {
  username: string;
  fullName: string;
  phoneNumber: number;
}

export default class ShopUserStore {
  usershop: Store | null = null;

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
}
