import { loadArboles } from "../helpers/loadArboles"
import { loadArbolesMapeados } from "../helpers/loadArbolesMapeados"
import { loadUsuarios, loadUsuariosPorIds } from "../helpers/loadUsuarios"
import { types } from "../types/types"

export const setPanelState = (panelState) => {
  return {
    type: types.SET_PANEL_STATE,
    payload: panelState,
  }
}

export const setModalState = (modalState) => {
  return {
    type: types.SET_MODAL_STATE,
    payload: modalState,
  }
}

export const setSelectedTree = (index, selectedTree) => {
  return {
    type: types.SET_SELECTED_TREE,
    payload: {
      index,
      selectedTree
    }
  }
}

export const setSelectedCoords = (coords = [-17.3917, -66.1448], zoom = 16, duration = 1.5) => ({
  type: types.SET_SELECTED_COORDS,
  payload: {
    coords,
    zoom,
    duration
  }
})

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
export const setBusqueda = (busqueda) => {
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
export const startLoadingArbolesMapeados = () => {
  return async (dispatch) => {
    const arboles = await loadArbolesMapeados();
    dispatch(setArbolesMapeados(arboles)); 
  }
}
export const setArbolesMapeados = (arboles) => {
  return {
    type: types.mapaLoadArbolesMapeados,
    payload:arboles
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
/**
 * Se asegura de tener en el store los usuarios de esos ids, pidiendo solo los
 * que falten. Lo llama la ficha del árbol al abrirse: ahí es donde de verdad
 * hace falta un nombre.
 */
export const asegurarUsuarios = (ids) => {
  return async (dispatch, getState) => {
    const { usuariosMap } = getState().mapa;
    const faltan = [...new Set(ids.filter(Boolean))].filter((id) => !usuariosMap?.[id]);
    if (faltan.length === 0) return;

    try {
      dispatch(addUsuarios(await loadUsuariosPorIds(faltan)));
    } catch (error) {
      console.error("[usuarios] no se pudieron cargar:", error);
    }
  };
};

export const addUsuarios = (usuarios) => {
  return {
    type: types.mapaAddUsuarios,
    payload: usuarios
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
