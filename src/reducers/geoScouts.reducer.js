import { types } from "../types/types";

const initialState = {
  scouts: null,
  isActiveScouts: false,
}

export const geoScoutsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_GEO_SCOUTS:
      return {
        ...state,
        scouts: action.payload
      }
    case types.SHOW_GEO_SCOUTS:
      return {
        ...state,
        isActiveScouts: action.payload
      }
    default:
      return state;
  }
}
