import {
  addDoc,
  collection,
  doc as docRef,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { CAMPANIAS_COLLECTION } from "./campaniaModel";
import { ORIGEN } from "./origenArbol";

/**
 * Corrección manual de un registro desde el panel del concurso.
 *
 * Un registro no existe como documento: es el par (árbol, monitoreo). Editarlo
 * es, inevitablemente, escribir en la colección de la app móvil de la que
 * salió: `arbolesMapeados` si se mapeó desde Android, `arbolesPlantados` si se
 * adoptó desde iOS. De ahí las dos reglas que la pantalla tiene que dejar
 * claras:
 *
 *  - Los campos del ÁRBOL (nombres, lugar) valen para TODOS sus monitoreos y se
 *    ven también en el mapa público. Los del MONITOREO solo tocan ese registro.
 *  - El dato que escribió la persona se pierde al sobrescribirlo. Por eso cada
 *    corrección deja copia en `proyectos/{campaniaId}/correcciones`: con estos
 *    datos se decide un premio y hay que poder responder "¿quién cambió esto y
 *    qué decía antes?".
 *
 * Lo derivado (veredicto automático, completitud, municipio) NO se guarda ni se
 * corrige a mano: se recalcula solo en cuanto cambia el dato de origen.
 */

/** De qué colección se corrige cada registro. */
const COLECCION_POR_ORIGEN = {
  [ORIGEN.MAPEADO]: "arbolesMapeados",
  [ORIGEN.PLANTADO]: "arbolesPlantados",
};

/** Campos del documento del árbol: afectan a todos sus registros. */
export const CAMPOS_ARBOL = [
  "nombreComun",
  "nombreCientifico",
  "nombrePropio",
  "lugarDePlantacion",
];

/** Campos que viven dentro de `monitoreos.{key}`: afectan solo a este registro. */
export const CAMPOS_MONITOREO = ["altura", "diametroAlturaPecho"];

const esDeMonitoreo = (campo) => CAMPOS_MONITOREO.includes(campo);

/** Valor con el que comparar: texto vacío para los de árbol, null para las medidas. */
const valorActual = (registro, campo) =>
  esDeMonitoreo(campo) ? registro[campo] ?? null : registro[campo] ?? "";

/**
 * Qué cambió de verdad, con el valor anterior al lado.
 * Solo se escribe lo que cambió: un `updateDoc` con los ocho campos pisaría con
 * "" lo que otra pantalla acabara de arreglar.
 */
export const calcularCambios = (registro, valores) => {
  const cambios = {};

  for (const campo of [...CAMPOS_ARBOL, ...CAMPOS_MONITOREO]) {
    if (!(campo in valores)) continue;

    const antes = valorActual(registro, campo);
    const despues = valores[campo];
    if (!Object.is(antes, despues)) cambios[campo] = { antes, despues };
  }

  return cambios;
};

/**
 * Aplica la corrección y la deja anotada.
 *
 * @returns {Promise<{success: boolean, cambios?: object, sinCambios?: boolean,
 *   sinBitacora?: string, error?: string}>}
 *   `sinBitacora` = el dato se corrigió pero la copia de seguridad no se pudo
 *   escribir (reglas sin desplegar). Se avisa, no se oculta.
 */
export const guardarEdicionRegistro = async (campaniaId, registro, valores, editadoPor) => {
  if (!campaniaId || !registro?.arbolId || !registro?.monitoreoKey || !editadoPor) {
    return { success: false, error: "Parámetros inválidos" };
  }

  const cambios = calcularCambios(registro, valores);
  if (!Object.keys(cambios).length) return { success: true, sinCambios: true };

  const actualizacion = {};
  for (const [campo, { despues }] of Object.entries(cambios)) {
    const ruta = esDeMonitoreo(campo)
      ? `monitoreos.${registro.monitoreoKey}.${campo}`
      : campo;
    actualizacion[ruta] = despues;
  }

  // Sin `origen` el registro es de antes de que las campañas miraran las dos
  // colecciones, y esos son todos de mapeo.
  const coleccion = COLECCION_POR_ORIGEN[registro.origen ?? ORIGEN.MAPEADO];
  if (!coleccion) return { success: false, error: `Origen desconocido: ${registro.origen}` };

  try {
    await updateDoc(docRef(db, coleccion, registro.arbolId), actualizacion);
  } catch (error) {
    console.error("[corrección] no se pudo guardar:", error);
    return { success: false, error: error.message };
  }

  try {
    await addDoc(collection(db, CAMPANIAS_COLLECTION, campaniaId, "correcciones"), {
      clave: registro.clave,
      origen: registro.origen ?? ORIGEN.MAPEADO,
      arbolId: registro.arbolId,
      monitoreoKey: registro.monitoreoKey,
      uid: registro.uid ?? null,
      cambios,
      editadoPor,
      editadoEn: serverTimestamp(),
    });
  } catch (error) {
    console.error("[corrección] se guardó el dato pero no la bitácora:", error);
    return { success: true, cambios, sinBitacora: error.message };
  }

  return { success: true, cambios };
};
