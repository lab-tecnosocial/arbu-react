import { loadArboles } from "../helpers/loadArboles"
import { loadUsuarios } from "../helpers/loadUsuarios"
import { types } from "../types/types"

const API_URL = import.meta.env.VITE_API_URL;

export const setModalState = (modalState, selectedTree = {}) => {
  return {
    type: types.SET_MODAL_STATE,
    payload: {
      modalState,
      selectedTree
    }
  }
}

export const setActiveGeoScouts = (value) => ({
  type: types.SET_ACTIVE_GEO_SCOUTS,
  payload: value
})

export const setActiveGeoOtbs = (value) => ({
  type: types.SET_ACTIVE_GEO_OTBS,
  payload: value
})

export const setGeoMode = (value) => ({
  type: types.SET_GEO_MODE,
  payload: value
})

// export const fetchGeoScouts = () => {
//   return async (dispatch) => {
//     const response = await fetch('http://localhost:8080/triangulacion_grupos_scouts.geojson')
//     const res = await response.json()
//     dispatch(fetchGeoScoutsSuccess(res));
//   }
// }

export const loadGeoScouts = () => {
  return async (dispatch) => {
    console.log("Loading Geo Scouts...")
    const response = await fetch(`${API_URL}/triangulacion_grupos_scouts.geojson`)
    const res = await response.json()
    dispatch({
      type: types.LOAD_GEO_SCOUTS,
      payload: res
    })
  }
}

export const loadGeoOtbs = () => {
  return async (dispatch) => {
    const response = await fetch(`${API_URL}/triangulacion_grupos_scouts.geojson`)
    const res = await response.json()
    dispatch({
      type: types.LOAD_GEO_OTBS,
      payload: res
    })
  }
}

export const setShowControls = (value) => {
  return {
    type: types.MAPA_SHOW_CONTROLS,
    payload: value
  }
}

export const setClickPosition = (value) => {
  return {
    type: types.MAPA_CLICK_POSITION,
    payload: value
  }
}

export const setShowTreeMappingForm = (value) => {
  return {
    type: types.MAPA_SHOW_TREE_MAPPING_FORM,
    payload: value
  }
}

export const setShowTreeAdoptForm = (value) => {
  return {
    type: types.MAPA_SHOW_TREE_ADOPT_FORM,
    payload: value
  }
}

export const activeArbol = (id, arbol) => {
  return {
    type: types.mapaActiveArbol,
    payload: { id, ...arbol }
  }
}
export const setShowArbolesPlantados = (value) => {
  return {
    type: types.mapaShowArbolesPlantados,
    payload: value
  }
}
export const setShowArbolesMapeados = (value) => {
  return {
    type: types.mapaShowArbolesMapeados,
    payload: value
  }
}
export const setArbolSeleccionado = (coords) => {
  return {
    type: types.mapaArbolSeleccionado,
    payload: coords
  }
}
export const setZonaSeleccionada = (id) => {
  return {
    type: types.mapaZonaSeleccionada,
    payload: id
  }
}
export const startLoadingArboles = () => {
  return async (dispatch) => {
    // const arboles = await loadArboles();
    const response = await fetch(`${API_URL}/arboles-mapeados`);
    const arboles_data = await response.json();
    dispatch(setArboles(arboles_data));
  }
}
export const setBusqueda = (busqueda) => {
  console.log("testing", busqueda)
  return {
    type: types.mapaBusquedaArbol,
    payload: busqueda
  }
}
export const setFiltro = (filtros) => {
  return {
    type: types.mapaFiltrarArboles,
    payload: filtros
  }
}
export const resetFiltro = () => {
  return {
    type: types.mapaBorrarFiltros,
  }
}
export const setArboles = (arboles) => {
  return {
    type: types.mapaLoadArboles,
    payload: arboles
  }
}
export const hideDetailArbol = () => {
  return {
    type: types.mapaHideDetailArbol
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
    payload: usuarios
  }
}
export const setActiveMonitoreo = (monitoreo) => {
  return {
    type: types.mapaSetActiveMonitoreo,
    payload: monitoreo
  }
}
export const filterArboles = (arboles) => {
  return {
    type: types.mapaFilterArboles,
    payload: arboles
  }
}
export const setFilter = (value) => {
  return {
    type: types.mapaIsFiltered,
    payload: value
  }
}
