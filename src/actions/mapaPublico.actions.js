import {
  fetchInscripcionesMapeo,
  fetchMappedTrees,
  fetchPlantedTrees,
} from "./arboles.actions";
import { fetchCampaniasPublicas } from "./campanias.actions";
import { startLoadingUsuarios } from "./mapaActions";

/**
 * Todo lo que el mapa público necesita, en un solo sitio: así el botón
 * "Reintentar" del overlay puede repetir exactamente la misma carga que hace
 * la página al montarse.
 *
 * `allSettled` y no `all`: que falle la carga de usuarios (que solo aporta el
 * nombre del mapeador en la ficha) no debe impedir que se pinten los árboles.
 */
export const cargarDatosMapaPublico = () => async (dispatch) => {
  await Promise.allSettled([
    dispatch(fetchPlantedTrees()),
    dispatch(fetchMappedTrees()),
    dispatch(fetchInscripcionesMapeo()),
    dispatch(fetchCampaniasPublicas()),
    dispatch(startLoadingUsuarios()),
  ]);
};
