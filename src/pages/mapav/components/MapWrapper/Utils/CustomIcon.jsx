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
 *
 * Va más grande y CUADRADO, a diferencia del pin verde, por cómo es el PNG:
 * es cuadrado (1254×1254) y el árbol ocupa solo la mitad central; el resto es
 * transparente. A 40×47 el árbol se dibujaba a unos 20 px —la mitad que el pin
 * verde— y encima se deformaba al forzarle una caja más alta que ancha.
 * Si se recorta el margen del PNG, hay que bajar este número en la misma
 * proporción.
 */
export const jacarandaIcon = new L.Icon({
  iconUrl: "/jacaranda.png",
  iconSize: new L.Point(72, 72),
});
