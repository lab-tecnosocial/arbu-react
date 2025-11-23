import { types } from '../types/types';

export const authLogin = (uid) => ({
  type: types.AUTH_LOGIN,
  payload: uid,
});

export const authLogout = () => ({
  type: types.AUTH_LOGOUT,
});

export const authCheckingFinish = () => ({
  type: types.AUTH_CHECKING_FINISH,
});
