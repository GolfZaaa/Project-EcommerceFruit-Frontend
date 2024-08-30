import { toast } from "react-toastify";

export const myToast = (name: string) => toast(name);

export const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
