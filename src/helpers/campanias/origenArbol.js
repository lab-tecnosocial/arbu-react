/**
 * De qué colección viene un árbol, y cómo se lee un documento de cada una con
 * el mismo vocabulario.
 *
 * Arbu tiene dos formas de registrar un árbol y cada app usa la suya:
 *  - **mapeo** (`arbolesMapeados`): la app de Android. Autoría en `mapeadoPor`,
 *    hasta cinco fotos por monitoreo (`fotoArbolCompleto`, `fotoFlor`, …).
 *  - **adopción** (`arbolesPlantados`): la app de iOS, que NO tiene pantalla de
 *    mapeo. Autoría en `plantadoPor` y una sola foto por monitoreo,
 *    `fotografia`.
 *
 * Mientras una campaña miró solo `arbolesMapeados`, todo lo registrado desde
 * iOS quedaba invisible en el mapa y fuera del concurso, aunque fuera un
 * jacarandá en flor mapeado dentro del plazo. Aquí se normaliza esa diferencia
 * en un solo sitio, para que el resto del código de campañas no tenga que
 * saber de qué colección salió cada árbol.
 */

export const ORIGEN = {
  MAPEADO: "mapeado",
  PLANTADO: "plantado",
};

/** Cómo se llama en la interfaz lo que hizo la persona. */
export const ETIQUETA_ORIGEN = {
  [ORIGEN.MAPEADO]: "Mapeo",
  [ORIGEN.PLANTADO]: "Adopción",
};

/** El uid de quien hizo el registro, venga de la colección que venga. */
export const autorDelRegistro = (arbol, monitoreo) =>
  monitoreo?.monitoreoRealizadoPor || arbol?.mapeadoPor || arbol?.plantadoPor || null;

/**
 * Un monitoreo con las claves de foto del mapeo.
 *
 * En una adopción la única foto se llama `fotografia` y es, por definición del
 * formulario, la del árbol completo. Traducirla aquí permite que la checklist
 * de completitud y las reglas de fotos de la campaña sigan escritas en un solo
 * vocabulario.
 */
export const monitoreoNormalizado = (monitoreo, origen) => {
  if (origen !== ORIGEN.PLANTADO) return monitoreo;
  if (!monitoreo?.fotografia || monitoreo.fotoArbolCompleto) return monitoreo;
  return { ...monitoreo, fotoArbolCompleto: monitoreo.fotografia };
};
