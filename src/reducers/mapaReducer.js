import { types } from "../types/types";
const initialState = {
  arboles: [],
  arbolesFiltrados: [],
  busqueda: "",
  active: null,
  usuarios: [],
  monitoreo: null,
  usuariosMap: null,
  filtro: [],
  filtroAplied: false
}
export const mapaReducer = (state = initialState, action) => {
  switch (action.type) {
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
      const { busqueda, camposSeleccionados, riegosSeleccionados, monitoreoFiltro } = action.payload;
      const texto = busqueda.toLowerCase();

      const filtrados = state.arboles.filter((item) => {
        const coincideTexto = camposSeleccionados.some((campo) =>
          item[campo]?.toLowerCase().includes(texto)
        );
        const tieneRiegos = item.riegos && Object.keys(item.riegos).length > 0;
        const tipoRiego = tieneRiegos ? "con" : "sin";
        const coincideRiego = riegosSeleccionados.includes(tipoRiego);

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

        return coincideTexto && coincideRiego && coincideMonitoreo;
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
    default:
      return state;
  }
}
