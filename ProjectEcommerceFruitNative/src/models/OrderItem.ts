import { Order } from "./Order";
import { Product } from "./Product";

export interface OrderItem {
  id: number;
  quantity: number;

  productId: number;
  product: Product;

  orderId: number;
  order: Order;
}
