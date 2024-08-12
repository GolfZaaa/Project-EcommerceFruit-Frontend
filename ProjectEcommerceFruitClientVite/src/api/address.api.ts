import { createFormData, requests } from "./agent";

export const Address = {
  GetAddressByUserId: () => requests.get("Address/GetAddressByUserId"),
  GetAddressByStore: () => requests.get("Address/GetAddressByStore"),
  createUpdateAddress: (values: any) =>
    requests.post(`Address/CreateUpdateAddress`, values),
  isUsedAddress: (values: any) =>
    requests.post(`Address/IsUsedAddress`, createFormData(values)),
};
