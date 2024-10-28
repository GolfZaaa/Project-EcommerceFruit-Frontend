import { createContext, useContext } from "react";
import CommonStore from "./common.store";
import UserStore from "./user.store";
import ProductStore from "./product.store";
import CartStore from "./cart.store";
import SystemSettingStore from "./systemsetting.store";
import AddressStore from "./address.store";
import OrderStore from "./order.store";

interface store {
  commonStore: CommonStore;
  userStore: UserStore;
  productStore: ProductStore;
  cartStore: CartStore;
  systemSettingStore: SystemSettingStore;
  addressStore: AddressStore;
  orderStore: OrderStore;
}

export const store: store = {
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  productStore: new ProductStore(),
  cartStore: new CartStore(),
  systemSettingStore: new SystemSettingStore(),
  addressStore: new AddressStore(),
  orderStore: new OrderStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};
