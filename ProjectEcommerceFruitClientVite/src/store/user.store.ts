import { makeAutoObservable } from "mobx";
import agent from "../api/agent";

interface RegisterInterface {
  Username: string;
  Password: string;
  FullName: string;
  PhoneNumber: number;
  RoleId: number;
}

export default class UserStore {
  user: any = [];
  
  constructor() {
    makeAutoObservable(this);
  }

  register = async ({ Username, Password, FullName, PhoneNumber, RoleId }:RegisterInterface) => {
  const data = { username:Username, password:Password, fullName:FullName, phoneNumber:PhoneNumber, roleId:1 }
    try {
      await agent.User.Register(data);
    } catch (error) {
      return error;
    }
  };
  login = async({Username, Password}:RegisterInterface) => {
    const data = {username:Username, password:Password}
    try {
     const user = await agent.User.Login(data);
     this.user = user;
     return user;
    } catch (error) {
      return error;
    }
  }
}

