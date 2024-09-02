import { CartItem } from "./CartItem";
import { OrderItem } from "./OrderItem";
import { ProductGI } from "./ProductGI";

export interface Product {
  id: number;
  images: string | null;
  weight: number;
  quantity: number;
  price: number;
  sold: number;
  detail: string;
  status: boolean;
  createdAt: Date;

  productGIId: number;
  productGI: ProductGI;

  cartItems: CartItem[] | [];
  orderItems: OrderItem[] | [];
}
