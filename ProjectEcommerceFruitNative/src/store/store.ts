import { createContext, useContext } from "react";
import CommonStore from "./common.store";
import UserStore from "./user.store";
import ProductStore from "./product.store";

interface store {
  commonStore: CommonStore;
  userStore: UserStore;
  productStore: ProductStore;
}

export const store: store = {
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  productStore: new ProductStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};
