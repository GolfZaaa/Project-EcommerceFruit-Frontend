import { Address } from "cluster";
import { OrderItem } from "./OrderItem";

export interface Order {
  id: number;
  paymentImage: string | null;
  createdAt: Date;
  status: number;
  ShippingType: string;
  tag: string;

  addressId: number;
  address: Address;

  orderItems: OrderItem[];
}
