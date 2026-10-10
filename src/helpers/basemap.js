// Basemap compartido por todos los mapas de la app.
//
// Desde agosto de 2026 CARTO exige API key en sus teselas raster: sin ella las
// teselas siguen devolviendo HTTP 200 pero con la marca de agua
// "API KEY REQUIRED". La key del tier gratuito no se puede restringir por
// dominio y viaja en las peticiones del navegador, así que es pública por
// diseño; no tiene sentido esconderla en un .env (Vite la inlinearía igual).
//
// El raster de CARTO está en retirada: cuando toque, la migración es a su
// basemap vectorial (MapLibre + maplibre-gl-leaflet) y este módulo es el
// único punto a cambiar.
const CARTO_API_KEY = "cb1_2i09_1_c1733caff4f6b0fa830d7eeb";

export const BASEMAP_URL = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;

export const BASEMAP_URL_DARK = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;

export const BASEMAP_URL_SATELLITE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export const VISTA_MAPA = {
  CALLEJERO: "callejero",
  SATELITE: "satelite",
};

/** El basemap que corresponde al tema activo. La key va en ambos. */
export const basemapPorTema = (tema) => (tema === "dark" ? BASEMAP_URL_DARK : BASEMAP_URL);

export const urlBasemap = (tema, vista = VISTA_MAPA.CALLEJERO) => {
  if (vista === VISTA_MAPA.SATELITE) return BASEMAP_URL_SATELLITE;
  return basemapPorTema(tema);
};

// El tier gratuito obliga a mantener visible la atribución de CARTO y OSM.
export const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const SATELLITE_ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community';

export const atribucionBasemap = (vista = VISTA_MAPA.CALLEJERO) =>
  vista === VISTA_MAPA.SATELITE ? SATELLITE_ATTRIBUTION : BASEMAP_ATTRIBUTION;
