import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { User } from "../models/User";
import { store } from "./store";

interface RegisterInterface {
  Username: string;
  Password: string;
  FullName: string;
  PhoneNumber: number;
  RoleId: number;
}

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  register = async ({
    Username,
    Password,
    FullName,
    PhoneNumber,
  }: RegisterInterface) => {
    const data = {
      username: Username,
      password: Password,
      fullName: FullName,
      phoneNumber: PhoneNumber,
      roleId: 1,
    };
    try {
      await agent.User.Register(data);
    } catch (error) {
      return error;
    }
  };

  login = async ({ PhoneNumber, Password }: RegisterInterface) => {
    const data = { phoneNumber: PhoneNumber, password: Password };
    try {
      const user = await agent.User.Login(data);
      return user;
    } catch (error) {
      return error;
    }
  };

  logout = () => {
    this.user = null;
    store.commonStore.setToken(null);
  };

  getUserDetailbyId = async () => {
    try {
      const user = await agent.User.getUserDetailbyId();
      this.user = user;
      return user;
    } catch (error) {
      return error;
    }
  };
}
