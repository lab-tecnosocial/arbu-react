import L from "leaflet";

// Iconos como singletons de módulo: se crean una vez, no uno por marcador.
export const customIcon = new L.Icon({
  iconUrl: "/location.svg",
  iconSize: new L.Point(40, 47),
});

/**
 * Icono del concurso de primavera. El asset viene del commit b411c11, donde
 * ya se había resuelto esto para el mapa antiguo (que dejó de estar enrutado,
 * así que nunca llegó a verse).
 */
export const jacarandaIcon = new L.Icon({
  iconUrl: "/jacaranda.png",
  iconSize: new L.Point(40, 47),
});
