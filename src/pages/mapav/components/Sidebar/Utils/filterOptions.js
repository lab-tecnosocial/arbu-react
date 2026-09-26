export const optionsArbol = [
  { value: "plantados", label: "Plantados" },
  { value: "mapeados", label: "Mapeados" },
];

export const CAMPO_TODOS = "todos";

export const optionsCategorias = [
  { value: CAMPO_TODOS, label: "Todos" },
  { value: "nombreComun", label: "Nombre común" },
  { value: "nombreCientifico", label: "Nombre científico" },
  { value: "nombrePropio", label: "Nombre propio" },
];

export const RIEGO_CON_Y_SIN = "conysin";

export const optionsRiegos = [
  { value: RIEGO_CON_Y_SIN, label: "Con y sin riegos" },
  { value: "conRiegos", label: "Con riegos" },
  { value: "sinRiegos", label: "Sin riegos" },
];

// Estas constantes existen para que el Sidebar y el filtro no vuelvan a
// desincronizarse por un literal mal escrito: antes el reducer comparaba
// contra "todo" mientras la opción valía "todos", y el rango de fechas
// contra "rango de fechas" mientras la opción valía "personalizado".
export const MONITOREO_TODOS = "todos";
export const MONITOREO_HOY = "hoy";
export const MONITOREO_SEMANA = "estaSemana";
export const MONITOREO_MES = "esteMes";
export const MONITOREO_PERSONALIZADO = "personalizado";

export const optionsMonitoreos = [
  { value: MONITOREO_TODOS, label: "Todos los monitoreos" },
  { value: MONITOREO_HOY, label: "Hoy" },
  { value: MONITOREO_SEMANA, label: "Esta semana" },
  { value: MONITOREO_MES, label: "Este mes" },
  { value: MONITOREO_PERSONALIZADO, label: "Buscar por rango de fecha" },
];
