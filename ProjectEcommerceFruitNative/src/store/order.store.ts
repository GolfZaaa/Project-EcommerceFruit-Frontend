import { makeAutoObservable, reaction } from "mobx";
import { Order, OrderNow } from "../models/Order";
import agent from "../api/agent";

export default class OrderStore {
  order: Order[] = [];
  orderSearch: Order[] = [];
  orderForward: Order[] = [];
  checkOrderNow: OrderNow[] = [];
  orderid: number = 0;
  loadingOrder: boolean = false;
  loadingOrderWantToTake: boolean = false;
  loadingOrderConfirmForward: boolean = false;
  ordertotal: Order[] = [];
  orderWantToReceipt: Order[] = [];
  totalPriceMyOrder: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setTotalPriceMyOrder = (state: number) => (this.totalPriceMyOrder = state);

  setLoadingOrder = (state: boolean) => (this.loadingOrder = state);
  setLoadingOrderWantToTake = (state: boolean) =>
    (this.loadingOrderWantToTake = state);
  setLoadingOrderConfirmForward = (state: boolean) =>
    (this.loadingOrderConfirmForward = state);

  setOrder = (state: any) => (this.order = state);
  setOrderSearch = (state: any) => (this.orderSearch = state);
  setOrderForward = (state: any) => (this.orderForward = state);

  getOrdersByUser = async () => {
    try {
      const result = await agent.Order.getOrdersByUser();
      this.order = result;
    } catch (error) {
      return error;
    }
  };

  cancelOrderMyReceipt = async (id: number) => {
    this.setLoadingOrder(true);
    try {
      await agent.Order.cancelOrderMyReceipt(id).then(() => {
        this.getMyOrderToSend();
      });

      this.setLoadingOrder(false);
    } catch (error) {
      this.setLoadingOrder(false);
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
      this.orderSearch = result;

      this.setLoadingOrder(false);

      return result;
    } catch (error) {
      this.setLoadingOrder(false);
      return error;
    }
  };

  iWantToTakeOrdertoSend = async (values: number[]) => {
    this.setLoadingOrderWantToTake(true);
    try {
      const result = await agent.Order.iWantToTakeOrdertoSend(values);

      if (result === true) {
        this.setOrderSearch([]);
      }

      this.setLoadingOrderWantToTake(false);

      return result;
    } catch (error) {
      this.setLoadingOrderWantToTake(false);
      return error;
    }
  };

  RefundOrder = async (orderId: number) => {
    try {
      const result = await agent.Order.RefundOrder(orderId);
      this.getOrdersByUser();
      return result;
    } catch (error) {
      return error;
    }
  };

  getMyOrderUserWantToTaketoSend = async () => {
    this.setLoadingOrder(true);
    try {
      const result = await agent.Order.getMyOrderUserWantToTaketoSend();
      this.orderForward = result;

      this.setLoadingOrder(false);
    } catch (error) {
      this.setLoadingOrder(false);
      return error;
    }
  };

  confirmOrderToForward = async (values: any) => {
    this.setLoadingOrderConfirmForward(true);
    try {
      const result = await agent.Order.confirmOrderToForward(values);
      this.setLoadingOrderConfirmForward(false);
      this.getMyOrderUserWantToTaketoSend();
    } catch (error) {
      this.setLoadingOrderConfirmForward(false);
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
      this.order = result;
      this.ordertotal = result;
      console.log("Test", result);
      return result;
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

  createOrderToReceipt = async (valus: number[]) => {
    try {
      const result = await agent.Order.createOrderToReceipt(valus);
      this.searchOrdersWantToReceipt(new URLSearchParams());
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
