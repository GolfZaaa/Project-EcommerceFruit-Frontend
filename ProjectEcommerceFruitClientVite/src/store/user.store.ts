import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { User } from "../models/User";

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

  login = async ({ Username, Password }: RegisterInterface) => {
    const data = { username: Username, password: Password };
    try {
      const user = await agent.User.Login(data);
      this.user = user;
      return user;
    } catch (error) {
      return error;
    }
  };
  getUserDetailbyId = async() => {
    try {
      const user = await agent.User.getUserDetailbyId();
      this.user = user;
      return user;
    } catch (error) {
      return error;
    }
  }
}
