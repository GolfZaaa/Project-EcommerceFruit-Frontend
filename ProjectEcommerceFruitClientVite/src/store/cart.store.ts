import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { User } from "../models/User";
import { store } from "./store";

interface RemoveProduct {
  Quantity: any | null;
  CartItemId: any | null;
}

interface AddProduct {
  Quantity: any | null;
  ProductId: any | null;
}

export default class CartStore {
  cartItems = [];
  cartItemsStore = [];
  myCartItems = [];
  selectMyCart = [];

  constructor() {
    makeAutoObservable(this);
  }

  setMyCartItems = (state: any) => (this.myCartItems = state);
  setselectMyCart = (state: any) => (this.selectMyCart = state);

  AddToCart = async ({ ProductId, Quantity }: AddProduct) => {
    const data = { quantity: Quantity, productId: ProductId };
    try {
      const result = await agent.Cart.AddtoCart(data);
      return result;
    } catch (error) {
      return error;
    }
  };

  RemoveToCart = async ({ CartItemId, Quantity }: RemoveProduct) => {
    const data = { quantity: Quantity, cartItemId: CartItemId };
    try {
      const result = await agent.Cart.RemoveToCart(data);
      return result;
    } catch (error) {
      return error;
    }
  };

  GetCartItemByUser = async () => {
    try {
      const result = await agent.Cart.GetCartItemByUser();
      this.cartItems = result;
    } catch (error) {
      return error;
    }
  };

  GetCartItemByUserOrderStore = async () => {
    try {
      const result = await agent.Cart.GetCartItemByUserOrderStore();
      this.cartItemsStore = result;
    } catch (error) {
      return error;
    }
  };
}
