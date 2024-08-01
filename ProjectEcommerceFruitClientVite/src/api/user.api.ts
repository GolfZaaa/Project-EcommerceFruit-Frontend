import { requests } from "./agent";


export const User = {
    getUser:()=> requests.get(""),
    Login:(value:any)=> requests.post("Auth/Login",value),
    Register:(value:any) => requests.post("Auth/Register",value),
}
