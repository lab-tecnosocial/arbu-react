const ESCUDO_FILE_BY_GRUPO = {
  aleman: "ALEMAN.svg",
  america: "AMERICA.svg",
  "anglo americano": "ANGLO_AMERICANO.svg",
  bolivia: "BOLIVIA.svg",
  bronwsea: "BRONWSEA.svg",
  ceibo: "CEIBO.svg",
  espana: "ESPAÑA.svg",
  fortaleza: "FORTALEZA.svg",
  impeesa: "IMPEESA.svg",
  incas: "INCAS.svg",
  intidrac: "INTIDRAC.svg",
  kairos: "KAIROS.svg",
  "la salle": "LA_SALLE.svg",
  loyola: "LOYOLA.svg",
  mafeking: "MAFEKING.svg",
  "murray dickson": "MURRAY_DICKSON.svg",
  panda: "PANDA.svg",
  primavera: "PRIMAVERA.svg",
  "saint andrews": "SAINT-ANDREWS.svg",
  "saint-andrews": "SAINT-ANDREWS.svg",
  semilla: "SEMILLA.svg",
  tiquipaya: "TIQUIPAYA.svg",
  tunari: "TUNARI.svg",
};

const normalizeGrupoKey = (grupo) =>
  grupo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const getInscripcionByMapeadoPor = (mapeadoPorId, inscripciones = []) => {
  if (!mapeadoPorId) return null;

  return (
    inscripciones.find((inscripcion) => inscripcion.id === mapeadoPorId) ?? null
  );
};

export const getEscudoSrcByGrupo = (grupo) => {
  if (!grupo) return null;

  const fileName = ESCUDO_FILE_BY_GRUPO[normalizeGrupoKey(grupo)];
  return fileName ? `/escudosgv/${fileName}` : null;
};

export const getScoutInfoByMapeadoPor = (mapeadoPorId, inscripciones = []) => {
  const inscripcion = getInscripcionByMapeadoPor(mapeadoPorId, inscripciones);
  if (!inscripcion) return null;

  return {
    ...inscripcion,
    escudoSrc: getEscudoSrcByGrupo(inscripcion.grupo),
  };
};
