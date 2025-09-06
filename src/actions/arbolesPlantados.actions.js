import { types } from "../types/types";

export const fetchArbolesPlantadosRequest = () => ({
  type: types.FETCH_ARBOLES_PLANTADOS_REQUEST,
})

export const fetchArbolesPlantadosSuccess = (data) => ({
  type: types.FETCH_ARBOLES_PLANTADOS_SUCCESS,
  payload: data,
})

export const fetchArbolesPlantadosFailure = (error) => ({
  type: types.FETCH_ARBOLES_PLANTADOS_FAILURE,
  payload: error,
})

export const setActiveArbolesPlantados = (value) => {
  return {
    type: types.SHOW_DATA_ARBOLES_PLANTADOS,
    payload: value
  }
}

export const setFiltroArbolesPlantados = (filtros) => {
  return {
    type: types.FILTRAR_ARBOLES_PLANTADOS,
    payload: filtros
  }
}

export const defaultPlantadosFiltrados = () => ({
  type: types.RESET_PLANTADOS_FILTRADOS,
})

export const setActiveArbolPlantado = (value) => ({
  type: types.SET_ACTIVE_ARBOL_PLANTADO,
  payload: value
})

export const selectArbolPlantado = (value) => ({
  type: types.SETLECT_ARBOL_PLANTADO,
  payload: value
})

export const setStartBusqueda = (value) => ({
  type: types.START_BUSQUEDA,
  payload: value
})


export const fetchArbolesPlantados = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchArbolesPlantadosRequest());
      const response = await fetch("http://localhost:8080/arboles-plantados");

      if (!response.ok) {
        throw new Error("Error al obtener arboles");
      }

      const arbolesData = await response.json();
      dispatch(fetchArbolesPlantadosSuccess(arbolesData));

    } catch (error) {
      dispatch(fetchArbolesPlantadosFailure(error.message))
    }
  }
}


