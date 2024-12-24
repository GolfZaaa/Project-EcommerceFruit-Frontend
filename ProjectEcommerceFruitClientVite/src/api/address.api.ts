import { createFormData, requests } from "./agent";

export const Address = {
  GetAddressByUserId: () => requests.get("Address/GetAddressByUserId"),
  getAddressgotoOrderByUserId: () =>
    requests.get("Address/GetAddressgotoOrderByUserId"),
  GetAddressByStore: () => requests.get("Address/GetAddressByStore"),
  createUpdateAddress: (values: any) =>
    requests.post(`Address/CreateUpdateAddress`, values),
  removeAddressById: (id: number) =>
    requests.delete(`Address/RemoveAddressById?addressId=${id}`),
  isUsedAddress: (values: any) =>
    requests.post(`Address/IsUsedAddress`, createFormData(values)),
};
