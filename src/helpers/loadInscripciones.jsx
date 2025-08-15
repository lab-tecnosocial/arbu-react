import { db } from "../firebase/firebase-config";


export const loadInscripciones = async () => {
  const inscripcionesSnapshot = await db.collection("inscripcionesMapeo").get();
  let inscripcionesArray = [];
  await inscripcionesSnapshot.forEach((element)=>{
    inscripcionesArray.push(element.data());
  });
  return inscripcionesArray;
}

export const actualizarSolicitud = async (id, data) => {
  await db.collection("inscripcionesMapeo").doc(id).update(data);
}

export const eliminarSolicitud = async (id) => {
    await db.collection("inscripcionesMapeo").doc(id).delete();
}