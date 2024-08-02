import { requests } from "./agent";


export const User = {
    getUserDetailbyId:()=> requests.get("Auth/GetTokenDetail"),
    Login:(value:any)=> requests.post("Auth/Login",value),
    Register:(value:any) => requests.post("Auth/Register",value),
}