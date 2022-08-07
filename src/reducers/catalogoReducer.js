import { types } from "../types/types";

const initialState = {
  especies:[],
  activeEspecie:null
}
export const catalogoReducer = (state=initialState,action)=>{

  switch (action.type) {
    case types.catalogoLoadEspecies:
      return {
        ...state,
        especies: [...action.payload]
      }; 
    case types.catalogoSetActiveEspecie:
      return {
        ...state,
        activeEspecie:{...action.payload}
      }
    case types.catalogoHideDetailEspecie:
    return {
      ...state,
      activeEspecie:null,
    }
    default:
      return state;
  }
}