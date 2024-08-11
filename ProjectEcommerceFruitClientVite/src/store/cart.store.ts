import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { User } from "../models/User";
import { store } from "./store";

interface Product {
    Quantity: any;
    ProductId: any;
    CartItemId: any;
}

export default class CartStore {
    cartItems = [];
    cartItemsStore = [];

  constructor() {
    makeAutoObservable(this);
  }

  AddToCart = async ({ProductId,Quantity }:Product) => {
    const data = {quantity:Quantity, productId:ProductId}
    try {
      const result = await agent.Cart.AddtoCart(data);
      return result;
    } catch (error) {
      return error;
    }
  };

  RemoveToCart = async ({CartItemId,Quantity }:Product) => {
    const data = {quantity:Quantity, cartItemId:CartItemId}
    try {
      const result = await agent.Cart.RemoveToCart(data);
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

  GetCartItemByUserOrderStore = async() => {
    try {
       const result = await agent.Cart.GetCartItemByUserOrderStore();
       this.cartItemsStore = result;
    }catch (error) {
      return error;
    }
  }




}
