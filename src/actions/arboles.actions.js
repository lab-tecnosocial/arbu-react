import { loadArboles } from "../helpers/loadArboles";
import { loadArbolesMapeados } from "../helpers/loadArbolesMapeados";
import { INSCRIPCIONES_MAPEO_MOCK } from "../pages/mapav/utils/inscripcionesMapeoMock";
import { types } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL;

// Action creators for mapped trees (árboles mapeados)
export const fetchMappedTreesRequest = () => ({
  type: types.FETCH_ARBOLES_MAPEADOS_REQUEST,
});

export const fetchMappedTreesSuccess = (data) => ({
  type: types.FETCH_ARBOLES_MAPEADOS_SUCCESS,
  payload: data,
});

export const fetchMappedTreesFailure = (error) => ({
  type: types.FETCH_ARBOLES_MAPEADOS_FAILURE,
  payload: error,
});

export const setActiveMappedTrees = (value) => ({
  type: types.SHOW_DATA_ARBOLES_MAPEADOS,
  payload: value,
});

// Action creators for planted trees (árboles plantados)
export const fetchPlantedTreesRequest = () => ({
  type: types.FETCH_ARBOLES_PLANTADOS_REQUEST,
});

export const fetchPlantedTreesSuccess = (data) => ({
  type: types.FETCH_ARBOLES_PLANTADOS_SUCCESS,
  payload: data,
});

export const fetchPlantedTreesFailure = (error) => ({
  type: types.FETCH_ARBOLES_PLANTADOS_FAILURE,
  payload: error,
});

export const setActivePlantedTrees = (value) => ({
  type: types.SHOW_DATA_ARBOLES_PLANTADOS,
  payload: value,
});

export const setPlantedTreesFilter = (filters) => ({
  type: types.FILTRAR_ARBOLES_PLANTADOS,
  payload: filters,
});

export const resetPlantedTreesFilter = () => ({
  type: types.RESET_PLANTADOS_FILTRADOS,
});

export const setMappedTreesActivityFilter = (activity) => ({
  type: types.FILTRAR_ARBOLES_MAPEADOS,
  payload: activity,
});

export const resetMappedTreesActivityFilter = () => ({
  type: types.RESET_MAPEADOS_FILTRADOS,
});

export const fetchInscripcionesMapeoRequest = () => ({
  type: types.FETCH_INSCRIPCIONES_MAPEO_REQUEST,
});

export const fetchInscripcionesMapeoSuccess = (data) => ({
  type: types.FETCH_INSCRIPCIONES_MAPEO_SUCCESS,
  payload: data,
});

export const fetchInscripcionesMapeoFailure = (error) => ({
  type: types.FETCH_INSCRIPCIONES_MAPEO_FAILURE,
  payload: error,
});

// export const setActivePlantedTree = (value) => ({
//   type: types.SET_ACTIVE_ARBOL_PLANTADO,
//   payload: value,
// });

export const selectPlantedTree = (value) => ({
  type: types.SETLECT_ARBOL_PLANTADO,
  payload: value,
});

export const setSearchStart = (value) => ({
  type: types.START_BUSQUEDA,
  payload: value,
});

// Thunk actions
export const fetchMappedTrees = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchMappedTreesRequest());
      const treesData = await loadArbolesMapeados();
      dispatch(fetchMappedTreesSuccess(treesData));
    } catch (error) {
      console.log(error);

      dispatch(fetchMappedTreesFailure(error.message));
    }
  };
};

export const fetchPlantedTrees = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchPlantedTreesRequest());
      const treesData = await loadArboles();
      dispatch(fetchPlantedTreesSuccess(treesData));
    } catch (error) {
      console.log(error)
      dispatch(fetchPlantedTreesFailure(error.message));
    }
  };
};

export const fetchAllTrees = () => {
  return async (dispatch) => {
    await Promise.all([
      dispatch(fetchMappedTrees()),
      dispatch(fetchPlantedTrees()),
      dispatch(fetchInscripcionesMapeo()),
    ]);
  };
};

export const fetchInscripcionesMapeo = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchInscripcionesMapeoRequest());
      dispatch(fetchInscripcionesMapeoSuccess(INSCRIPCIONES_MAPEO_MOCK));
    } catch (error) {
      console.log(error);
      dispatch(fetchInscripcionesMapeoFailure(error.message));
    }
  };
};
