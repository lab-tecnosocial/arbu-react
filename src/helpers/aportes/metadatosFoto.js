/**
 * Lo que la foto ya sabe: dónde y cuándo se tomó.
 *
 * Una foto de teléfono trae en su EXIF la coordenada del GPS y la hora del
 * disparo. Hasta ahora eso se tiraba a la basura y la persona volvía a teclear
 * a mano un dato que venía dentro del archivo —o peor, lo dejaba en blanco—.
 *
 * Tres decisiones que no son obvias:
 *
 *  - **Se lee del archivo ORIGINAL, antes de comprimir.** `comprimirImagen()`
 *    redibuja la foto en un `<canvas>`, y un canvas no conserva EXIF: lo que
 *    sube a Storage ya no tiene ni coordenada ni fecha. Si este lector se
 *    llamara sobre el blob comprimido, siempre devolvería vacío.
 *  - **La hora que interesa es la del reloj de pared del lugar de la toma.**
 *    EXIF guarda "2026:09:21 15:34:17" sin zona; exifr lo revive con
 *    `new Date(a, m, d, h, …)`, así que `getHours()` devuelve 15 en cualquier
 *    zona horaria del navegador. Es justo lo que quiere el resto del repo,
 *    que trabaja en hora local (ver `fechaArbol.js`).
 *  - **exifr se carga bajo demanda.** Son ~48 KB que solo hacen falta cuando
 *    alguien elige una foto: en el bundle principal solo castigarían a quien
 *    entra al mapa. El import dinámico lo deja en un chunk aparte.
 *
 * Es la variante `lite` a propósito: la `mini` no lee GPS ni HEIC —el formato
 * nativo del iPhone— y la `full` pesa el doble por formatos que aquí nadie usa.
 */

import { aNumero, aValorFecha } from "./validarAporte";

let exifrPromesa = null;

/** Una sola carga por sesión, aunque se suban seis fotos. */
const cargarExifr = () => {
  if (!exifrPromesa) exifrPromesa = import("exifr/dist/lite.esm.mjs");
  return exifrPromesa;
};

/**
 * Coordenadas que existen pero no dicen nada.
 * Un GPS que no llegó a fijar posición escribe ceros, y (0, 0) es un punto en
 * el Atlántico: aceptarlo mandaría el árbol al golfo de Guinea.
 */
const coordenadaUtil = (lat, lon) =>
  Number.isFinite(lat) &&
  Number.isFinite(lon) &&
  Math.abs(lat) <= 90 &&
  Math.abs(lon) <= 180 &&
  !(lat === 0 && lon === 0);

/**
 * Una cámara sin reloj en hora arranca en 1970 o en 1904. Esas fechas no son
 * un dato, son el valor por defecto del firmware.
 */
const ANIO_MINIMO = 1990;

const fechaUtil = (valor) => {
  const fecha = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;
  if (fecha.getFullYear() < ANIO_MINIMO) return null;
  return fecha;
};

/**
 * Metros aproximados entre dos puntos.
 *
 * Sirve para decidir si dos fotos del mismo árbol discrepan de verdad o solo
 * en el ruido del GPS. A esta escala la Tierra es plana y un grado de latitud
 * son 111 km; la longitud encoge con el coseno de la latitud.
 */
export const distanciaEnMetros = (a, b) => {
  const radianes = (grados) => (grados * Math.PI) / 180;
  const dLat = (b.latitud - a.latitud) * 111320;
  const dLon = (b.longitud - a.longitud) * 111320 * Math.cos(radianes(a.latitud));
  return Math.hypot(dLat, dLon);
};

/**
 * Lee dónde y cuándo se tomó una foto.
 *
 * Nunca lanza: una foto sin EXIF —WhatsApp y las redes lo borran al
 * comprimir—, un formato que exifr no entiende o un archivo corrupto valen
 * todos lo mismo, un aporte que se rellena a mano como antes.
 *
 * @param {File|Blob} archivo el archivo tal como lo eligió la persona
 * @returns {Promise<{coordenadas: {latitud: number, longitud: number}|null, fecha: Date|null}>}
 */
export const leerMetadatosFoto = async (archivo) => {
  const vacio = { coordenadas: null, fecha: null };
  if (!archivo) return vacio;

  try {
    const exifr = await cargarExifr();
    const salida = await exifr.parse(archivo, { tiff: true, exif: true, gps: true });
    if (!salida) return vacio;

    const lat = Number(salida.latitude);
    const lon = Number(salida.longitude);

    return {
      coordenadas: coordenadaUtil(lat, lon) ? { latitud: lat, longitud: lon } : null,
      // `CreateDate` es el respaldo de las cámaras que no escriben
      // `DateTimeOriginal`; `ModifyDate` no se usa porque cualquier editor lo
      // pisa con la fecha en que se retocó la foto.
      fecha: fechaUtil(salida.DateTimeOriginal ?? salida.CreateDate ?? null),
    };
  } catch (error) {
    console.warn("[aportes] no se pudieron leer los metadatos de la foto:", error);
    return vacio;
  }
};

/**
 * Cuántos metros de diferencia entre dos fotos del mismo árbol se consideran
 * la misma ubicación. Un GPS de teléfono bajo la copa de un árbol se equivoca
 * en 5-15 m sin que nadie haya hecho nada mal: por debajo de este umbral no
 * hay discrepancia que consultar, solo ruido.
 */
const UMBRAL_MISMO_PUNTO = 25;

/**
 * Qué hacer con lo que traía la foto, dado lo que ya hay en el formulario.
 *
 * La regla es una sola: **la foto rellena huecos, no corrige a la persona.**
 * Un dato escrito a mano o afinado en el mapa gana siempre al del archivo; si
 * discrepan, se ofrece el de la foto con un botón, no se aplica solo. Lo
 * contrario convertiría "subí otra foto" en "se me movió el árbol", que es
 * justo el tipo de cambio silencioso que nadie relaciona con su causa.
 *
 * @param {object} valores los del formulario, como texto
 * @param {{coordenadas: object|null, fecha: Date|null}} metadatos
 * @returns {{propuesta: object, aplicar: object, enConflicto: string[]}}
 *   `propuesta` es todo lo que la foto sabe en formato de formulario;
 *   `aplicar`, el subconjunto que no pisa nada; `enConflicto`, las etiquetas
 *   de lo que ya tenía otro valor.
 */
export const conciliarMetadatos = (valores, metadatos) => {
  const propuesta = {};
  const aplicar = {};
  const enConflicto = [];

  if (metadatos.coordenadas) {
    const { latitud, longitud } = metadatos.coordenadas;
    propuesta.latitud = latitud.toFixed(5);
    propuesta.longitud = longitud.toFixed(5);

    const actual = {
      latitud: aNumero(valores.latitud),
      longitud: aNumero(valores.longitud),
    };
    const hayPunto =
      actual.latitud !== null &&
      actual.longitud !== null &&
      !(actual.latitud === 0 && actual.longitud === 0);

    if (!hayPunto) {
      aplicar.latitud = propuesta.latitud;
      aplicar.longitud = propuesta.longitud;
    } else if (distanciaEnMetros(actual, metadatos.coordenadas) > UMBRAL_MISMO_PUNTO) {
      enConflicto.push("la ubicación");
    }
  }

  if (metadatos.fecha) {
    propuesta.timestamp = aValorFecha(metadatos.fecha);

    if (!String(valores.timestamp ?? "").trim()) aplicar.timestamp = propuesta.timestamp;
    else if (valores.timestamp !== propuesta.timestamp) enConflicto.push("la fecha");
  }

  return { propuesta, aplicar, enConflicto };
};
