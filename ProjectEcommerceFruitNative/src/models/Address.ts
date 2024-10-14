import { User } from "./User";

export interface Address {
  id: number;
  province: string;
  district: string;
  subDistrict: string;
  postCode: string;
  detail: string;
  isUsed_Store: boolean;
  isUsed: boolean;
  gps: string | null;

  userId: number;
  user: User;
}
