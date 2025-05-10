import { types } from "../types/types";

const initialState = {
  user: null
}
export const authReducer = (state=initialState,action)=>{

  switch (action.type) {
    case types.setUser:
      return { ...state, 
        user: {
          uid: action.payload.uid,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
        }
      };
    case types.clearUser:
      return { ...state, user: null };
    default:
      return state;
  }
}