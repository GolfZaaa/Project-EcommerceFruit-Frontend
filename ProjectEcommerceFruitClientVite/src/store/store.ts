import { createContext, useContext } from "react";
import commonStore from "./common.store";
import userStore from "./user.store";
import shopUserStore from "./shopuser.store";
import ProductStore from "./product.store";
import OrderStore from "./order.store";
import CartStore from "./cart.store";
import AddressStore from "./address.store";

interface Store {
  commonStore: commonStore;
  userStore: userStore;
  shopuserStore: shopUserStore;
  productStore: ProductStore;
  orderStore: OrderStore;
  cartStore: CartStore;
  addressStore: AddressStore;
}

export const store: Store = {
  commonStore: new commonStore(),
  userStore: new userStore(),
  shopuserStore: new shopUserStore(),
  productStore: new ProductStore(),
  orderStore: new OrderStore(),
  cartStore: new CartStore(),
  addressStore: new AddressStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};
