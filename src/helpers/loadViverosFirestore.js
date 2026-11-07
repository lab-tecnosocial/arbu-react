import { leerColeccionConCache } from "./leerColeccion";

export const loadViverosFirestore = (opciones) =>
  leerColeccionConCache("viveros", opciones);
