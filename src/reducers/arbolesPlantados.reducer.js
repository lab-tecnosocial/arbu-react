import { types } from "../types/types";

const initialState = {
  arbolesPlantadosData: [],
  arbolesPlantadosFiltrados: [],

  isActiveArbolesPlantados: true,
  isActiveArbolPlantado: false,

  arbolPlantadoSelect: null,
  statusSearch: false,
  loading: false,
  error: null,
  scouts: null,
}

export const arbolesPlantadosReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ACTIVE_ARBOL_PLANTADO:
      return {
        ...state,
        isActiveArbolPlantado: action.payload
      }
    case types.SETLECT_ARBOL_PLANTADO:
      return {
        ...state,
        arbolPlantadoSelect: action.payload
      }
    case types.FETCH_ARBOLES_PLANTADOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case types.FETCH_ARBOLES_PLANTADOS_SUCCESS:
      return {
        ...state,
        loading: false,
        arbolesPlantadosData: action.payload
      }
    case types.FETCH_ARBOLES_PLANTADOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case types.SHOW_DATA_ARBOLES_PLANTADOS:
      return {
        ...state,
        isActiveArbolesPlantados: action.payload
      }
    case types.RESET_PLANTADOS_FILTRADOS:
      return {
        ...state,
        arbolesPlantadosFiltrados: [],
        statusSearch: false
      }
    case types.START_BUSQUEDA:
      return {
        ...state,
        statusSearch: action.payload
      }
    case types.FILTRAR_ARBOLES_PLANTADOS:
      const {
        search,
        selectedCategorias,
        selectedRiegos,
        selectedMonitoreos,
        // busqueda,
        // camposSeleccionados,
        // riegosSeleccionados,
        // monitoreoFiltro,
        // especiesSeleccionadas
      } = action.payload;


      const texto = (search || "").toLowerCase().trim();

      const campo = selectedCategorias || "todos";

      const riego = selectedRiegos || "conysin";
      // const especie = especiesSeleccionadas || "todas";

      console.log(selectedMonitoreos)
      const filtrados = state.arbolesPlantadosData.filter((item) => {
        let coincideTexto = false;
        if (campo === "todos") {
          coincideTexto =
            item.nombreComun?.toLowerCase().includes(texto) ||
            item.nombreCientifico?.toLowerCase().includes(texto) ||
            item.nombrePropio?.toLowerCase().includes(texto);
        } else if (campo === "nombreComun") {
          coincideTexto = item.nombreComun?.toLowerCase().includes(texto);
        } else if (campo === "nombreCientifico") {
          coincideTexto = item.nombreCientifico?.toLowerCase().includes(texto);
        } else if (campo === "nombrePropio") {
          coincideTexto = item.nombrePropio?.toLowerCase().includes(texto);
        }

        const tieneRiegos = item.riegos && Object.keys(item.riegos).length > 0;
        let coincideRiego = true;
        if (riego === "sinRiegos") coincideRiego = !tieneRiegos;
        else if (riego === "conRiegos") coincideRiego = tieneRiegos;

        const monitoreos = item.monitoreos || {};

        const hayMonitoreoEnRango = Object.values(monitoreos).some((mon) => {
          const ts = mon.timestamp?.seconds * 1000;
          return (
            ts &&
            (!selectedMonitoreos.desde || ts >= selectedMonitoreos.desde) &&
            (!selectedMonitoreos.hasta || ts <= selectedMonitoreos.hasta)
          );
        });

        const coincideMonitoreo =
          selectedMonitoreos.tipo === "todo" || hayMonitoreoEnRango;

        // const coincideEspecie =
        //   especiesSeleccionadas.length === 0 ||
        //   especiesSeleccionadas.includes(item.nombreCientifico);
        //
        return coincideTexto && coincideRiego && coincideMonitoreo;
      });

      return {
        ...state,
        arbolesPlantadosFiltrados: filtrados,
        statusSearch: true,
      }
    default:
      return state;
  }
}
