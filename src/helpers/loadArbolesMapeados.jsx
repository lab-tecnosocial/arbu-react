import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { ARBOLES_MAPEADOS_MOCK } from "../pages/mapav/utils/arbolesMapeadosMock";

// Datos reales de Firestore. Es lo que consume Arbu Pro (tabla, mapeo scout,
// proyectos), donde un árbol de demo falsearía los reportes.
export const loadArbolesMapeados = async () => {
  const arbolesCol = collection(db, "arbolesMapeados");

  const snapshot = await getDocs(arbolesCol);

  const lista = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return lista;
};

// Los reales más los árboles de demostración que usa el mapa público para
// mostrar fotos y monitoreos de ejemplo.
export const loadArbolesMapeadosConDemo = async () => {
  const lista = await loadArbolesMapeados();
  return [...lista, ...ARBOLES_MAPEADOS_MOCK];
};
