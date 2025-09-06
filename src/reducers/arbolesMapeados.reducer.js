import { types } from "../types/types";

const initialState = {
  dataArbolesMapeados: [],
  isActiveArbolesMapeados: false,
  loading: false,
  error: null,
}

export const arbolesMapeadosReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ARBOLES_MAPEADOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case types.FETCH_ARBOLES_MAPEADOS_SUCCESS:
      return {
        ...state,
        loading: false,
        dataArbolesMapeados: action.payload
      }
    case types.FETCH_ARBOLES_MAPEADOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case types.SHOW_DATA_ARBOLES_MAPEADOS:
      return {
        ...state,
        isActiveArbolesMapeados: action.payload
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
        arbolesPFiltrados: filtrados
      }
    default:
      return state;
  }
}
