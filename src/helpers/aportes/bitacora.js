import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

/**
 * Quién cambió qué y qué decía antes.
 *
 * Crear o corregir un aporte desde la web escribe en las colecciones de las
 * apps móviles, o sea sobre el dato que escribió una persona. Con estos datos
 * se deciden premios: hay que poder responder "¿quién tocó esto?". Por eso la
 * bitácora es de solo añadir —una que se pueda editar o borrar no sirve de
 * nada— y por eso un fallo al escribirla se AVISA en vez de ocultarse.
 *
 * El panel del concurso tiene la suya propia en `proyectos/{id}/correcciones`,
 * porque allí la corrección pertenece a una campaña. Esta es la global.
 */

export const BITACORA_COLLECTION = "bitacoraAportes";

export const ACCION = {
  CREAR: "crear",
  EDITAR: "editar",
  IMPORTAR: "importar",
};

/**
 * @returns {Promise<{success: boolean, error?: string}>} nunca lanza: el dato ya
 *   está guardado cuando esto se llama, y perder la bitácora no puede tumbar la
 *   operación, solo avisar.
 */
export const anotarEnBitacora = async (entrada) => {
  try {
    await addDoc(collection(db, BITACORA_COLLECTION), {
      ...entrada,
      editadoEn: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("[bitácora] se guardó el dato pero no la bitácora:", error);
    return { success: false, error: error.message };
  }
};
