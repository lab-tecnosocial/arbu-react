import { types } from "../types/types";

// Estado unificado de sesión:
//   checking -> true mientras Firebase resuelve si hay sesión (evita redirigir
//               al login por error al recargar una ruta protegida).
//   user     -> el usuario de Firebase Auth, o null si no hay sesión.
const initialState = {
  checking: true,
  user: null,
}

export const authReducer = (state = initialState, action) => {

  switch (action.type) {
    case types.AUTH_LOGIN:
      return {
        ...state,
        checking: false,
        user: action.payload,
      }

    case types.AUTH_LOGOUT:
      return {
        ...initialState,
        checking: false
      }

    case types.AUTH_CHECKING_FINISH:
      return {
        ...state,
        checking: false
      }

    default:
      return state;
  }
}
