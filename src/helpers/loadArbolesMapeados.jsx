import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";

// Datos reales de Firestore, sin excepciones. Hubo una variante con árboles de
// demostración para el mapa público y acabó mostrándose en producción: si hace
// falta un entorno con datos de juguete, se usa el emulador con un seed, no un
// array en src/.
export const loadArbolesMapeados = async () => {
  const arbolesCol = collection(db, "arbolesMapeados");

  const snapshot = await getDocs(arbolesCol);

  const lista = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return lista;
};
