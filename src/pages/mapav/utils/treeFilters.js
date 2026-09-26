import { toMillis } from "../../../helpers/fechaArbol";
import {
  CAMPO_TODOS,
  MONITOREO_HOY,
  MONITOREO_MES,
  MONITOREO_PERSONALIZADO,
  MONITOREO_SEMANA,
  MONITOREO_TODOS,
  RIEGO_CON_Y_SIN,
} from "../components/Sidebar/Utils/filterOptions";

/**
 * Filtrado de árboles del mapa público: una sola fuente de verdad.
 *
 * Antes esta lógica estaba duplicada en cuatro reducers, cada copia con un
 * subconjunto distinto de bugs. Aquí es una función pura, sin Redux, que se
 * puede probar sin montar un store.
 */

export const FILTER_STORAGE_KEY = "mapa_publico_filters_v1";
export const FILTER_TTL_MS = 24 * 60 * 60 * 1000;

export const EMPTY_FILTERS = {
  texto: "",
  campo: CAMPO_TODOS,
  riego: RIEGO_CON_Y_SIN,
  monitoreo: { tipo: MONITOREO_TODOS, desde: null, hasta: null },
  especies: [],
};

const sanitizeFilters = (filters = EMPTY_FILTERS) => ({
  texto: typeof filters.texto === "string" ? filters.texto : "",
  campo: filters.campo || CAMPO_TODOS,
  riego: filters.riego || RIEGO_CON_Y_SIN,
  monitoreo: {
    tipo: filters.monitoreo?.tipo || MONITOREO_TODOS,
    desde: filters.monitoreo?.desde ?? null,
    hasta: filters.monitoreo?.hasta ?? null,
  },
  especies: Array.isArray(filters.especies) ? filters.especies : [],
});

export const savePersistedFilters = (filters = EMPTY_FILTERS) => {
  if (typeof window === "undefined") return;

  try {
    const payload = {
      savedAt: Date.now(),
      filters: sanitizeFilters(filters),
    };
    window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("No se pudo guardar el filtro del mapa:", error);
  }
};

export const loadPersistedFilters = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.savedAt || !parsed.filters) return null;

    const age = Date.now() - Number(parsed.savedAt);
    if (age > FILTER_TTL_MS) {
      window.localStorage.removeItem(FILTER_STORAGE_KEY);
      return null;
    }

    return sanitizeFilters(parsed.filters);
  } catch (error) {
    console.warn("No se pudo leer el filtro persistido del mapa:", error);
    return null;
  }
};

export const clearPersistedFilters = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FILTER_STORAGE_KEY);
};

export const hasActiveFilters = (filters = EMPTY_FILTERS) =>
  Boolean(
    filters.texto?.trim() ||
      (filters.campo && filters.campo !== CAMPO_TODOS) ||
      (filters.riego && filters.riego !== RIEGO_CON_Y_SIN) ||
      (filters.monitoreo?.tipo && filters.monitoreo.tipo !== MONITOREO_TODOS) ||
      filters.especies?.length > 0
  );

/**
 * Traduce un tipo de rango a milisegundos [desde, hasta].
 * No muta ninguna instancia de Date: la versión anterior reutilizaba la misma
 * con setDate/setMonth y funcionaba por accidente.
 */
export const calcularRangoFechas = (tipo, ahora = Date.now()) => {
  const hasta = ahora;
  const dia = 24 * 60 * 60 * 1000;

  switch (tipo) {
    case MONITOREO_HOY: {
      const inicioDelDia = new Date(ahora);
      inicioDelDia.setHours(0, 0, 0, 0);
      return { desde: inicioDelDia.getTime(), hasta };
    }
    case MONITOREO_SEMANA:
      return { desde: hasta - 7 * dia, hasta };
    case MONITOREO_MES: {
      const haceUnMes = new Date(ahora);
      haceUnMes.setMonth(haceUnMes.getMonth() - 1);
      return { desde: haceUnMes.getTime(), hasta };
    }
    case MONITOREO_TODOS:
    default:
      return { desde: null, hasta: null };
  }
};

const coincideTexto = (arbol, texto, campo) => {
  if (!texto) return true;
  const busca = (valor) => (valor || "").toLowerCase().includes(texto);

  if (campo === CAMPO_TODOS || !campo) {
    return (
      busca(arbol.nombreComun) || busca(arbol.nombreCientifico) || busca(arbol.nombrePropio)
    );
  }
  return busca(arbol[campo]);
};

export const tieneRiegos = (arbol) => {
  const riegos = arbol?.riegos ?? arbol?.riego;
  if (!riegos) return false;
  if (Array.isArray(riegos)) return riegos.length > 0;
  if (typeof riegos === "object") return Object.keys(riegos).length > 0;
  return Boolean(riegos);
};

const coincideRiego = (arbol, riego) => {
  if (!riego || riego === RIEGO_CON_Y_SIN) return true;
  const regado = tieneRiegos(arbol);
  return riego === "conRiegos" ? regado : !regado;
};

const coincideMonitoreo = (arbol, monitoreo) => {
  if (!monitoreo || monitoreo.tipo === MONITOREO_TODOS || !monitoreo.tipo) return true;

  const { desde, hasta } =
    monitoreo.tipo === MONITOREO_PERSONALIZADO
      ? { desde: monitoreo.desde, hasta: monitoreo.hasta }
      : calcularRangoFechas(monitoreo.tipo);

  if (!desde && !hasta) return true;

  return Object.values(arbol.monitoreos ?? {}).some((mon) => {
    const ts = toMillis(mon?.timestamp);
    if (!ts) return false;
    if (desde && ts < desde) return false;
    if (hasta && ts > hasta) return false;
    return true;
  });
};

const coincideEspecies = (arbol, especies) => {
  if (!especies?.length) return true;
  return especies.includes(arbol.nombreCientifico);
};

export const applyTreeFilters = (arboles = [], filters = EMPTY_FILTERS) => {
  if (!hasActiveFilters(filters)) return arboles;

  const texto = (filters.texto || "").toLowerCase().trim();

  return arboles.filter(
    (arbol) =>
      coincideTexto(arbol, texto, filters.campo) &&
      coincideRiego(arbol, filters.riego) &&
      coincideMonitoreo(arbol, filters.monitoreo) &&
      coincideEspecies(arbol, filters.especies)
  );
};
