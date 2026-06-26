import { types } from "../types/types";

const initialState = {
  checking: true,
  uid: null,
}

export const authReducer = (state = initialState, action) => {

  switch (action.type) {
    case types.AUTH_LOGIN:
      return {
        ...state,
        checking: false,
        uid: action.payload,
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
