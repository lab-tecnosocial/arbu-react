import { FRESCURA_MAPA_PUBLICO_MS } from "../helpers/leerColeccion";
import { loadArboles } from "../helpers/loadArboles";
import { loadArbolesMapeados } from "../helpers/loadArbolesMapeados";
import { loadInscripcionesMapeoPublic } from "../helpers/loadInscripciones";
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

/**
 * Encender la capa de mapeados trae consigo sus inscripciones (el escudo
 * scout). Va en un thunk para que ni el Sidebar ni las campañas tengan que
 * acordarse de pedirlas.
 */
export const mostrarArbolesMapeados = (visible) => (dispatch) => {
  dispatch(setActiveMappedTrees(visible));
  if (visible) dispatch(asegurarInscripcionesMapeo());
};

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

/**
 * Volver al mapa desde otra ruta no tiene por qué repetir 4.800 lecturas: si
 * los datos ya están en el store y no hubo error, no se vuelve a pedir. El
 * botón "Reintentar" pasa `forzar` para saltarse esta guardia.
 */
const yaEstaCargado = (slice, forzar) =>
  !forzar && !slice.error && (slice.loading || slice.data.length > 0);

export const fetchMappedTrees = ({ forzar = false } = {}) => {
  return async (dispatch, getState) => {
    if (yaEstaCargado(getState().arboles.arbolesMapeados, forzar)) return;
    try {
      dispatch(fetchMappedTreesRequest());
      const treesData = await loadArbolesMapeados({
        frescuraMs: FRESCURA_MAPA_PUBLICO_MS,
        alRefrescar: (datos) => dispatch(fetchMappedTreesSuccess(datos)),
      });
      dispatch(fetchMappedTreesSuccess(treesData));
    } catch (error) {
      console.error("[arboles mapeados] no se pudieron cargar:", error);

      dispatch(fetchMappedTreesFailure(error.message));
    }
  };
};

export const fetchPlantedTrees = ({ forzar = false } = {}) => {
  return async (dispatch, getState) => {
    if (yaEstaCargado(getState().arboles.arbolesPlantados, forzar)) return;
    try {
      dispatch(fetchPlantedTreesRequest());
      const treesData = await loadArboles({
        frescuraMs: FRESCURA_MAPA_PUBLICO_MS,
        alRefrescar: (datos) => dispatch(fetchPlantedTreesSuccess(datos)),
      });
      dispatch(fetchPlantedTreesSuccess(treesData));
    } catch (error) {
      console.error("[arboles plantados] no se pudieron cargar:", error);
      dispatch(fetchPlantedTreesFailure(error.message));
    }
  };
};

/**
 * Las inscripciones solo sirven para el escudo scout de los árboles MAPEADOS,
 * y esa capa está apagada al entrar. Se piden la primera vez que se enciende,
 * no al cargar la página.
 */
export const asegurarInscripcionesMapeo = () => {
  return async (dispatch, getState) => {
    const { inscripcionesMapeo } = getState().arboles;
    if (inscripcionesMapeo.loading || inscripcionesMapeo.data.length > 0) return;

    try {
      dispatch(fetchInscripcionesMapeoRequest());
      // Proyección sin PII: solo {id, grupo, rama}, lo justo para el escudo scout.
      dispatch(fetchInscripcionesMapeoSuccess(await loadInscripcionesMapeoPublic()));
    } catch (error) {
      console.error("[inscripciones] no se pudieron cargar:", error);
      dispatch(fetchInscripcionesMapeoFailure(error.message));
    }
  };
};
