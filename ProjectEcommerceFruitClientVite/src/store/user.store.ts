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
    store.systemSettingStore.setLoading(true);
    const data = { phoneNumber: PhoneNumber, password: Password };
    try {
      const user = await agent.User.Login(data);
      store.systemSettingStore.setLoading(false);
      return user;
    } catch (error) {
      store.systemSettingStore.setLoading(false);
      return error;
    }
  };

  logout = () => {
    store.systemSettingStore.setLoading(true);
    this.user = null;
    store.commonStore.setToken(null);
    store.shopuserStore.setUserShop(null);
    store.addressStore.setAddress(null);
    store.addressStore.setAddressa(null);
    store.addressStore.setAddressb(null);
    store.orderStore.setOrder([]);

    store.systemSettingStore.setLoading(false);
  };

  getUserDetailbyId = async () => {
    store.systemSettingStore.setLoading(true);
    try {
      const user = await agent.User.getUserDetailbyId();
      this.user = user;
      store.systemSettingStore.setLoading(false);

      return user;
    } catch (error) {
      store.systemSettingStore.setLoading(false);
      return error;
    }
  };

  editUser = async (values: any) => {
    store.systemSettingStore.setLoading(true);

    try {
      const user = await agent.User.editUser(values);
      this.getUserDetailbyId();
      this.user = user;
      store.systemSettingStore.setLoading(false);
      return user;
    } catch (error) {
      store.systemSettingStore.setLoading(false);
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
