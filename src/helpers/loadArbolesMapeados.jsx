import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
<<<<<<< HEAD
=======
import { ARBOLES_MAPEADOS_MOCK } from "../pages/mapav/utils/arbolesMapeadosMock";
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8

export const loadArbolesMapeados = async () => {
  const arbolesCol = collection(db, "arbolesMapeados");

  const snapshot = await getDocs(arbolesCol);

  const lista = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

<<<<<<< HEAD
  return lista;
=======
  return [...lista, ...ARBOLES_MAPEADOS_MOCK];
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
};