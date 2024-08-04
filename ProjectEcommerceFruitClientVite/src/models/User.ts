import { Address } from "./Address";
import { Store } from "./Store";
import { CartItem } from "./CartItem";

export interface User {
  id: number;
  fullName: string;
  userName: string;
  password: string;
  phoneNumber: number;
  roleId: number;
  role: Role;
  stores: Store[] | [];
  addresses: Address[] | [];
  cartItems: CartItem[] | [];
}

export interface Role {
  id: number;
  name: string;
}
