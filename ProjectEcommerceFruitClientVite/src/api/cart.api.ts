import { requests } from "./agent";


export const Cart = {
    AddtoCart:(value:any) => requests.post("Cart/AddToCart",value),
    GetCartItemByUser:()=> requests.get("Cart/GetCartItemByUser"),
    GetCartItemByUserOrderStore:()=> requests.get("Cart/GetCartItemByUserOrderByStore"),
}