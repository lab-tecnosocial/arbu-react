import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import municipiosGeo from "../../assets/geo/municipiosMetropolitanosCbba.json";

/**
 * Límites de los 7 municipios del área metropolitana de Cochabamba.
 *
 * El GeoJSON vive en `src/assets/` (no en `public/`) a propósito: así pasa por
 * Rollup, se hashea y se comprime, y no entra en el precache de la PWA.
 * Se regenera con la receta documentada en el README.
 */

const slugify = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

/** Bounding box [minLon, minLat, maxLon, maxLat] de un feature. */
const bboxDe = (feature) => {
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;

  const recorrer = (coords) => {
    if (typeof coords[0] === "number") {
      const [lon, lat] = coords;
      if (lon < minLon) minLon = lon;
      if (lat < minLat) minLat = lat;
      if (lon > maxLon) maxLon = lon;
      if (lat > maxLat) maxLat = lat;
      return;
    }
    coords.forEach(recorrer);
  };

  recorrer(feature.geometry.coordinates);
  return [minLon, minLat, maxLon, maxLat];
};

// Se calcula una sola vez al cargar el módulo: el pre-filtro por bbox descarta
// la mayoría de los polígonos sin llamar a turf, y esto corre sobre miles de árboles.
const MUNICIPIOS = municipiosGeo.features.map((feature) => ({
  feature,
  bbox: bboxDe(feature),
  nombre: feature.properties.nombre,
  codigoIne: feature.properties.codigoIne,
  slug: slugify(feature.properties.nombre),
}));

export const MUNICIPIOS_METROPOLITANOS_CBBA = MUNICIPIOS.map(({ nombre, codigoIne, slug }) => ({
  nombre,
  codigoIne,
  slug,
}));

export const CODIGOS_METROPOLITANOS_CBBA = MUNICIPIOS_METROPOLITANOS_CBBA.map((m) => m.codigoIne);

const cache = new Map();

/**
 * Municipio que contiene una coordenada.
 *
 * ⚠️ Recibe (lat, lon) — el orden de `arbol.latitud, arbol.longitud`, que es
 * como está en todo el repo. El swap a [lon, lat] que exige GeoJSON ocurre
 * dentro. Es el error clásico con turf y ya hay una versión mal hecha en el
 * repo; no replicarla.
 *
 * @returns {{nombre: string, codigoIne: string, slug: string} | null}
 */
export const municipioDeCoordenada = (lat, lon) => {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  if (lat === 0 && lon === 0) return null;

  if (import.meta.env?.DEV && lat < -65 && lat > -68 && lon < -16 && lon > -19) {
    console.warn(
      `[municipios] (${lat}, ${lon}) parece (lon, lat) invertido. La firma es municipioDeCoordenada(lat, lon).`
    );
  }

  const clave = `${lat.toFixed(6)},${lon.toFixed(6)}`;
  if (cache.has(clave)) return cache.get(clave);

  const punto = point([lon, lat]);
  let resultado = null;

  for (const municipio of MUNICIPIOS) {
    const [minLon, minLat, maxLon, maxLat] = municipio.bbox;
    if (lon < minLon || lon > maxLon || lat < minLat || lat > maxLat) continue;

    // Se pasa el feature entero, no `geometry.coordinates`: así soporta
    // Polygon y MultiPolygon sin ramas extra.
    if (booleanPointInPolygon(punto, municipio.feature)) {
      resultado = {
        nombre: municipio.nombre,
        codigoIne: municipio.codigoIne,
        slug: municipio.slug,
      };
      break;
    }
  }

  cache.set(clave, resultado);
  return resultado;
};

/** El FeatureCollection, para pintarlo como capa en el mapa. */
export const exportarGeoJsonMunicipios = () => municipiosGeo;
