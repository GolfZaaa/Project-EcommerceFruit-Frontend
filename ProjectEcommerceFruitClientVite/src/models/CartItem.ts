import { Product } from "./Product";
import { User } from "./User";

export interface CartItem {
  id: number;
  weight: number;

  userId: number;
  user: User;

  productId: number;
  product: Product;
}
