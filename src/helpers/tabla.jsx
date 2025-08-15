import { db } from "../firebase/firebase-config";

export const actualizarNombreMapeado = async (id, nombreComun, nombreCientifico) => {
    await db.collection("arbolesMapeados").doc(id).update({ nombreComun, nombreCientifico});
}