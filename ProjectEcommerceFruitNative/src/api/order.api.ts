import { createFormData, createFormDataUseMyName, requests } from "./agent";

export const Order = {
  getOrdersByUser: () => requests.get("Order/GetOrdersByUser"),
  getOrdersWantToReceipt: () => requests.get("Order/GetOrdersWantToReceipt"),
  searchOrdersWantToReceipt: (params: URLSearchParams) =>
    requests.getFormAny(`Order/SearchOrdersWantToReceipt?${params.toString()}`),
  searchOrderToSendByOrderId: (orderId: string | null) => {
    return requests.onlyGet(
      "Order/SearchOrderToSendByOrderId?orderId=",
      orderId
    );
  },
  iWantToTakeOrdertoSend: (valus: any) => {
    return requests.postForm(
      `Order/IWantToTakeOrdertoSend`,
      createFormDataUseMyName(valus, "orderId")
    );
  },
  getMyOrderUserWantToTaketoSend: () =>
    requests.get("Order/GetMyOrderUserWantToTaketoSend"),
  confirmOrderToForward: (values: any | undefined) =>
    requests.postForm(`Order/ConfirmOrderToForward`, createFormData(values)),
  getMyOrderToSend: () => requests.get("Order/GetMyOrderToSend"),
  getOrderByStore: (storeId: number) =>
    requests.get(`Order/GetOrdersByStore?storeId=${storeId}`),
  confirmOrder: (values: any | undefined) =>
    requests.postForm(`Order/ConfirmOrder`, createFormData(values)),
  cancelOrder: (values: any | undefined) =>
    requests.postForm(`Order/CancelOrder`, createFormData(values)),
  CreateUpdateOrderById: (values: any | undefined) =>
    requests.postForm(`Order/CreateUpdateOrderById`, createFormData(values)),
  getOrdersAll: () => requests.get("Order/GetOrders"),
  getOrderItemByOrderId: (orderId: number) =>
    requests.get(`Order/GetOrderItemByOrderId?orderId=${orderId}`),
  createOrderToReceipt: (valus: number[]) => {
    return requests.postForm(
      `Order/CreateOrderToReceipt`,
      createFormDataUseMyName(valus, "orderId")
    );
  },
  changeConfirmSendOrder: (valus: any) => {
    return requests.postForm(
      `Order/ChangeConfirmSendOrder`,
      createFormData(valus)
    );
  },
  changeConfirmReceiptOrder: (values: any | undefined) =>
    requests.postForm(
      `Order/ChangeConfirmReceiptOrder`,
      createFormData(values)
    ),
};
