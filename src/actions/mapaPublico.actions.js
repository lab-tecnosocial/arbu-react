import { fetchMappedTrees, fetchPlantedTrees } from "./arboles.actions";
import { fetchCampaniasPublicas } from "./campanias.actions";

/**
 * Lo que el mapa público necesita **al entrar**, y nada más: los árboles y las
 * campañas del sidebar.
 *
 * Lo demás se pide cuando hace falta, que es lo que evita el grueso de las
 * lecturas: los usuarios al abrir la ficha de un árbol (`asegurarUsuarios`) y
 * las inscripciones al encender la capa de mapeados
 * (`asegurarInscripcionesMapeo`). Pedirlos aquí costaba ~1.450 lecturas por
 * visita para, casi siempre, no usar ninguna.
 *
 * Al estar la carga en un solo sitio, el botón "Reintentar" del mapa repite
 * exactamente esto. `allSettled` y no `all`: que fallen las campañas no puede
 * impedir que se pinten los árboles.
 */
export const cargarDatosMapaPublico = ({ forzar = false } = {}) => async (dispatch) => {
  await Promise.allSettled([
    dispatch(fetchPlantedTrees({ forzar })),
    dispatch(fetchMappedTrees({ forzar })),
    dispatch(fetchCampaniasPublicas({ forzar })),
  ]);
};
