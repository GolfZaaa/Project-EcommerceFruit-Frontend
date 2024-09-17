import { makeAutoObservable, reaction } from "mobx";
import { Order, OrderNow } from "../models/Order";
import agent from "../api/agent";


export default class OrderStore {
  order: Order[] = [];
  checkOrderNow: OrderNow[] = [];
  orderid: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setOrder = (state: any) => (this.order = state);

  getOrdersByUser = async () => {
    try {
      const result = await agent.Order.getOrdersByUser();
      this.order = result;
    } catch (error) {
      return error;
    }
  };

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

  CreateUpdateOrderById = async (values: any) => {
    try {
      const result = await agent.Order.CreateUpdateOrderById(values);
      this.orderid = result;
      return result;
    } catch (error) {
      return error;
    }
  };

  getOrdersAll = async () => {
    try {
      const result = await agent.Order.getOrdersAll();
      this.order = result;
    } catch (error) {
      return error;
    }
  };


  getOrderItemByOrderId = async (orderId: number) => {
    try {
      const result = await agent.Order.getOrderItemByOrderId(orderId);
      this.checkOrderNow = result;
    } catch (error) {
      return error;
    }
  };
}
