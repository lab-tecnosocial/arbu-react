import { types } from "../types/types";

// Initial state for mapped trees (árboles mapeados)
const initialMappedTreesState = {
  data: [],
  filteredData: [],
  isActive: false,
  isSearching: false,
  loading: false,
  error: null,
};

// Initial state for planted trees (árboles plantados)
const initialPlantedTreesState = {
  data: [],
  filteredData: [],
  isActive: true,
  selectedTree: null,
  isTreeSelected: false,
  isSearching: false,
  loading: false,
  error: null,
};

// Combined initial state
const initialState = {
  arbolesMapeados: initialMappedTreesState,
  arbolesPlantados: initialPlantedTreesState,
};

// Mapped trees reducer
const arbolesMapeadosReducer = (state = initialMappedTreesState, action) => {
  switch (action.type) {
    case types.FETCH_ARBOLES_MAPEADOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_ARBOLES_MAPEADOS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case types.FETCH_ARBOLES_MAPEADOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.SHOW_DATA_ARBOLES_MAPEADOS:
      return {
        ...state,
        isActive: action.payload,
      };

    case types.RESET_PLANTADOS_FILTRADOS:
      return {
        ...state,
        filteredData: [],
        isSearching: false,
      };

    case types.FILTRAR_ARBOLES_PLANTADOS: {
      const {
        search,
        selectedCategorias = "",
        selectedRiegos,
        selectedMonitoreos,
        selectedEspecies = [],
      } = action.payload;

      const texto = (search || "").toLowerCase().trim();
      const campo = selectedCategorias || "todos";

      const riego = selectedRiegos || "conysin";
      const filtroMonitoreo = selectedMonitoreos || { tipo: "todo", desde: null, hasta: null };

      const normalizeText = (value) => (value || "").toLowerCase().trim();

      const filtrados = state.data.filter((item) => {
        let coincideTexto = false;

        if (campo === "todos") {
          coincideTexto =
            texto === "" ||
            [item.nombreComun, item.nombreCientifico, item.nombrePropio].some((valor) =>
              normalizeText(valor).includes(texto)
            );
        } else if (campo === "nombreComun") {
          coincideTexto = normalizeText(item.nombreComun).includes(texto);
        } else if (campo === "nombreCientifico") {
          coincideTexto = normalizeText(item.nombreCientifico).includes(texto);
        } else if (campo === "nombrePropio") {
          coincideTexto = normalizeText(item.nombrePropio).includes(texto);
        }

        const tieneRiegos = item.riegos && Object.keys(item.riegos).length > 0;
        let coincideRiego = true;
        if (riego === "sinRiegos") coincideRiego = !tieneRiegos;
        else if (riego === "conRiegos") coincideRiego = tieneRiegos;

        const monitoreos = item.monitoreos || {};

        const hayMonitoreoEnRango = Object.values(monitoreos).some((mon) => {
          const ts = mon.timestamp?.seconds * 1000;
          const cumpleDesde = !filtroMonitoreo.desde || ts >= filtroMonitoreo.desde;
          const cumpleHasta = !filtroMonitoreo.hasta || ts <= filtroMonitoreo.hasta;
          return (
            ts &&
            cumpleDesde &&
            cumpleHasta
          );
        });

        const coincideMonitoreo =
          !filtroMonitoreo.tipo ||
          filtroMonitoreo.tipo === "todo" ||
          filtroMonitoreo.tipo === "todos" ||
          hayMonitoreoEnRango;

        const coincideEspecie =
          selectedEspecies.length === 0 ||
          selectedEspecies.some((especie) => normalizeText(especie) === normalizeText(item.nombreCientifico));

        return coincideTexto && coincideRiego && coincideMonitoreo && coincideEspecie;
      });

      return {
        ...state,
        filteredData: filtrados,
        isSearching: true,
      };
    }

    case types.mapaFiltrarArboles: {
      const {
        busqueda,
        camposSeleccionados,
        riegosSeleccionados,
        monitoreoFiltro,
        especiesSeleccionadas,
      } = action.payload;

      const texto = busqueda.toLowerCase();

      const filteredData = state.data.filter((item) => {
        const matchesText =
          texto === "" ||
          camposSeleccionados.some((campo) =>
            item[campo]?.toLowerCase().includes(texto)
          );

        const hasWatering = item.riegos && Object.keys(item.riegos).length > 0;
        const wateringType = hasWatering ? "con" : "sin";
        const matchesWatering =
          riegosSeleccionados.length === 0 ||
          riegosSeleccionados.includes(wateringType);

        const monitoring = item.monitoreos || {};
        const hasMonitoringInRange = Object.values(monitoring).some((mon) => {
          const timestamp = mon.timestamp?.seconds * 1000;
          return (
            timestamp &&
            (!monitoreoFiltro.desde || timestamp >= monitoreoFiltro.desde) &&
            (!monitoreoFiltro.hasta || timestamp <= monitoreoFiltro.hasta)
          );
        });

        const matchesMonitoring =
          monitoreoFiltro.tipo === "todo" || hasMonitoringInRange;

        const matchesSpecies =
          especiesSeleccionadas.length === 0 ||
          especiesSeleccionadas.includes(item.nombreCientifico);

        return matchesText && matchesSpecies && matchesWatering && matchesMonitoring;
      });

      console.log("filteredData", filteredData);

      return {
        ...state,
        filteredData,
      };
    }

    default:
      return state;
  }
};

// Planteb d trees reducer
const arbolesPlantadosReducer = (state = initialPlantedTreesState, action) => {
  switch (action.type) {
    // case types.SET_ACTIVE_ARBOL_PLANTADO:
    //   return {
    //     ...state,
    //     isTreeSelected: action.payload,
    //   };

    case types.SETLECT_ARBOL_PLANTADO:
      return {
        ...state,
        selectedTree: action.payload,
      };

    case types.FETCH_ARBOLES_PLANTADOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_ARBOLES_PLANTADOS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case types.FETCH_ARBOLES_PLANTADOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.SHOW_DATA_ARBOLES_PLANTADOS:
      return {
        ...state,
        isActive: action.payload,
      };

    case types.RESET_PLANTADOS_FILTRADOS:
      return {
        ...state,
        filteredData: [],
        isSearching: false,
      };

    case types.START_BUSQUEDA:
      return {
        ...state,
        isSearching: action.payload,
      };

    case types.FILTRAR_ARBOLES_PLANTADOS:
      const {
        search,
        selectedCategorias = "",
        selectedRiegos,
        selectedMonitoreos,
        selectedEspecies = [],
      } = action.payload;


      const texto = (search || "").toLowerCase().trim();
      const campo = selectedCategorias || "todos";

      const riego = selectedRiegos || "conysin";
      const filtroMonitoreo = selectedMonitoreos || { tipo: "todo", desde: null, hasta: null };

      const normalizeText = (value) => (value || "").toLowerCase().trim();

      const filtrados = state.data.filter((item) => {
        let coincideTexto = false;
        if (campo === "todos") {
          coincideTexto =
            texto === "" ||
            [item.nombreComun, item.nombreCientifico, item.nombrePropio].some((valor) =>
              normalizeText(valor).includes(texto)
            );
        } else if (campo === "nombreComun") {
          coincideTexto = normalizeText(item.nombreComun).includes(texto);
        } else if (campo === "nombreCientifico") {
          coincideTexto = normalizeText(item.nombreCientifico).includes(texto);
        } else if (campo === "nombrePropio") {
          coincideTexto = normalizeText(item.nombrePropio).includes(texto);
        }

        const tieneRiegos = item.riegos && Object.keys(item.riegos).length > 0;
        let coincideRiego = true;
        if (riego === "sinRiegos") coincideRiego = !tieneRiegos;
        else if (riego === "conRiegos") coincideRiego = tieneRiegos;

        const monitoreos = item.monitoreos || {};

        const hayMonitoreoEnRango = Object.values(monitoreos).some((mon) => {
          const ts = mon.timestamp?.seconds * 1000;
          const cumpleDesde = !filtroMonitoreo.desde || ts >= filtroMonitoreo.desde;
          const cumpleHasta = !filtroMonitoreo.hasta || ts <= filtroMonitoreo.hasta;
          return (
            ts &&
            cumpleDesde &&
            cumpleHasta
          );
        });

        const coincideMonitoreo =
          !filtroMonitoreo.tipo ||
          filtroMonitoreo.tipo === "todo" ||
          filtroMonitoreo.tipo === "todos" ||
          hayMonitoreoEnRango;

        const coincideEspecie =
          selectedEspecies.length === 0 ||
          selectedEspecies.some((especie) => normalizeText(especie) === normalizeText(item.nombreCientifico));

        return coincideTexto && coincideRiego && coincideMonitoreo && coincideEspecie;
      });

      return {
        ...state,
        filteredData: filtrados,
        isSearching: true,
      };

    default:
      return state;
  }
};

// Root reducer
const treeReducers = (state = initialState, action) => {
  return {
    arbolesMapeados: arbolesMapeadosReducer(state.arbolesMapeados, action),
    arbolesPlantados: arbolesPlantadosReducer(state.arbolesPlantados, action),
  };
};

export default treeReducers;
