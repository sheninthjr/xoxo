import { atom } from "recoil";

const userId = crypto.randomUUID();

export const userIdState = atom<string | null>({
  key: "userIdState",
  default: userId,
});
