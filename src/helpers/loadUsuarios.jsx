import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore"

export const loadUsuarios = async () => {
  const usuariosCol = collection(db, 'usuarios_public');
  const snapshot = await getDocs(usuariosCol);
  // Sin el id del documento, getFullNameUser() de CardTree no encuentra a nadie.
  const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return lista;
};
