import { db } from "../firebase/firebase-config";

/**
 * Load inscripciones mapeo data and join with their mapped trees
 * Returns an array of mappers with their associated trees
 */
export const loadMapeoData = async () => {
  try {
    // Fetch inscripcionesMapeo collection
    const inscripcionesSnapshot = await db.collection("inscripcionesMapeo").get();
    const inscripciones = [];
    inscripcionesSnapshot.forEach((doc) => {
      inscripciones.push({ ...doc.data() });
    });

    // Fetch arbolesMapeados collection
    const arbolesSnapshot = await db.collection("arbolesMapeados").get();
    const arbolesMapeados = [];
    arbolesSnapshot.forEach((doc) => {
      arbolesMapeados.push({ ...doc.data() });
    });

    // Join data: match inscripcion.id with arbol.mapeadoPor
    const mapeadoresConArboles = inscripciones.map((mapper) => {
      const arbolesDelMapeador = arbolesMapeados.filter(
        (arbol) => arbol.mapeadoPor === mapper.id
      );

      return {
        ...mapper,
        arbolesMapeados: arbolesDelMapeador,
        cantidadArbolesMapeados: arbolesDelMapeador.length,
      };
    });

    return {
      mapeadores: mapeadoresConArboles,
      arbolesMapeados: arbolesMapeados,
    };
  } catch (error) {
    console.error("Error loading mapeo data:", error);
    return {
      mapeadores: [],
      arbolesMapeados: [],
    };
  }
};
