import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { ARBOLES_MAPEADOS_MOCK } from "../pages/mapav/utils/arbolesMapeadosMock";

export const loadArbolesMapeados = async () => {
  const arbolesCol = collection(db, "arbolesMapeados");

  const snapshot = await getDocs(arbolesCol);

  const lista = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return [...lista, ...ARBOLES_MAPEADOS_MOCK];
};