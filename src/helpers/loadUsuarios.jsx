import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore"

export const loadUsuarios = async () => {
  const usuariosCol = collection(db, 'usuarios_public');
  const snapshot = await getDocs(usuariosCol);
  const lista = snapshot.docs.map(doc => doc.data());
  return lista;
};
