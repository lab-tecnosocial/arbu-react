import { types } from "../types/types";
import { filtrarArbolesDeCampania } from "../helpers/campanias/registros";
import { EMPTY_FILTERS, applyTreeFilters, hasActiveFilters } from "../pages/mapav/utils/treeFilters";

const initialMappedTreesState = {
  data: [],
  visibleData: [],
  isActive: false,
  loading: false,
  error: null,
};

const initialPlantedTreesState = {
  data: [],
  visibleData: [],
  isActive: true,
  selectedTree: null,
  isTreeSelected: false,
  isSearching: false,
  loading: false,
  error: null,
};

const initialInscripcionesMapeoState = {
  data: [],
  loading: false,
  error: null,
};

const initialCampaniasState = {
  data: [],
  selectedId: null,
  loading: false,
  error: null,
};

const initialState = {
  arbolesMapeados: initialMappedTreesState,
  arbolesPlantados: initialPlantedTreesState,
  inscripcionesMapeo: initialInscripcionesMapeoState,
  campanias: initialCampaniasState,
  filters: EMPTY_FILTERS,
};

const arbolesMapeadosReducer = (state = initialMappedTreesState, action) => {
  switch (action.type) {
    case types.FETCH_ARBOLES_MAPEADOS_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_ARBOLES_MAPEADOS_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: null };

    case types.FETCH_ARBOLES_MAPEADOS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.SHOW_DATA_ARBOLES_MAPEADOS:
      return { ...state, isActive: action.payload };

    default:
      return state;
  }
};

const arbolesPlantadosReducer = (state = initialPlantedTreesState, action) => {
  switch (action.type) {
    case types.FETCH_ARBOLES_PLANTADOS_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_ARBOLES_PLANTADOS_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: null };

    case types.FETCH_ARBOLES_PLANTADOS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.SHOW_DATA_ARBOLES_PLANTADOS:
      return { ...state, isActive: action.payload };

    case types.SETLECT_ARBOL_PLANTADO:
      return { ...state, selectedTree: action.payload, isTreeSelected: true };

    case types.START_BUSQUEDA:
      return { ...state, isSearching: action.payload };

    case types.FILTRAR_ARBOLES_PLANTADOS:
      return { ...state, isSearching: true };

    case types.RESET_PLANTADOS_FILTRADOS:
      return { ...state, isSearching: false };

    default:
      return state;
  }
};

const inscripcionesMapeoReducer = (state = initialInscripcionesMapeoState, action) => {
  switch (action.type) {
    case types.FETCH_INSCRIPCIONES_MAPEO_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_INSCRIPCIONES_MAPEO_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: null };

    case types.FETCH_INSCRIPCIONES_MAPEO_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const campaniasReducer = (state = initialCampaniasState, action) => {
  switch (action.type) {
    case types.FETCH_CAMPANIAS_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_CAMPANIAS_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: null };

    case types.FETCH_CAMPANIAS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.SELECT_CAMPANIA:
      return { ...state, selectedId: action.payload };

    case types.CLEAR_CAMPANIA:
      return { ...state, selectedId: null };

    default:
      return state;
  }
};

/** Los filtros del sidebar son uno solo: viven al nivel de `state.arboles`. */
const filtersReducer = (state = EMPTY_FILTERS, action) => {
  switch (action.type) {
    case types.FILTRAR_ARBOLES_PLANTADOS:
      return { ...EMPTY_FILTERS, ...action.payload };

    case types.RESET_PLANTADOS_FILTRADOS:
      return EMPTY_FILTERS;

    default:
      return state;
  }
};

const ACTIONS_REQUIRING_RECOMPUTE = new Set([
  types.FETCH_ARBOLES_MAPEADOS_SUCCESS,
  types.FETCH_ARBOLES_PLANTADOS_SUCCESS,
  types.FETCH_CAMPANIAS_SUCCESS,
  types.SELECT_CAMPANIA,
  types.CLEAR_CAMPANIA,
  types.FILTRAR_ARBOLES_PLANTADOS,
  types.RESET_PLANTADOS_FILTRADOS,
]);

/**
 * `visibleData` es SIEMPRE lo que hay que pintar. Antes los clusters hacían
 * `filteredData.length > 0 ? filteredData : data`, así que un filtro sin
 * resultados mostraba el mapa entero mientras el sidebar decía "sin
 * resultados".
 */
const recomputar = (estado) => {
  const { filters, campanias } = estado;
  const campania = campanias.data.find((c) => c.id === campanias.selectedId) ?? null;

  // Los mapeados se acotan primero por campaña y después por los filtros del
  // sidebar: ambos se componen, ninguno pisa al otro.
  const mapeadosEnCampania = campania
    ? filtrarArbolesDeCampania(estado.arbolesMapeados.data, campania)
    : estado.arbolesMapeados.data;

  return {
    ...estado,
    arbolesPlantados: {
      ...estado.arbolesPlantados,
      visibleData: applyTreeFilters(estado.arbolesPlantados.data, filters),
    },
    arbolesMapeados: {
      ...estado.arbolesMapeados,
      visibleData: applyTreeFilters(mapeadosEnCampania, filters),
    },
  };
};

const treeReducers = (state = initialState, action) => {
  const nextState = {
    arbolesMapeados: arbolesMapeadosReducer(state.arbolesMapeados, action),
    arbolesPlantados: arbolesPlantadosReducer(state.arbolesPlantados, action),
    inscripcionesMapeo: inscripcionesMapeoReducer(state.inscripcionesMapeo, action),
    campanias: campaniasReducer(state.campanias, action),
    filters: filtersReducer(state.filters, action),
  };

  if (!ACTIONS_REQUIRING_RECOMPUTE.has(action.type)) return nextState;

  const recomputado = recomputar(nextState);

  // `isSearching` abre el panel de resultados del sidebar: solo tiene sentido
  // si de verdad hay un filtro aplicado.
  return {
    ...recomputado,
    arbolesPlantados: {
      ...recomputado.arbolesPlantados,
      isSearching: hasActiveFilters(recomputado.filters),
    },
  };
};

export default treeReducers;
