import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const actualizarNombreMapeado = async (id, nombreComun, nombreCientifico) => {
    await updateDoc(doc(db, "arbolesMapeados", id), { nombreComun, nombreCientifico });
}
