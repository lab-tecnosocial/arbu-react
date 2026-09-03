import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore"

export const loadArboles = async () => {
  const arbolesCol = collection(db, 'arbolesPlantados');
  const snapshot = await getDocs(arbolesCol);
  const lista = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return lista;
}
