import { requests } from "./agent";


export const Shop = {
    CreateandUpdate:(value:any)=> requests.post("Store/CreateUpdateStore",value),
    GetShopByUserId:()=> requests.get("Store/GetStoreByUserId"),

}
