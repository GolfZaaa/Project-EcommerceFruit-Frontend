import { login } from "./login";

export interface register extends login {
  roleId: number;
  fullName: string;
}
