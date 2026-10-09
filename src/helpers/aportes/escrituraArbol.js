import {
  collection,
  doc as docRef,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase/firebase-config";
import { CAMPO, camposDelTipo, esDeMonitoreo } from "./tiposAporte";
import { completarParaApps } from "./esquemaApp";
import { toDate } from "../fechaArbol";
import { aValorFecha } from "./validarAporte";
import { invalidarMarca } from "../leerColeccion";

/**
 * Crear y actualizar un árbol: el núcleo que comparten la pantalla de aportes,
 * el importador de planillas y la corrección manual del concurso.
 *
 * Dos invariantes del modelo que este archivo garantiza, porque olvidarlas
 * produce documentos que parecen correctos y se pintan mal:
 *
 *  - **El campo de autoría no es opcional.** El mapa público decide si un árbol
 *    es un mapeo o una adopción por la mera presencia de `mapeadoPor`
 *    (`CardTree.jsx`). Sin él, la ficha muestra la galería equivocada.
 *  - **Un documento incompleto tumba la app móvil.** Lo que las apps escriben
 *    siempre, aquí se escribe siempre, aunque venga en blanco: lo garantiza
 *    `completarParaApps()`. El porqué está en `esquemaApp.js`, y costó 121
 *    crashes en producción.
 *  - **`monitoreos` es un MAPA, no una subcolección ni un array.** Su clave es
 *    un id opaco y el orden de `Object.keys` no significa nada: la fecha real
 *    sale del `timestamp` de cada monitoreo (ver `fechaArbol.js`).
 *
 * Se escribe SOLO lo que cambió. Un `updateDoc` con todos los campos pisaría
 * con "" lo que otra pantalla acabara de arreglar.
 */

/** Las fotos viven en el monitoreo y se tratan como campos de texto más. */
const camposFoto = (tipo) =>
  tipo.clavesFoto.map(({ key, label }) => ({
    nombre: key,
    etiqueta: label,
    tipo: CAMPO.TEXTO,
    esFoto: true,
  }));

const todosLosCampos = (tipo) => [...camposDelTipo(tipo), ...camposFoto(tipo)];

const enMonitoreo = (tipo, nombre) =>
  esDeMonitoreo(tipo, nombre) || tipo.clavesFoto.some((f) => f.key === nombre);

/** El valor que hoy tiene el documento, para comparar con lo que se envía. */
const valorActual = (tipo, arbol, monitoreo, campo) => {
  const origen = enMonitoreo(tipo, campo.nombre) ? monitoreo : arbol;
  const valor = origen?.[campo.nombre];

  if (campo.tipo === CAMPO.NUMERO) return valor ?? null;
  if (campo.tipo === CAMPO.FECHA) return valor ?? null;
  return valor ?? "";
};

const textoVacio = (valor) => valor === null || valor === undefined || valor === "";

/**
 * ¿Sigue valiendo lo mismo?
 *
 * Dos sutilezas que producen cambios fantasma si se ignoran:
 *  - El formulario solo sabe expresar un DÍA, mientras que el monitoreo
 *    guarda día y hora. Comparar por milisegundos daba por cambiada cualquier
 *    fecha que se abriera: abrir un registro y guardarlo sin tocar nada le
 *    borraba la hora al monitoreo de la app, y la hora no se puede recuperar.
 *    Se comparan los días, que es lo único que este formulario puede cambiar.
 *  - "Sin foto" llega del formulario como `null` y del documento como campo
 *    ausente. Tratarlos como distintos escribía un `null` por cada foto que
 *    no se había puesto, ensuciando el documento y llenando la bitácora de
 *    cambios que nadie hizo.
 */
const sonIguales = (campo, antes, despues) => {
  if (campo.tipo === CAMPO.FECHA) return aValorFecha(antes) === aValorFecha(despues);
  if (textoVacio(antes) && textoVacio(despues)) return true;
  return Object.is(antes, despues);
};

/**
 * Qué cambió de verdad, con el valor anterior al lado.
 * @returns {Record<string, {antes: any, despues: any}>}
 */
export const calcularCambios = (tipo, arbol, monitoreoKey, valores) => {
  const monitoreo = (arbol?.monitoreos ?? {})[monitoreoKey] ?? {};
  const cambios = {};

  for (const campo of todosLosCampos(tipo)) {
    if (!(campo.nombre in valores)) continue;

    const antes = valorActual(tipo, arbol, monitoreo, campo);
    const despues = valores[campo.nombre];
    if (!sonIguales(campo, antes, despues)) cambios[campo.nombre] = { antes, despues };
  }

  return cambios;
};

/**
 * Lo que va a Firestore: las fechas como Timestamp, el resto tal cual.
 *
 * Al corregir el DÍA de un monitoreo se conserva su hora original. El
 * formulario no puede expresarla, así que escribir medianoche tiraría un dato
 * que la app sí había registrado y que nadie pidió cambiar.
 */
const aValorFirestore = (campo, valor, anterior) => {
  if (campo?.tipo !== CAMPO.FECHA || !(valor instanceof Date)) return valor;

  const antes = toDate(anterior);
  if (antes) {
    const conHora = new Date(valor);
    conHora.setHours(
      antes.getHours(), antes.getMinutes(), antes.getSeconds(), antes.getMilliseconds()
    );
    return Timestamp.fromDate(conHora);
  }

  return Timestamp.fromDate(valor);
};

/**
 * Aplica los cambios sobre un árbol existente.
 *
 * Los campos del MONITOREO se escriben con ruta de punto
 * (`monitoreos.{key}.{campo}`) para no reemplazar el mapa entero: hacerlo
 * borraría los demás monitoreos del árbol.
 */
export const actualizarArbol = async (tipo, arbolId, monitoreoKey, cambios) => {
  if (!arbolId || !Object.keys(cambios).length) return { success: true, sinCambios: true };

  const porNombre = Object.fromEntries(todosLosCampos(tipo).map((c) => [c.nombre, c]));
  const actualizacion = {};

  for (const [nombre, { antes, despues }] of Object.entries(cambios)) {
    const campo = porNombre[nombre];
    const ruta = enMonitoreo(tipo, nombre)
      ? `monitoreos.${monitoreoKey}.${nombre}`
      : nombre;
    actualizacion[ruta] = aValorFirestore(campo, despues, antes);
  }

  try {
    await updateDoc(docRef(db, tipo.coleccion, arbolId), actualizacion);
    invalidarMarca(tipo.coleccion);
    return { success: true, cambios };
  } catch (error) {
    console.error("[aportes] no se pudo actualizar el árbol:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Reserva el id del árbol y la clave de su primer monitoreo ANTES de guardarlo.
 *
 * Hace falta porque las fotos se suben mientras se rellena el formulario, y su
 * ruta en Storage incluye ambos. La alternativa —guardar primero y actualizar
 * después— cuesta dos escrituras y deja el documento a medias si la segunda
 * falla. `doc()` sin datos no escribe nada: solo genera el id en el cliente.
 */
export const nuevaIdentidadAporte = (tipo) => ({
  arbolId: docRef(collection(db, tipo.coleccion)).id,
  monitoreoKey: uuidv4(),
});

/**
 * El documento de un árbol nuevo, listo para escribir o para un lote.
 *
 * @param {object} tipo del catálogo de `tiposAporte`
 * @param {object} valores ya normalizados (números como number, fechas como Date)
 * @param {{uid: string, email: string}} autor quien lo sube
 * @param {{arbolId: string, monitoreoKey?: string}} identidad el id con el que
 *   se va a guardar. Es obligatorio: las apps guardan el id dentro del propio
 *   documento y `completarParaApps()` falla sin él, a propósito.
 */
export const documentoNuevo = (tipo, valores, autor, identidad = null) => {
  const monitoreoKey = identidad?.monitoreoKey ?? uuidv4();
  const monitoreo = {};
  const arbol = {};

  for (const campo of todosLosCampos(tipo)) {
    const valor = aValorFirestore(campo, valores[campo.nombre]);
    if (valor === undefined || valor === null || valor === "") continue;

    if (enMonitoreo(tipo, campo.nombre)) monitoreo[campo.nombre] = valor;
    else arbol[campo.nombre] = valor;
  }

  return {
    monitoreoKey,
    documento: completarParaApps(tipo.coleccion, {
      ...arbol,
      [tipo.campoAutor]: autor.uid,
      validado: false,
      // Trazabilidad de lo cargado a mano: permite distinguirlo de lo que
      // llega de las apps, auditarlo y filtrarlo sin adivinar.
      registradoDesde: "web",
      registradoVia: "formulario",
      registradoPor: autor.email,
      registradoEn: serverTimestamp(),
      monitoreos: {
        [monitoreoKey]: {
          ...monitoreo,
          monitoreoRealizadoPor: autor.uid,
        },
      },
    }, identidad?.arbolId),
  };
};

/**
 * Crea el árbol.
 * @returns {Promise<{success: boolean, arbolId?: string, monitoreoKey?: string, error?: string}>}
 */
export const crearArbol = async (tipo, valores, autor, identidad = null) => {
  if (!autor?.uid || !autor?.email) {
    return { success: false, error: "No hay sesión: no se puede firmar el aporte" };
  }

  const ids = identidad ?? nuevaIdentidadAporte(tipo);
  const { documento, monitoreoKey } = documentoNuevo(tipo, valores, autor, ids);

  try {
    await setDoc(docRef(db, tipo.coleccion, ids.arbolId), documento);
    invalidarMarca(tipo.coleccion);
    return { success: true, arbolId: ids.arbolId, monitoreoKey };
  } catch (error) {
    console.error("[aportes] no se pudo crear el árbol:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Relee UN árbol.
 *
 * Tras guardar hay que refrescar lo que se ve, y releer la colección entera
 * costaría más de 3.000 lecturas facturadas por cada aporte corregido.
 * Firestore cobra por documento: aquí se pide exactamente el que cambió.
 */
export const leerArbol = async (tipo, arbolId) => {
  const snap = await getDoc(docRef(db, tipo.coleccion, arbolId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
