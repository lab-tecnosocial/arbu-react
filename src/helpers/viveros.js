import viverosGeo from "../assets/geo/viveros.json";

export const TIPO_VIVERO = "vivero";

export const esVivero = (entidad) => entidad?.tipo === TIPO_VIVERO;

const viveroDesdeFeature = (feature) => {
  const [longitud, latitud] = feature.geometry.coordinates;
  const { id, nombre, foto, contacto, especies = [] } = feature.properties;

  return {
    tipo: TIPO_VIVERO,
    id,
    nombre,
    foto,
    contacto,
    especies,
    latitud,
    longitud,
  };
};

export const loadViveros = (geojson = viverosGeo) =>
  (geojson?.features ?? []).map(viveroDesdeFeature);
