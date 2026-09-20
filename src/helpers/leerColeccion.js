import { collection, getDocs, getDocsFromCache } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

/** El id del documento es la clave de casi todos los joins de este repo. */
const mapear = (snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

/**
 * Cada documento leído del servidor es una lectura facturada. En desarrollo se
 * anota en consola para que el coste de una pantalla sea visible mientras se
 * programa, en vez de descubrirse en la factura. Filtra por "[lecturas]".
 */
export const anotarLecturas = (origen, coleccion, cantidad, ms) => {
  if (import.meta.env.DEV) {
    const tiempo = ms == null ? "" : ` en ${Math.round(ms)} ms`;
    console.info(`[lecturas] ${coleccion}: ${cantidad} docs (${origen})${tiempo}`);
  }
};

/**
 * Cuánto vale la caché antes de volver a preguntar al servidor.
 *
 * Media hora es el equilibrio para el MAPA PÚBLICO: si alguien mapea un árbol
 * ahora, sale en el mapa a la media hora como mucho, y a cambio quien abre el
 * mapa cinco veces en una tarde paga las lecturas una vez, no cinco.
 *
 * No es el valor por defecto a propósito: quien no pide ventana (Arbu Pro, el
 * panel del concurso) sigue consultando siempre al servidor. Datos de hace
 * media hora están bien para mirar un mapa y mal para revisar registros.
 */
export const FRESCURA_MAPA_PUBLICO_MS = 30 * 60 * 1000;

const CLAVE = (nombre) => `arbu:leido:${nombre}`;

// localStorage puede estar bloqueado (Safari en privado, cookies de terceros).
// Sin marca de tiempo se refresca siempre: se pierde el ahorro, nunca el dato.
const leerMarca = (nombre) => {
  try {
    return Number(localStorage.getItem(CLAVE(nombre))) || 0;
  } catch {
    return 0;
  }
};

const escribirMarca = (nombre) => {
  try {
    localStorage.setItem(CLAVE(nombre), String(Date.now()));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
};

/**
 * Olvida la marca de frescura de una colección.
 *
 * Tras escribir desde Arbu Pro, el mapa público de ESTE navegador seguiría
 * sirviendo su copia de hasta media hora: el admin no vería el aporte que
 * acaba de registrar y lo daría por perdido. Borrar la marca fuerza la
 * siguiente lectura contra el servidor.
 */
export const invalidarMarca = (nombre) => {
  try {
    localStorage.removeItem(CLAVE(nombre));
  } catch {
    /* sin almacenamiento: no había marca que invalidar */
  }
};

/**
 * Lectura de una colección entera apoyada en la caché local de Firestore.
 *
 * - Si hay copia en caché y es más nueva que `frescuraMs`, se devuelve y **no
 *   se toca el servidor**: cero lecturas facturadas. Sin `frescuraMs` esto no
 *   pasa nunca: siempre se refresca.
 * - Si hay copia pero está vieja, se devuelve igual —el mapa se pinta al
 *   instante— y el servidor se consulta por detrás; `alRefrescar` recibe los
 *   datos nuevos cuando lleguen.
 * - Si no hay copia (primera visita, o navegador sin IndexedDB), se espera al
 *   servidor como siempre.
 *
 * Es deliberadamente "lo de antes primero": para un mapa de árboles, ver el
 * dato de hace un rato mientras llega el de ahora es mejor que mirar un mapa
 * vacío durante cuatro segundos.
 */
export const leerColeccionConCache = async (nombre, { alRefrescar, frescuraMs = 0 } = {}) => {
  const ref = collection(db, nombre);

  let desdeCache = null;
  try {
    const t0 = performance.now();
    const snapshot = await getDocsFromCache(ref);
    if (!snapshot.empty) {
      desdeCache = mapear(snapshot);
      anotarLecturas("caché", nombre, desdeCache.length, performance.now() - t0);
    }
  } catch {
    // Sin caché disponible: se sigue por el camino normal.
  }

  const esReciente = frescuraMs > 0 && Date.now() - leerMarca(nombre) < frescuraMs;
  if (desdeCache && esReciente) return desdeCache;

  const tServidor = performance.now();
  const fresco = getDocs(ref).then((snapshot) => {
    anotarLecturas("servidor", nombre, snapshot.size, performance.now() - tServidor);
    escribirMarca(nombre);
    return mapear(snapshot);
  });

  if (!desdeCache) return fresco;

  // El error de la lectura de fondo no puede tumbar lo que ya se está viendo.
  fresco.then((datos) => alRefrescar?.(datos)).catch(() => {});
  return desdeCache;
};
