import { login } from "../interfaces/user/login";
import { register } from "../interfaces/user/register";
import { requests } from "./agent";

export const Common = {
  login: (values: login) => requests.post("Auth/Login", values),
  register: (values: register) => requests.post("Auth/Register", values),
};
