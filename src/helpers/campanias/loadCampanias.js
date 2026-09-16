import {
  collection,
  doc as docRef,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { CAMPANIAS_COLLECTION, normalizarCampania, ordenarCampanias } from "./campaniaModel";

/**
 * Campañas visibles en el mapa público.
 *
 * El `where("publica","==",true)` no es una optimización: con las reglas de
 * Firestore, `allow list` se evalúa documento a documento y la query ENTERA se
 * rechaza si pudiera devolver uno no permitido. Un getDocs de la colección
 * completa sin sesión daría permission-denied, no un subconjunto.
 *
 * El orden se resuelve en cliente para no necesitar un índice compuesto: son
 * decenas de documentos.
 */
export const loadCampaniasPublicas = async () => {
  const snapshot = await getDocs(
    query(collection(db, CAMPANIAS_COLLECTION), where("publica", "==", true))
  );

  const campanias = snapshot.docs.map((d) => normalizarCampania({ id: d.id, ...d.data() }));
  return ordenarCampanias(campanias);
};

export const loadCampaniaPorId = async (id) => {
  if (!id) return null;
  const snapshot = await getDoc(docRef(db, CAMPANIAS_COLLECTION, id));
  if (!snapshot.exists()) return null;
  return normalizarCampania({ id: snapshot.id, ...snapshot.data() });
};
