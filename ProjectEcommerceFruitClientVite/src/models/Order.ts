import { Address } from "./Address";
import { OrderItem } from "./OrderItem";
import { Product } from "./Product";

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


export interface OrderNow {
  id: number;
  productId: number;
  product: Product;
  quantity:number;
}