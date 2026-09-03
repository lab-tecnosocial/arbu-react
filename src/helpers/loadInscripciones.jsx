import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const loadInscripciones = async () => {
  const inscripcionesSnapshot = await getDocs(collection(db, "inscripcionesMapeo"));
  let inscripcionesArray = [];
  inscripcionesSnapshot.forEach((element) => {
    inscripcionesArray.push(element.data());
  });
  return inscripcionesArray;
}

export const actualizarSolicitud = async (id, data) => {
  await updateDoc(doc(db, "inscripcionesMapeo", id), data);
}

export const eliminarSolicitud = async (id) => {
  await deleteDoc(doc(db, "inscripcionesMapeo", id));
}
