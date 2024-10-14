import { requests } from "./agent";

export const User = {
  getUserDetailbyId: () => requests.get("Auth/GetTokenDetail"),
};
