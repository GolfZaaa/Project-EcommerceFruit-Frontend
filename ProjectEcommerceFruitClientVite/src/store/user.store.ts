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
  userAll: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  register = async ({ Password, FullName, PhoneNumber }: RegisterInterface) => {
    const data = {
      password: Password,
      fullName: FullName,
      phoneNumber: PhoneNumber,
      roleId: 1,
    };
    try {
      const user = await agent.User.Register(data);
      return user;
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
    store.shopuserStore.setUserShop(null);
    store.addressStore.setAddress(null);
    store.orderStore.setOrder([]);
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

  editUser = async (values: any) => {
    try {
      const user = await agent.User.editUser(values);
      this.getUserDetailbyId();
      this.user = user;
      return user;
    } catch (error) {
      return error;
    }
  };

  getUserAll = async () => {
    try {
      const user = await agent.User.getUserAll();
      this.userAll = user;
      return user;
    } catch (error) {
      return error;
    }
  };

  DeleteUser = async (id: number) => {
    try {
      await agent.User.deleteUser(id);
      this.getUserAll();
    } catch (error) {
      return error;
    }
  };
}
