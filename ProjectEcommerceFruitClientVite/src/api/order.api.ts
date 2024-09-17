import { createFormData, requests } from "./agent";

export const Order = {
  getOrdersByUser: () => requests.get("Order/GetOrdersByUser"),
  getOrderByStore: (storeId: number) =>
    requests.get(`Order/GetOrdersByStore?storeId=${storeId}`),
  confirmOrder: (values: any | undefined) =>
    requests.post(`Order/ConfirmOrder`, createFormData(values)),
  cancelOrder: (values: any | undefined) =>
    requests.post(`Order/CancelOrder`, createFormData(values)),
  CreateUpdateOrderById: (values: any | undefined) =>
    requests.post(`Order/CreateUpdateOrderById`, createFormData(values)),
  getOrdersAll: () => requests.get("Order/GetOrders"),
  getOrderItemByOrderId: (orderId: number) =>
    requests.get(`Order/GetOrderItemByOrderId?orderId=${orderId}`),
};
