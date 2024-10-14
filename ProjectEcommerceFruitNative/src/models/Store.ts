import { ProductGI } from "./ProductGI";
import { User } from "./User";

export interface Store {
  id: number;
  name: string;
  description: string;
  createdAt: Date;

  userId: number;
  user: User;

  hidden: boolean;

  productGIs: ProductGI[] | [];
}
