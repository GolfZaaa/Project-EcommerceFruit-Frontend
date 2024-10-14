import { createContext, useContext } from "react";
import CommonStore from "./common.store";
import UserStore from "./user.store";

interface store {
  commonStore: CommonStore;
  userStore: UserStore;
}

export const store: store = {
  commonStore: new CommonStore(),
  userStore: new UserStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};
