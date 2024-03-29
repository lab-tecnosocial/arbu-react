import { loadEspecies } from "../helpers/loadEspecies";
import { types } from "../types/types";

export const startLoadEspeciesCatalogo = ()=>{
  return async (dispatch) => {
    const especies = await loadEspecies();
    dispatch(setEspecies(especies)); 
  }
}

export const setEspecies = (especies) => {
  return {
    type: types.catalogoLoadEspecies,
    payload:especies
  }
}

export const setActiveEspecie= (especie) => {
  return {
    type: types.catalogoSetActiveEspecie,
    payload: especie
  }
}
export const setHideDetailEspecie= () => {
  return {
    type: types.catalogoHideDetailEspecie,
  }
}

