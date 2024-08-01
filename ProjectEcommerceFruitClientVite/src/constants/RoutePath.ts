import { config } from "../helper/config";

const HOST = config.baseURL ?? "/";

export const RoutePath = {
  firstscreen: HOST,
  HomeScreen: `${HOST}home-screen`,
  loginScreen: `${HOST}login-screen`,
  registerScreen: `${HOST}register-screen`,
};
