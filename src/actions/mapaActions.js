import { loadArboles } from "../helpers/loadArboles"
import { loadUsuarios } from "../helpers/loadUsuarios"
import { types } from "../types/types"

export const activeArbol = (id,arbol) => {
  return {
    type:types.mapaActiveArbol,
    payload:{id,...arbol}
  }
}
export const startLoadingArboles = () => {
  return async (dispatch) => {
    const arboles = await loadArboles();
    dispatch(setArboles(arboles)); 
  }
}
export const setArboles = (arboles) => {
  return {
    type: types.mapaLoadArboles,
    payload:arboles
  }
}
export const hideDetailArbol = () => {
  return {
    type:types.mapaHideDetailArbol
  }
}
export const startLoadingUsuarios = () => {
  return async (dispatch) => {
    const usuarios = await loadUsuarios();
    dispatch(setUsuarios(usuarios));
  }
}
export const setUsuarios = (usuarios) => {
  return {
    type: types.mapaLoadUsuarios,
    payload:usuarios
  }
}
export const setActiveMonitoreo=(monitoreo)=>{
  return {
    type: types.mapaSetActiveMonitoreo,
    payload: monitoreo
  }
}