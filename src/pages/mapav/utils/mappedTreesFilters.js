const getMonitoreoTimestamp = (mon) => {
  if (!mon?.timestamp) return null;

  if (typeof mon.timestamp.toDate === "function") {
    return mon.timestamp.toDate().getTime();
  }

  if (mon.timestamp.seconds) {
    return mon.timestamp.seconds * 1000;
  }

  return null;
};

const hasMonitoreoInYear = (item, year) => {
  const monitoreos = item.monitoreos || {};

  return Object.values(monitoreos).some((mon) => {
    const timestamp = getMonitoreoTimestamp(mon);
    if (!timestamp) return false;

    return new Date(timestamp).getFullYear() === year;
  });
};

const getRegisteredMapeadorIds = (inscripciones = []) =>
  new Set(inscripciones.map((inscripcion) => inscripcion.id).filter(Boolean));

export const filterMappedTreesByActivity = (data, activity, inscripciones = []) => {
  if (activity === "scouts2025") {
    const registeredIds = getRegisteredMapeadorIds(inscripciones);

    return data.filter(
      (item) =>
        hasMonitoreoInYear(item, 2025) &&
        item.mapeadoPor &&
        registeredIds.has(item.mapeadoPor)
    );
  }

  return data;
};
