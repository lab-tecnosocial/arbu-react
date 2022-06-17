import { types } from "../types/types";
const initialState = {
  arboles:[],
  active:null,
  usuarios:[],
  monitoreo:null
}
export const mapaReducer = (state=initialState,action) => {
  switch (action.type) {
    case types.mapaActiveArbol:
      return {
        ...state,
        active:{...action.payload}
      }
    case types.mapaLoadArboles:
      return {
        ...state,
        arboles:[...action.payload]
      }
    case types.mapaHideDetailArbol:
      return {
        ...state,
        active:null,
        monitoreo:null
      }
    case types.mapaLoadUsuarios:
      return {
        ...state,
        usuarios:[...action.payload]
      }
    case types.mapaSetActiveMonitoreo:
      return {
        ...state,
        monitoreo:action.payload
      }
    default:
      return state;
  }
}