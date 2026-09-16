import {
  collection,
  deleteDoc,
  doc as docRef,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { CAMPANIAS_COLLECTION } from "./campaniaModel";
import { VEREDICTO } from "./revisiones";

/**
 * Escrituras del panel del concurso.
 *
 * Solo toca las subcolecciones de la campaña. `arbolesMapeados` es de la app
 * móvil; lo único que se refleja allí es el booleano `validado` que ya usaba
 * /mapeo-scout, y en una sola dirección (ver ESPEJAR_VALIDADO).
 */

const ESPEJAR_VALIDADO = true;

const revisionesRef = (campaniaId) =>
  collection(db, CAMPANIAS_COLLECTION, campaniaId, "revisiones");

const participantesRef = (campaniaId) =>
  collection(db, CAMPANIAS_COLLECTION, campaniaId, "participantes");

export const cargarRevisiones = async (campaniaId) => {
  const snapshot = await getDocs(revisionesRef(campaniaId));
  const indice = {};
  snapshot.forEach((d) => {
    indice[d.id] = { id: d.id, ...d.data() };
  });
  return indice;
};

export const cargarParticipantes = async (campaniaId) => {
  const snapshot = await getDocs(participantesRef(campaniaId));
  const indice = {};
  snapshot.forEach((d) => {
    indice[d.id] = { uid: d.id, ...d.data() };
  });
  return indice;
};

/**
 * Guarda el veredicto de un registro. El docId es determinista
 * (`arbolId__monitoreoKey`), así que revisar dos veces no duplica nada.
 */
export const guardarRevision = async (campaniaId, registro, { veredicto, motivo = null, nota = "" }, revisadoPor) => {
  if (!campaniaId || !registro?.clave || !revisadoPor) {
    return { success: false, error: "Parámetros inválidos" };
  }

  try {
    await setDoc(
      docRef(db, CAMPANIAS_COLLECTION, campaniaId, "revisiones", registro.clave),
      {
        arbolId: registro.arbolId,
        monitoreoKey: registro.monitoreoKey,
        uid: registro.uid ?? null,
        veredicto,
        motivo,
        nota,
        revisadoPor,
        revisadoEn: serverTimestamp(),
        auto: {
          veredicto: registro.auto?.veredicto ?? null,
          reglasIncumplidas: (registro.auto?.reglasIncumplidas ?? []).map((r) => r.clave),
          municipio: registro.municipio?.codigoIne ?? null,
          completitud: registro.completitud ?? null,
        },
      },
      { merge: true }
    );

    // Espejo unidireccional hacia /mapeo-scout. La dirección inversa NO existe:
    // cambiar `validado` desde esa pantalla no afecta al concurso.
    if (ESPEJAR_VALIDADO && registro.arbolId) {
      await updateDoc(docRef(db, "arbolesMapeados", registro.arbolId), {
        validado: veredicto === VEREDICTO.VALIDO,
      }).catch(() => { /* el árbol puede haber sido borrado; no bloquea la revisión */ });
    }

    return { success: true };
  } catch (error) {
    console.error("[revision] no se pudo guardar:", error);
    return { success: false, error: error.message };
  }
};

/** Vuelve un registro a "pendiente" borrando su revisión. */
export const borrarRevision = async (campaniaId, clave) => {
  try {
    await deleteDoc(docRef(db, CAMPANIAS_COLLECTION, campaniaId, "revisiones", clave));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/** Revisión por lotes, en tandas de 500 (límite de writeBatch). */
export const guardarRevisionesEnLote = async (campaniaId, registros, { veredicto, motivo = null }, revisadoPor) => {
  try {
    for (let i = 0; i < registros.length; i += 500) {
      const lote = writeBatch(db);
      registros.slice(i, i + 500).forEach((registro) => {
        lote.set(
          docRef(db, CAMPANIAS_COLLECTION, campaniaId, "revisiones", registro.clave),
          {
            arbolId: registro.arbolId,
            monitoreoKey: registro.monitoreoKey,
            uid: registro.uid ?? null,
            veredicto,
            motivo,
            nota: "",
            revisadoPor,
            revisadoEn: serverTimestamp(),
            porLote: true,
          },
          { merge: true }
        );
      });
      await lote.commit();
    }
    return { success: true, total: registros.length };
  } catch (error) {
    console.error("[revision en lote] falló:", error);
    return { success: false, error: error.message };
  }
};

/** Estado y datos de verificación manual de un participante. */
export const guardarParticipante = async (campaniaId, uid, datos, revisadoPor) => {
  try {
    await setDoc(
      docRef(db, CAMPANIAS_COLLECTION, campaniaId, "participantes", uid),
      { ...datos, revisadoPor, revisadoEn: serverTimestamp() },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.error("[participante] no se pudo guardar:", error);
    return { success: false, error: error.message };
  }
};

/** Congela el ranking. Los borradores se versionan; `final` es el publicado. */
export const guardarResultados = async (campaniaId, resultados, { final = false }, generadoPor) => {
  try {
    const id = final ? "final" : `borrador-${Date.now()}`;
    await setDoc(docRef(db, CAMPANIAS_COLLECTION, campaniaId, "resultados", id), {
      ...resultados,
      final,
      generadoPor,
      generadoEn: serverTimestamp(),
    });
    if (final) {
      await updateDoc(docRef(db, CAMPANIAS_COLLECTION, campaniaId), {
        resultadosPublicados: true,
      });
    }
    return { success: true, id };
  } catch (error) {
    console.error("[resultados] no se pudieron guardar:", error);
    return { success: false, error: error.message };
  }
};
