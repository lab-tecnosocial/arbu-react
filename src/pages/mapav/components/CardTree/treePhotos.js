const MAPPED_PHOTO_FIELDS = [
  { key: "fotoArbolCompleto", label: "Árbol completo" },
  { key: "fotoRaiz", label: "Raíz" },
  { key: "fotoCorteza", label: "Corteza" },
  { key: "fotoHoja", label: "Hoja" },
  { key: "fotoFlor", label: "Flor" },
  { key: "fotoFruto", label: "Fruto" },
];

export const MAPPED_PARTS_UI = [
  { key: "fotoRaiz", label: "Raíz o base" },
  { key: "fotoCorteza", label: "Corteza" },
  { key: "fotoHoja", label: "Hoja" },
  { key: "fotoFlor", label: "Flor" },
];

export function formatMonitoreoDateLong(timestamp, locale = "es-BO") {
  if (!timestamp || typeof timestamp.seconds !== "number") {
    return "";
  }

  const date =
    timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1e6;

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getMappedTreePhotos(monitoreo) {
  if (!monitoreo) return [];

  return MAPPED_PHOTO_FIELDS.filter(({ key }) => monitoreo[key]).map(
    ({ key, label }) => ({
      src: monitoreo[key],
      label,
      key,
    })
  );
}

export function getPlantedTreePhotos(monitoreos) {
  return monitoreos
    .filter((m) => m.fotografia)
    .map((m, index) => ({
      src: m.fotografia,
      label: `Monitoreado el ${formatMonitoreoDateLong(m.timestamp)}`,
      key: m.timestamp?.seconds ?? index,
    }));
}

export function getTreePhotos(isMapped, monitoreos) {
  if (!monitoreos.length) return [];
  if (isMapped) return getMappedTreePhotos(monitoreos[0]);
  return getPlantedTreePhotos(monitoreos);
}
