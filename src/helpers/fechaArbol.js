/**
 * Fuente única de verdad para las fechas de Arbu.
 *
 * Antes, la "fecha de un árbol" se derivaba del primer `Object.keys(monitoreos)`
 * en seis sitios distintos. El orden de esas claves NO está garantizado (son
 * autoIds de Firestore), así que la fecha podía ser la de cualquier monitoreo.
 * Aquí se ordena por el timestamp real.
 */

/**
 * Normaliza cualquier representación de fecha que circula por el proyecto:
 * Timestamp de Firestore v9, `{seconds, nanoseconds}` de los datos crudos,
 * `Date`, milisegundos o string ISO.
 * @returns {Date|null}
 */
export const toDate = (valor) => {
  if (!valor) return null;

  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;

  if (typeof valor.toDate === "function") {
    const fecha = valor.toDate();
    return Number.isNaN(fecha.getTime()) ? null : fecha;
  }

  if (typeof valor.seconds === "number") {
    return new Date(valor.seconds * 1000);
  }

  if (typeof valor === "number") {
    return new Date(valor);
  }

  if (typeof valor === "string") {
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
  }

  return null;
};

/** @returns {number|null} milisegundos desde epoch */
export const toMillis = (valor) => {
  const fecha = toDate(valor);
  return fecha ? fecha.getTime() : null;
};

export const formatFecha = (valor) => {
  const fecha = toDate(valor);
  return fecha ? fecha.toLocaleDateString("es-BO") : "";
};

export const formatFechaHora = (valor) => {
  const fecha = toDate(valor);
  if (!fecha) return "";
  return `${fecha.toLocaleDateString("es-BO")} ${fecha.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

/**
 * Los monitoreos de un árbol como array, ordenados ascendentemente por su
 * timestamp real. Los que no tienen fecha resoluble van al final, conservando
 * su orden original: nunca ocupan la primera posición si hay alguno con fecha.
 * @returns {Array<{key: string, fecha: Date|null}>}
 */
export const getMonitoreosOrdenados = (arbol) => {
  const monitoreos = arbol?.monitoreos;
  if (!monitoreos || typeof monitoreos !== "object") return [];

  return Object.entries(monitoreos)
    .map(([key, monitoreo], orden) => ({
      ...monitoreo,
      key,
      orden,
      fecha: toDate(monitoreo?.timestamp),
    }))
    .sort((a, b) => {
      if (a.fecha && b.fecha) return a.fecha - b.fecha;
      if (a.fecha) return -1;
      if (b.fecha) return 1;
      return a.orden - b.orden;
    });
};

/** El monitoreo más antiguo del árbol. */
export const getPrimerMonitoreo = (arbol) => getMonitoreosOrdenados(arbol)[0] ?? null;

/**
 * El monitoreo más reciente del árbol.
 * Ojo: los monitoreos sin fecha quedan al final del array ordenado, así que el
 * último elemento no sirve. Se busca el último que SÍ tiene fecha y, solo si
 * ninguno la tiene, se cae al último del array.
 */
export const getUltimoMonitoreo = (arbol) => {
  const monitoreos = getMonitoreosOrdenados(arbol);
  if (!monitoreos.length) return null;

  for (let i = monitoreos.length - 1; i >= 0; i -= 1) {
    if (monitoreos[i].fecha) return monitoreos[i];
  }

  return monitoreos[monitoreos.length - 1];
};

/** Fecha canónica del árbol: la de su monitoreo más antiguo. */
export const getFechaArbol = (arbol) => getPrimerMonitoreo(arbol)?.fecha ?? null;

export const getFechaUltimoMonitoreo = (arbol) => getUltimoMonitoreo(arbol)?.fecha ?? null;

/**
 * Convierte "YYYY-MM-DD" (lo que devuelve un <input type="date">) a Date en
 * hora LOCAL, no UTC.
 *
 * `new Date("2026-09-30")` se parsea como medianoche UTC, que en Bolivia
 * (UTC-4) es el 29 a las 20:00. Eso recortaba 28 horas al final de cada
 * proyecto.
 *
 * @param {string} yyyyMmDd
 * @param {{finDeDia?: boolean}} opciones finDeDia ⇒ 23:59:59.999 local
 * @returns {Date|null}
 */
export const parseFechaLocal = (yyyyMmDd, { finDeDia = false } = {}) => {
  if (!yyyyMmDd) return null;

  if (yyyyMmDd instanceof Date) {
    const copia = new Date(yyyyMmDd);
    if (finDeDia) copia.setHours(23, 59, 59, 999);
    else copia.setHours(0, 0, 0, 0);
    return copia;
  }

  const [anio, mes, dia] = String(yyyyMmDd).slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return null;

  return finDeDia
    ? new Date(anio, mes - 1, dia, 23, 59, 59, 999)
    : new Date(anio, mes - 1, dia, 0, 0, 0, 0);
};

/** "YYYY-MM-DD" en hora local, para rellenar un <input type="date">. */
export const toInputDate = (valor) => {
  const fecha = toDate(valor);
  if (!fecha) return "";
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};
