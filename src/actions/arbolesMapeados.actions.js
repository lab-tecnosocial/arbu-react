import { types } from "../types/types";

export const fetchArbolesMapeadosRequest = () => ({
  type: types.FETCH_ARBOLES_MAPEADOS_REQUEST,
})

export const fetchArbolesMapeadosSuccess = (data) => ({
  type: types.FETCH_ARBOLES_MAPEADOS_SUCCESS,
  payload: data,
})

export const fetchArbolesMapeadosFailure = (error) => ({
  type: types.FETCH_ARBOLES_MAPEADOS_FAILURE,
  payload: error,
})

export const setActiveArbolesMapeados = (value) => {
  return {
    type: types.SHOW_DATA_ARBOLES_MAPEADOS,
    payload: value
  }
}


export const fetchArbolesMapeados = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchArbolesMapeadosRequest());
      const response = await fetch("http://localhost:8080/arboles-mapeados");

      if (!response.ok) {
        throw new Error("Error al obtener arboles");
      }

      const arbolesData = await response.json();
      dispatch(fetchArbolesMapeadosSuccess(arbolesData));

    } catch (error) {
      dispatch(fetchArbolesMapeadosFailure(error.message))
    }
  }
}
