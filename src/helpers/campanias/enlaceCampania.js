import { slugify } from "./campaniaModel";

/**
 * El enlace que abre el mapa ya puesto en una actividad.
 *
 * Compartir "el mapa de la primavera" era, hasta ahora, compartir `/mapa` y
 * explicar de palabra que había que buscar la actividad en la barra lateral y
 * tocarla. Un enlace que llega por WhatsApp no lleva instrucciones adjuntas: o
 * abre lo que promete, o no lo abre nadie.
 *
 * El parámetro acepta el **slug** (`?actividad=concurso-primavera-2026-a1b2`),
 * que es lo que se genera al compartir, pero también el id del documento y el
 * slug sin el sufijo. Tres formas de nombrar lo mismo, porque un enlace
 * compartido se reenvía durante meses y a veces se teclea a mano: lo caro es
 * que un enlace viejo deje de abrir, no aceptar una forma de más.
 */

/** El nombre del parámetro, en español como el resto de la interfaz. */
export const PARAM_ACTIVIDAD = "actividad";

/** Lo que se pone en la URL para una campaña: su slug, que ya es único. */
export const parametroDeCampania = (campania) => campania?.slug ?? campania?.id ?? null;

/**
 * ¿Este valor de la URL nombra a esta campaña?
 *
 * El slug canónico lleva un sufijo con los primeros caracteres del id para no
 * chocar con otra campaña del mismo nombre; se acepta igual el slug sin él,
 * que es lo que escribe una persona a mano.
 */
const coincide = (campania, valor) => {
  const buscado = String(valor).trim().toLowerCase();
  if (!buscado || !campania) return false;

  return (
    String(campania.id).toLowerCase() === buscado ||
    String(campania.slug).toLowerCase() === buscado ||
    slugify(campania.nombre) === buscado
  );
};

/**
 * La campaña que nombra un parámetro de la URL, o `null` si ninguna.
 *
 * Devolver `null` es un caso normal, no un error: la campaña pudo borrarse, o
 * el enlace venir con una errata. El mapa se abre igual, solo que sin la
 * actividad puesta.
 */
export const buscarCampaniaPorParametro = (campanias = [], valor) => {
  if (!valor) return null;
  return campanias.find((campania) => coincide(campania, valor)) ?? null;
};

/**
 * El enlace absoluto a una actividad, para copiar y pegar.
 *
 * @param {object} campania
 * @param {string} [origen] normalmente `window.location.origin`
 */
export const enlaceDeCampania = (campania, origen = "") => {
  const parametro = parametroDeCampania(campania);
  if (!parametro) return `${origen}/mapa`;
  return `${origen}/mapa?${PARAM_ACTIVIDAD}=${encodeURIComponent(parametro)}`;
};
