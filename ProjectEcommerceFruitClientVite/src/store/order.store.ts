import { makeAutoObservable, reaction } from "mobx";
import { Order } from "../models/Order";
import agent from "../api/agent";

export default class OrderStore {
  order: Order[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getOrderByStore = async (storeId: number) => {
    try {
      const result = await agent.Order.getOrderByStore(storeId);
      this.order = result;
    } catch (error) {
      return error;
    }
  };

  confirmOrder = async (values: any | undefined) => {
    try {
      const result = await agent.Order.confirmOrder(values);
      return result;
    } catch (error) {
      return error;
    }
  };

  cancelOrder = async (values: any | undefined) => {
    try {
      const result = await agent.Order.cancelOrder(values);
      return result;
    } catch (error) {
      return error;
    }
  };
}
