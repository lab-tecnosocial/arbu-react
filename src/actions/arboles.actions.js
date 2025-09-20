import { types } from "../types/types";

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

export const setActivePlantedTree = (value) => ({
  type: types.SET_ACTIVE_ARBOL_PLANTADO,
  payload: value,
});

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
      const response = await fetch("http://localhost:8080/arboles-mapeados");

      if (!response.ok) {
        throw new Error("Error al obtener los árboles mapeados");
      }

      const treesData = await response.json();
      dispatch(fetchMappedTreesSuccess(treesData));
    } catch (error) {
      dispatch(fetchMappedTreesFailure(error.message));
    }
  };
};

export const fetchPlantedTrees = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchPlantedTreesRequest());
      const response = await fetch("http://localhost:8080/arboles-plantados");

      if (!response.ok) {
        throw new Error("Error al obtener los árboles plantados");
      }

      const treesData = await response.json();
      dispatch(fetchPlantedTreesSuccess(treesData));
    } catch (error) {
      dispatch(fetchPlantedTreesFailure(error.message));
    }
  };
};

// Combined action to fetch both types of trees
export const fetchAllTrees = () => {
  return async (dispatch) => {
    await Promise.all([
      dispatch(fetchMappedTrees()),
      dispatch(fetchPlantedTrees()),
    ]);
  };
};
