import { Address } from "./Address";
import { OrderItem } from "./OrderItem";
import { Product } from "./Product";
import { User } from "./User";

export interface Order {
  id: number;
  orderId: string;
  paymentImage: string | null;
  createdAt: Date;
  status: number;
  shippingType: string;
  tag: string;
  confirmReceipt: number;

  addressId: number;
  address: Address;

  orderItems: OrderItem[];
  shippings: Shipping[];
}

export interface Shipping {
  id: number;
  shippingFee: number;
  shippingStatus: number;
  createdAt: Date;

  orderId: number;
  order: Order;

  driverHistories: DriverHistory[];
}

export interface DriverHistory {
  id: number;
  shippingFee: number;
  createdAt: Date;

  userId: number;
  user: User;

  shippingId: Shipping;
  shippings: Shipping;
}

export interface OrderNow {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
}
