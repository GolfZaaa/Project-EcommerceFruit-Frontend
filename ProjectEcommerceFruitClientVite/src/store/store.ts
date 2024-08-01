import { createContext, useContext } from "react";
import commonStore from "./common.store";
import userStore from "./user.store";
import shopUserStore from "./shopuser.store";

interface Store {
    commonStore:commonStore;
    userStore:userStore;
    shopuserStore:shopUserStore
}

export const store: Store = {
    commonStore: new commonStore(),
    userStore: new userStore(),
    shopuserStore: new shopUserStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};