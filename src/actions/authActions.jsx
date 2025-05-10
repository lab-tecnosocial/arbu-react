import { types } from "../types/types";

export const setUser = (user) => ({ type: types.setUser, payload: user });
export const clearUser = () => ({ type: types.clearUser });