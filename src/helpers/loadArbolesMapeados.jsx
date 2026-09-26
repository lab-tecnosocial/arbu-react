import { leerColeccionConCache } from "./leerColeccion";

// Datos reales de Firestore, sin excepciones. Hubo una variante con árboles de
// demostración para el mapa público y acabó mostrándose en producción: si hace
// falta un entorno con datos de juguete, se usa el emulador con un seed, no un
// array en src/.
export const loadArbolesMapeados = (opciones) =>
  leerColeccionConCache("arbolesMapeados", opciones);
