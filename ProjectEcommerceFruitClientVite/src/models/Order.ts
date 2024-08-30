import { Address } from "./Address";
import { OrderItem } from "./OrderItem";

export interface Order {
  id: number;
  orderId: string;
  paymentImage: string | null;
  createdAt: Date;
  status: number;
  shippingType: string;
  tag: string;

  addressId: number;
  address: Address;

  orderItems: OrderItem[];
}
