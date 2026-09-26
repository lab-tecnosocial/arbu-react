import { loadCampaniasPublicas } from "../helpers/campanias/loadCampanias";
import { types } from "../types/types";
import { mostrarArbolesMapeados, setActivePlantedTrees } from "./arboles.actions";

export const fetchCampaniasRequest = () => ({ type: types.FETCH_CAMPANIAS_REQUEST });

export const fetchCampaniasSuccess = (data) => ({
  type: types.FETCH_CAMPANIAS_SUCCESS,
  payload: data,
});

export const fetchCampaniasFailure = (error) => ({
  type: types.FETCH_CAMPANIAS_FAILURE,
  payload: error,
});

/** Solo cambia la selección; la coreografía de capas va en los thunks. */
export const setCampaniaSeleccionada = (campaniaId) => ({
  type: types.SELECT_CAMPANIA,
  payload: campaniaId,
});

export const limpiarCampaniaSeleccionada = () => ({ type: types.CLEAR_CAMPANIA });

export const fetchCampaniasPublicas = ({ forzar = false } = {}) => async (dispatch, getState) => {
  const { campanias } = getState().arboles;
  if (!forzar && !campanias.error && (campanias.loading || campanias.data.length > 0)) return;

  try {
    dispatch(fetchCampaniasRequest());
    dispatch(fetchCampaniasSuccess(await loadCampaniasPublicas()));
  } catch (error) {
    console.error("[campanias] no se pudieron cargar las campañas públicas:", error);
    dispatch(fetchCampaniasFailure(error.message));
  }
};

/**
 * Seleccionar una campaña enciende la capa de mapeados y apaga la de plantados.
 * Va aquí y no en el Sidebar para que el componente sea presentacional.
 */
export const selectCampania = (campaniaId) => (dispatch) => {
  dispatch(setCampaniaSeleccionada(campaniaId));
  dispatch(setActivePlantedTrees(false));
  dispatch(mostrarArbolesMapeados(true));
};

export const clearCampania = () => (dispatch) => {
  dispatch(limpiarCampaniaSeleccionada());
  dispatch(setActivePlantedTrees(true));
  dispatch(mostrarArbolesMapeados(false));
};
