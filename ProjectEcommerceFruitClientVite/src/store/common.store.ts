import { makeAutoObservable, reaction } from "mobx";
import agent from "../api/agent";

export default class CommonStore {
  token: string | null = window.localStorage.getItem("jwt");
  user = "";

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else window.localStorage.removeItem("jwt");
      }
    );
  }

  setToken = (token: string | null) => {
    this.token = token;
  };
}
