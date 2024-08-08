import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { User } from "../models/User";
import { store } from "./store";

interface Product {
    Weight: any;
    ProductId: any;
}

export default class CartStore {
    cartItems = [];

  constructor() {
    makeAutoObservable(this);
  }

  AddToCart = async ({ProductId,Weight }:Product) => {
    const data = {weight:Weight, productId:ProductId}
    try {
      const result = await agent.Cart.AddtoCart(data);
      return result;
    } catch (error) {
      return error;
    }
  };

  GetCartItemByUser = async() => {
    try {
       const result = await agent.Cart.GetCartItemByUser();
       this.cartItems = result;
    }catch (error) {
      return error;
    }
  }


}
