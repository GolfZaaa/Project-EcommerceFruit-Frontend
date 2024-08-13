import { requests } from "./agent";

export const User = {
  getUserDetailbyId: () => requests.get("Auth/GetTokenDetail"),
  editUser: (values: any) => requests.post("Auth/EditUser", values),
  Login: (value: any) => requests.post("Auth/Login", value),
  Register: (value: any) => requests.post("Auth/Register", value),
};
