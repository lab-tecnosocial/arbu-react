import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { anotarLecturas } from "./leerColeccion";

export const loadInscripciones = async () => {
  const inscripcionesSnapshot = await getDocs(collection(db, "inscripcionesMapeo"));
  let inscripcionesArray = [];
  inscripcionesSnapshot.forEach((element) => {
    // El id del documento ES el uid del mapeador: sin él se rompe el join con
    // arbolesMapeados.mapeadoPor y fallan updateDoc/deleteDoc de las solicitudes.
    inscripcionesArray.push({ id: element.id, ...element.data() });
  });
  anotarLecturas("servidor", "inscripcionesMapeo", inscripcionesArray.length);
  return inscripcionesArray;
}

export const actualizarSolicitud = async (id, data) => {
  await updateDoc(doc(db, "inscripcionesMapeo", id), data);
}

export const eliminarSolicitud = async (id) => {
  await deleteDoc(doc(db, "inscripcionesMapeo", id));
}

/**
 * Proyección pública de inscripcionesMapeo para el mapa abierto.
 *
 * Lista blanca EXPLÍCITA: el mapa solo necesita el grupo y la rama para pintar
 * el escudo scout en la ficha del árbol. El email, el nombre, el estado y el
 * campo `pagado` no salen de Arbu Pro. Si mañana se añade un campo sensible a
 * la colección, no se propaga solo.
 */
export const loadInscripcionesMapeoPublic = async () => {
  const inscripciones = await loadInscripciones();
  return inscripciones.map(({ id, grupo, rama }) => ({ id, grupo, rama }));
};
