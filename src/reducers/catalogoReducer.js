import { types } from "../types/types";

const initialState = {
  especies:[]
}
export const catalogoReducer = (state=initialState,action)=>{

  switch (action.type) {
    case types.catalogoLoadEspecies:
      return {
        ...state,
        especies: [...action.payload]
      }; 
    default:
      return state;
  }
}