import * as XLSX from "xlsx";
import { collection, doc as docRef, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { camposDelTipo } from "./tiposAporte";
import { normalizarTexto } from "../campanias/especies";
import { validarAporte, aValorFecha } from "./validarAporte";
import { documentoNuevo } from "./escrituraArbol";
import { invalidarMarca } from "../leerColeccion";
import { exportarFilasAExcel } from "../exportarExcel";

/**
 * Carga de muchos aportes desde una planilla.
 *
 * La plantilla y el importador salen del MISMO esquema, así que no pueden
 * desincronizarse: si mañana se añade un campo al tipo de aporte, aparece en
 * la planilla y se valida, sin tocar este archivo.
 *
 * Nada se escribe hasta que alguien mira la previsualización y confirma. Las
 * filas con error no se importan; las correctas sí, porque obligar a arreglar
 * la planilla entera por dos filas malas es la forma segura de que nadie la
 * use.
 *
 * Las fotos no se suben desde aquí: se acepta la URL de una que ya esté en
 * Storage y el resto se completa después desde el editor.
 */

/** Firestore no admite más de 500 operaciones por lote. */
const TAMANIO_LOTE = 500;

/** Las columnas de la planilla, en orden, tal como se leen y se escriben. */
export const columnasPlantilla = (tipo) => [
  ...camposDelTipo(tipo).map((campo) => ({
    header: campo.etiqueta,
    nombre: campo.nombre,
    requerido: Boolean(campo.requerido),
  })),
  ...tipo.clavesFoto.map(({ key, label }) => ({
    header: `URL ${label.toLowerCase()}`,
    nombre: key,
    requerido: false,
  })),
];

/** Descarga una planilla vacía con una fila de ejemplo. */
export const descargarPlantilla = (tipo) => {
  const columnas = columnasPlantilla(tipo);
  const ejemplo = {
    nombreComun: "Jacarandá",
    nombreCientifico: "Jacarandá mimosifolia D. Don",
    lugarDePlantacion: "Plaza Colón",
    latitud: "-17.38950",
    longitud: "-66.15700",
    timestamp: aValorFecha(new Date()),
  };

  exportarFilasAExcel(
    [ejemplo],
    columnas.map(({ header, nombre }) => ({ header, valor: (fila) => fila[nombre] ?? "" })),
    { nombreHoja: "Aportes", nombreArchivo: `Plantilla_aportes_${tipo.id}` }
  );
};

/** Las URLs de foto de una fila, ya limpias. */
const fotosDeFila = (tipo, valores) =>
  Object.fromEntries(
    tipo.clavesFoto
      .map(({ key }) => [key, String(valores[key] ?? "").trim()])
      .filter(([, url]) => url)
  );

/**
 * Lee el archivo y lo convierte en filas validadas, sin escribir nada.
 *
 * @returns {Promise<{filas: Array, columnasDesconocidas: string[]}>}
 *   cada fila: `{numero, valores, errores, advertencias, valido}`
 */
const esCSV = (archivo) =>
  /\.csv$/i.test(archivo.name ?? "") || archivo.type === "text/csv";

/**
 * Un CSV se lee como TEXTO, no como bytes.
 *
 * `XLSX.read(arrayBuffer)` sobre un CSV lo decodifica como latin-1 y
 * "Nombre común" llega como "Nombre comÃºn": ninguna columna con tilde se
 * reconoce, que en esta plantilla son casi todas. `archivo.text()` decodifica
 * UTF-8, que es lo que exporta cualquier hoja de cálculo.
 *
 * `cellDates` hace que las fechas lleguen como Date en vez de como número de
 * serie de Excel.
 */
const abrirLibro = async (archivo) =>
  esCSV(archivo)
    ? XLSX.read(await archivo.text(), { type: "string", cellDates: true })
    : XLSX.read(await archivo.arrayBuffer(), { type: "array", cellDates: true });

export const leerPlanilla = async (archivo, tipo) => {
  const libro = await abrirLibro(archivo);
  const hoja = libro.Sheets[libro.SheetNames[0]];
  const crudas = XLSX.utils.sheet_to_json(hoja, { defval: "" });

  const columnas = columnasPlantilla(tipo);
  // Se comparan los encabezados sin tildes ni mayúsculas: la plantilla pasa por
  // Excel, Google Sheets y LibreOffice, y volver con "Latitud " o "LATITUD" no
  // debería costar una importación entera.
  const porHeader = new Map(columnas.map((c) => [normalizarTexto(c.header), c.nombre]));

  const encabezados = crudas.length ? Object.keys(crudas[0]) : [];
  const columnasDesconocidas = encabezados.filter((h) => !porHeader.has(normalizarTexto(h)));

  const filas = crudas.map((cruda, indice) => {
    const valores = {};
    for (const [header, valor] of Object.entries(cruda)) {
      const nombre = porHeader.get(normalizarTexto(header));
      if (nombre) valores[nombre] = valor;
    }

    const { errores, advertencias, valido, normalizados } = validarAporte(tipo, valores);

    return {
      // +2: la fila 1 son los encabezados y las planillas se cuentan desde 1.
      numero: indice + 2,
      valores,
      normalizados: { ...normalizados, ...fotosDeFila(tipo, valores) },
      errores,
      advertencias,
      valido,
    };
  });

  return { filas, columnasDesconocidas };
};

/**
 * Escribe las filas válidas en lotes.
 *
 * @returns {Promise<{success: boolean, escritas: number, error?: string, ids: string[]}>}
 */
export const importarFilas = async (tipo, filas, autor) => {
  if (!autor?.uid || !autor?.email) {
    return { success: false, escritas: 0, ids: [], error: "No hay sesión" };
  }

  const validas = filas.filter((f) => f.valido);
  if (!validas.length) return { success: true, escritas: 0, ids: [] };

  const ids = [];

  try {
    for (let i = 0; i < validas.length; i += TAMANIO_LOTE) {
      const lote = writeBatch(db);

      for (const fila of validas.slice(i, i + TAMANIO_LOTE)) {
        const ref = docRef(collection(db, tipo.coleccion));
        const { documento } = documentoNuevo(tipo, fila.normalizados, autor);
        lote.set(ref, { ...documento, registradoVia: "planilla" });
        ids.push(ref.id);
      }

      await lote.commit();
    }

    invalidarMarca(tipo.coleccion);
    return { success: true, escritas: ids.length, ids };
  } catch (error) {
    console.error("[aportes] falló la importación:", error);
    return { success: false, escritas: ids.length, ids, error: error.message };
  }
};
