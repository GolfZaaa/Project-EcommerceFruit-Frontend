import { makeAutoObservable, runInAction } from "mobx";
import { User } from "./../../../ProjectEcommerceFruitClientVite/src/models/User";
import agent from "../api/agent";

export default class UserStore {
  user: User | null = null;
  loadingUser: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (state: User | null) => (this.user = state);

  setLoadingUser = (state: boolean) => (this.loadingUser = state);

  getUserDetailbyId = async () => {
    runInAction(() => this.setLoadingUser(true));
    try {
      await agent.User.getUserDetailbyId().then((res) => {
        console.log("user : ", res);

        this.user = res;
      });
    } catch (error) {
      runInAction(() => this.setLoadingUser(false));
      console.log("error", error);

      throw error;
    }
  };
}
