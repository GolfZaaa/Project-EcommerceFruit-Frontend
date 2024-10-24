import { Product } from "./Product";
import { User } from "./User";

export interface CartItem {
  id: number;
  quantity: number;

  userId: number;
  user: User;

  productId: number;
  product: Product;
}

export interface CartItemByStore {
  storeId: number;
  storeName: string;
  productName: string;
  cartItemId: number;
  categoryName: string;
  products: Product[];
}
