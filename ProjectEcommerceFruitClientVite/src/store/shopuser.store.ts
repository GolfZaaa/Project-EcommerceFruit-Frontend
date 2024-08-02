import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Product } from "../models/Product";

interface CreateandUpdateInterface {
  Id: number;
  Name: string;
  Description: string;
}

interface User {
  username: string;
  fullName: string;
  phoneNumber: number;
}

interface ShopUser {
  user: User;
  id: number;
  name: "";
  description: "";
  createdAt: Date;
  userId: number;
}

export default class ShopUserStore {
  usershop: ShopUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createandupdate = async ({
    Id,
    Name,
    Description,
  }: CreateandUpdateInterface) => {
    const data = { id: Id, name: Name, description: Description };
    try {
      const func = await agent.Shop.CreateandUpdate(data);
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
