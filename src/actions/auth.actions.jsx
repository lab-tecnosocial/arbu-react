import { types } from '../types/types';

export const authLogin = (user) => ({
  type: types.AUTH_LOGIN,
  payload: user,
});

export const authLogout = () => ({
  type: types.AUTH_LOGOUT,
});

export const authCheckingFinish = () => ({
  type: types.AUTH_CHECKING_FINISH,
});
