/**
 * La forma que las apps móviles dan por supuesta.
 *
 * ## Por qué existe este archivo
 *
 * El 21/09/2026 la app de Android empezó a crashear al abrir: 121 crashes en
 * 13 personas, un `NullPointerException` en el listener de Firestore del mapa
 * (`MapaFragment.onEvent`). La causa fue esto:
 *
 *   - Las apps **nunca omiten un campo**. Cuando algo está vacío escriben `""`
 *     o `0`, y además guardan el id del documento DENTRO del documento (`id`).
 *   - La web hacía lo contrario, a propósito: `documentoNuevo()` saltaba todo
 *     valor vacío para no ensuciar el documento.
 *   - La app lee con `doc.get("campo").toString()`. Un campo ausente devuelve
 *     `null`, y el `.toString()` revienta. Como el fallo ocurre dentro del
 *     listener de la colección, **un solo documento incompleto deja sin mapa a
 *     todo el mundo**, no solo a quien abre ese árbol.
 *
 * La lección, que vale para cualquier cosa que esta web escriba en las
 * colecciones de las apps: **un documento escrito por la web tiene que ser
 * indistinguible de uno escrito por la app**. Los campos de más (`registradoDesde`
 * y compañía) son inofensivos porque la app los ignora; los campos de menos son
 * un crash en producción que no se puede arreglar desde aquí.
 *
 * ## Qué se rellena y qué no
 *
 * Solo lo que las apps escriben SIEMPRE, verificado contra los 3.221 documentos
 * que no venían de la web: `id`, `proyecto`, `nombrePropio`,
 * `lugarDePlantacion`, `altura` y `diametroAlturaPecho`.
 *
 * Las claves de foto NO se rellenan: la propia app las omite cuando no hay foto
 * (hay documentos suyos con solo `fotoArbolCompleto`), así que sabe convivir
 * con su ausencia.
 *
 * El `0` de `altura` y `diametroAlturaPecho` no inventa una medida: ningún árbol
 * mide 0, y la web ya lo trata como "sin dato" en todas partes porque lo lee con
 * `valor && ...` o `valor || null`. Es el precio de que la app no distinga entre
 * "sin medir" y "ausente".
 */

/** El campo donde las apps repiten el id del documento. */
export const CAMPO_ID = "id";

/**
 * Valores neutros por colección: lo que la app escribiría si el formulario se
 * dejara en blanco.
 */
export const RELLENO_APPS = {
  /**
   * Falta `arbolesPlantados`, la colección de las adopciones de iOS: la web
   * todavía no escribe ahí (`TIPOS_APORTE` solo implementa el mapeo). Al añadir
   * ese tipo hay que declarar aquí su relleno ANTES de la primera escritura,
   * mirando qué campos escribe siempre la app de iOS —no los de Android, que
   * son otros—. Si no, se repite el 21/09/2026 con la otra app.
   */
  arbolesMapeados: {
    arbol: {
      proyecto: "",
      nombrePropio: "",
      lugarDePlantacion: "",
    },
    monitoreo: {
      altura: 0,
      diametroAlturaPecho: 0,
    },
  },
};

const rellenoDe = (coleccion) => RELLENO_APPS[coleccion] ?? { arbol: {}, monitoreo: {} };

const falta = (objeto, campo) => !objeto || !Object.hasOwn(objeto, campo);

/**
 * Completa un documento con los campos que la app da por seguros.
 *
 * No pisa nada: un `""` o un `0` que ya estaban se respetan, igual que un
 * `false`. Devuelve una copia; el documento original no se toca.
 *
 * @param {string} coleccion nombre de la colección de destino
 * @param {object} documento documento tal y como lo arma la web
 * @param {string} arbolId id con el que se va a guardar (obligatorio: es el
 *   valor del campo `id`, y omitirlo es justo el bug que este archivo evita)
 */
export const completarParaApps = (coleccion, documento, arbolId) => {
  if (!arbolId) {
    throw new Error(
      `completarParaApps: falta el id del documento de ${coleccion}. ` +
        "Reserva el id antes de escribir (nuevaIdentidadAporte)."
    );
  }

  const { arbol, monitoreo } = rellenoDe(coleccion);
  const completo = { [CAMPO_ID]: arbolId, ...documento };

  for (const [campo, neutro] of Object.entries(arbol)) {
    if (falta(completo, campo)) completo[campo] = neutro;
  }

  if (completo.monitoreos) {
    completo.monitoreos = Object.fromEntries(
      Object.entries(completo.monitoreos).map(([clave, datos]) => {
        const completado = { ...datos };
        for (const [campo, neutro] of Object.entries(monitoreo)) {
          if (falta(completado, campo)) completado[campo] = neutro;
        }
        return [clave, completado];
      })
    );
  }

  return completo;
};

/**
 * Qué le falta a un documento YA guardado para ser indistinguible de uno de la
 * app. Devuelve rutas de Firestore listas para un `updateDoc`, con su valor.
 *
 * Es lo que usa `scripts/reparar-esquema-app.mjs` para auditar y reparar lo que
 * se escribió antes de que existiera este archivo.
 *
 * @returns {Record<string, any>} vacío si el documento ya está completo
 */
export const huecosParaApps = (coleccion, documento, arbolId) => {
  const { arbol, monitoreo } = rellenoDe(coleccion);
  const huecos = {};

  if (falta(documento, CAMPO_ID)) huecos[CAMPO_ID] = arbolId;

  for (const [campo, neutro] of Object.entries(arbol)) {
    if (falta(documento, campo)) huecos[campo] = neutro;
  }

  for (const [clave, datos] of Object.entries(documento?.monitoreos ?? {})) {
    for (const [campo, neutro] of Object.entries(monitoreo)) {
      if (falta(datos, campo)) huecos[`monitoreos.${clave}.${campo}`] = neutro;
    }
  }

  return huecos;
};
