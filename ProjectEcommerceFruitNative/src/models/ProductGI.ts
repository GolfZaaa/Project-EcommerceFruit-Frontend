import { Store } from "./Store";

export interface ProductGI {
  id: number;
  name: string;
  description: string;

  categoryId: number;
  category: Category;

  storeId: number;
  store: Store;

  images: Images[];
}

export interface Images {
  id: number;
  imageName: string | null;

  productGIId: number;
  productGI: ProductGI;
}

export interface Category {
  id: number;
  name: string;
}
