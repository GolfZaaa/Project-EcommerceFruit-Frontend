import { createFormData, createFormDataUseMyName, requests } from "./agent";

export const Order = {
  getOrdersByUser: () => requests.get("Order/GetOrdersByUser"),
  getOrdersWantToReceipt: () => requests.get("Order/GetOrdersWantToReceipt"),
  searchOrdersWantToReceipt: (values: {
    district?: string | null;
    subDistrict?: string | null;
  }) =>
    requests.getFormAny(
      "Order/SearchOrdersWantToReceipt",
      createFormData(values)
    ),
  getMyOrderToSend: () => requests.get("Order/GetMyOrderToSend"),
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
  createOrderToReceipt: (valus: any) => {
    return requests.post(
      `Order/CreateOrderToReceipt`,
      createFormDataUseMyName(valus, "orderId")
    );
  },
  changeConfirmSendOrder: (valus: any) => {
    return requests.post(
      `Order/ChangeConfirmSendOrder`,
      createFormDataUseMyName(valus, "orderId")
    );
  },
  changeConfirmReceiptOrder: (values: any | undefined) =>
    requests.post(`Order/ChangeConfirmReceiptOrder`, createFormData(values)),
};
