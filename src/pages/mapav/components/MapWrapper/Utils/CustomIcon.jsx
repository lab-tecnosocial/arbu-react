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

/**
 * Icono transparente para los árboles que no cumplen la especie de la campaña
 * (en el concurso de primavera, todo lo que no es jacarandá). El marcador sigue
 * existiendo pero no se ve ni se puede tocar: la clase `icono-oculto` lo deja
 * sin opacidad y sin eventos de puntero (ver MapWrapper.module.css).
 */
export const iconoOculto = new L.DivIcon({
  className: "icono-oculto",
  html: "",
  iconSize: new L.Point(0, 0),
});
