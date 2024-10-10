import { makeAutoObservable, reaction } from "mobx";
import { Order, OrderNow } from "../models/Order";
import agent from "../api/agent";

export default class OrderStore {
  order: Order[] = [];
  checkOrderNow: OrderNow[] = [];
  orderid: number = 0;
  loadingOrder: boolean = false;
  ordertotal: Order[] = [];
  orderWantToReceipt: Order[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingOrder = (state: boolean) => (this.loadingOrder = state);

  setOrder = (state: any) => (this.order = state);

  getOrdersByUser = async () => {
    try {
      const result = await agent.Order.getOrdersByUser();
      this.order = result;
    } catch (error) {
      return error;
    }
  };

  getOrdersWantToReceipt = async () => {
    this.setLoadingOrder(true);
    try {
      const result = await agent.Order.getOrdersWantToReceipt();
      this.order = result;

      this.setLoadingOrder(false);
    } catch (error) {
      this.setLoadingOrder(false);
      return error;
    }
  };

  searchOrdersWantToReceipt = async (params: URLSearchParams) => {
    this.setLoadingOrder(true);
    try {
      const result = await agent.Order.searchOrdersWantToReceipt(params);
      this.orderWantToReceipt = result;

      this.setLoadingOrder(false);
    } catch (error) {
      this.setLoadingOrder(false);
      return error;
    }
  };

  searchOrderToSendByOrderId = async (orderId: string | null) => {
    this.setLoadingOrder(true);
    try {
      const result = await agent.Order.searchOrderToSendByOrderId(orderId);
      this.order = result;

      this.setLoadingOrder(false);

      return result;
    } catch (error) {
      this.setLoadingOrder(false);
      return error;
    }
  };

  iWantToTakeOrdertoSend = async (values: number[]) => {
    this.setLoadingOrder(true);
    try {
      const result = await agent.Order.iWantToTakeOrdertoSend(values);
      this.setOrder([]);

      this.setLoadingOrder(false);

      return result;
    } catch (error) {
      this.setLoadingOrder(false);
      return error;
    }
  };

  getMyOrderUserWantToTaketoSend = async () => {
    this.setLoadingOrder(true);
    try {
      const result = await agent.Order.getMyOrderUserWantToTaketoSend();
      this.order = result;

      this.setLoadingOrder(false);
    } catch (error) {
      this.setLoadingOrder(false);
      return error;
    }
  };

  confirmOrderToForward = async (values: any) => {
    this.setLoadingOrder(true);
    try {
      const result = await agent.Order.confirmOrderToForward(values);

      console.log("result :: ", result);

      this.setLoadingOrder(false);

      this.getMyOrderUserWantToTaketoSend();
    } catch (error) {
      this.setLoadingOrder(false);
      return error;
    }
  };

  getMyOrderToSend = async () => {
    try {
      const result = await agent.Order.getMyOrderToSend();
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
      this.ordertotal = result;
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

  createOrderToReceipt = async (valus: any) => {
    try {
      const result = await agent.Order.createOrderToReceipt(valus);
      this.getOrdersWantToReceipt();
      return result;
    } catch (error) {
      return error;
    }
  };

  changeConfirmReceiptOrder = async (valus: any) => {
    try {
      const result = await agent.Order.changeConfirmReceiptOrder(valus);
      this.getOrdersByUser();
      return result;
    } catch (error) {
      return error;
    }
  };

  changeConfirmSendOrder = async (valus: any) => {
    try {
      const result = await agent.Order.changeConfirmSendOrder(valus);
      this.getMyOrderToSend();
      return result;
    } catch (error) {
      return error;
    }
  };
}
