import { types } from "../types/types";
const initialState = {
  arboles:[],
  arbolesMapeados: [],
  active:null,
  usuarios:[],
  monitoreo:null,
  usuariosMap:null,
  filtro:[],
  filtroAplied:false
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
    case types.mapaLoadArbolesMapeados:
      return {
        ...state,
        arbolesMapeados:[...action.payload]
      }
    case types.mapaHideDetailArbol:
      return {
        ...state,
        active:null,
        monitoreo:null
      }
    case types.mapaLoadUsuarios:
      let result = [...action.payload].reduce(function(map, obj) {
        map[obj.id] = obj;
        return map;
    }, {});
      return {
        ...state,
        usuarios:[...action.payload],
        usuariosMap:result
      }
    case types.mapaSetActiveMonitoreo:
      return {
        ...state,
        monitoreo:action.payload
      }
    case types.mapaFilterArboles:
    return {
      ...state,
      filtro:[...action.payload]
    }
    case types.mapaIsFiltered:
    return {
      ...state,
      filtroAplied: action.payload
    }
    default:
      return state;
  }
}