import { types } from "../types/types";
const initialState = {
  arboles: [],
  arbolesMapeados: [],
  arbolesFiltrados: [],
  showArbolesPlantados: true,
  showArbolesMapeados: false,
  arbolSeleccionado: null,
  zonaSeleccionada: null,
  busqueda: "",
  active: null,
  usuarios: [],
  monitoreo: null,
  usuariosMap: null,
  filtro: [],
  filtroAplied: false,

  // Modal
  modalState: "CLOSE",
  panelState: "CLOSE",

  selectedTree: {},

  index: null,

  selectedCoords: null,
  zoom: 15,
  duration: 1.5,
}

export const mapaReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SELECTED_COORDS:
      return {
        ...state,
        selectedCoords: action.payload.coords,
        zoom: action.payload.zoom,
        duration: action.payload.duration
      }
    // Modal
    case types.SET_MODAL_STATE:
      return {
        ...state,
        // NOTE: Analize whether a modalState and selectedTree should be in a separate reducer
        modalState: action.payload,
      }
    case types.SET_PANEL_STATE:
      return {
        ...state,
        panelState: action.payload
      }
    case types.SET_SELECTED_TREE:
      return {
        ...state,
        selectedTree: action.payload.selectedTree,
        index: action.payload.index
      }
    case types.mapaArbolSeleccionado:
      return {
        ...state,
        arbolSeleccionado: action.payload
      }
    case types.mapaZonaSeleccionada:
      return {
        ...state,
        zonaSeleccionada: action.payload
      }
    case types.mapaShowArbolesPlantados:
      return {
        ...state,
        showArbolesPlantados: action.payload
      }
    case types.mapaShowArbolesMapeados:
      return {
        ...state,
        showArbolesMapeados: action.payload
      }
    case types.mapaActiveArbol:
      return {
        ...state,
        active: { ...action.payload }
      }
    case types.mapaLoadArboles:
      return {
        ...state,
        arboles: [...action.payload],
        // arbolesFiltrados: [...action.payload]
      }
    case types.mapaFiltrarArboles:
      const {
        busqueda,
        camposSeleccionados,
        riegosSeleccionados,
        monitoreoFiltro,
        especiesSeleccionadas
      } = action.payload;

      const texto = busqueda.toLowerCase();

      const filtrados = state.arboles.filter((item) => {
        const coincideTexto = texto === "" || camposSeleccionados.some((campo) =>
          item[campo]?.toLowerCase().includes(texto)
        );
        const tieneRiegos = item.riegos && Object.keys(item.riegos).length > 0;
        const tipoRiego = tieneRiegos ? "con" : "sin";
        const coincideRiego = riegosSeleccionados.length === 0 || riegosSeleccionados.includes(tipoRiego);

        const monitoreos = item.monitoreos || {};
        const hayMonitoreoEnRango = Object.values(monitoreos).some((mon) => {
          const ts = mon.timestamp?.seconds * 1000;
          return (
            ts &&
            (!monitoreoFiltro.desde || ts >= monitoreoFiltro.desde) &&
            (!monitoreoFiltro.hasta || ts <= monitoreoFiltro.hasta)
          );
        });

        const coincideMonitoreo =
          monitoreoFiltro.tipo === "todo" || hayMonitoreoEnRango;

        const coincideEspecie =
          especiesSeleccionadas.length === 0 ||
          especiesSeleccionadas.includes(item.nombreCientifico);

        return coincideTexto && coincideEspecie && coincideRiego && coincideMonitoreo;
      });

      return {
        ...state,
        arbolesFiltrados: filtrados
      }
    case types.mapaBorrarFiltros:
      return {
        ...state,
        arbolesFiltrados: []
      }
    case types.mapaBusquedaArbol:
      return {
        ...state,
        busqueda: action.payload
      }
    case types.mapaLoadArbolesMapeados:
      return {
        ...state,
        arbolesMapeados:[...action.payload]
      }
    case types.mapaHideDetailArbol:
      return {
        ...state,
        active: null,
        monitoreo: null
      }
    case types.mapaLoadUsuarios:
      let result = [...action.payload].reduce(function(map, obj) {
        map[obj.id] = obj;
        return map;
      }, {});
      return {
        ...state,
        usuarios: [...action.payload],
        usuariosMap: result
      }
    case types.mapaAddUsuarios: {
      // Fusión, no reemplazo: los usuarios llegan de a poco, según qué ficha
      // se abra. `usuariosMap` es el contrato que leen la ficha y el ranking.
      const agregados = action.payload.reduce(
        (map, usuario) => ({ ...map, [usuario.id]: usuario }),
        { ...(state.usuariosMap ?? {}) }
      );
      return {
        ...state,
        usuarios: Object.values(agregados),
        usuariosMap: agregados
      }
    }
    case types.mapaSetActiveMonitoreo:
      return {
        ...state,
        monitoreo: action.payload
      }
    case types.mapaFilterArboles:
      return {
        ...state,
        filtro: [...action.payload]
      }
    case types.mapaIsFiltered:
      return {
        ...state,
        filtroAplied: action.payload
      }
    case types.tablaUpdateNombreMapeado:
      return {
        ...state,
        arbolesMapeados: state.arbolesMapeados.map((mapeado) =>
        mapeado.id === action.payload.id
            ? { ...mapeado, nombreComun: action.payload.nombreComun, nombreCientifico: action.payload.nombreCientifico }
            : mapeado
        ),
      };
    default:
      return state;
  }
}
