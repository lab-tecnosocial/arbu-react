import { toDate, toMillis } from "../fechaArbol";
import { REGLAS_ESPECIE_JACARANDA } from "./especies";

/**
 * Modelo de "campaña de mapeo".
 *
 * La colección sigue llamándose `proyectos` por historia: generalizamos el
 * concepto sin migrar un solo documento. Esta constante es el único punto de
 * acoplamiento con ese nombre.
 */
export const CAMPANIAS_COLLECTION = "proyectos";

export const TIPO_CAMPANIA = {
  PROYECTO: "proyecto",
  CAMPANIA: "campania",
  CONCURSO: "concurso",
};

export const ESTADO_CAMPANIA = {
  PROXIMA: "proxima",
  ACTIVA: "activa",
  CERRADA: "cerrada",
};

export const PARTICIPACION = {
  /** Solo cuentan los uids de `idMapeadores` (comportamiento histórico). */
  MAPEADORES: "mapeadores",
  /** Cualquiera que registre dentro de la ventana. */
  ABIERTO: "abierto",
};

export const CRITERIO_FECHA = {
  /** La fecha del árbol es la de su primer monitoreo (semántica v1). */
  PRIMER_MONITOREO: "primerMonitoreo",
  /** Cuenta cualquier monitoreo que caiga dentro de la ventana (v2). */
  CUALQUIER_MONITOREO: "cualquierMonitoreo",
};

export const slugify = (texto = "") =>
  String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Estado derivado de las fechas. NO se persiste: un campo `estado` guardado
 * envejece solo y miente en cuanto pasa la medianoche.
 */
export const getEstadoCampania = (campania, ahora = Date.now()) => {
  const inicio = toMillis(campania?.fechaInicio);
  const fin = toMillis(campania?.fechaFin);
  if (inicio && ahora < inicio) return ESTADO_CAMPANIA.PROXIMA;
  if (fin && ahora > fin) return ESTADO_CAMPANIA.CERRADA;
  return ESTADO_CAMPANIA.ACTIVA;
};

/**
 * Normaliza un documento de Firestore a la forma que ve el resto de la app.
 *
 * Ningún documento existente se toca: la compatibilidad se resuelve aquí, en
 * lectura. La pieza clave es `criterioFecha`, cuyo default depende de
 * `schemaVersion`: los proyectos v1 conservan EXACTAMENTE la semántica de hoy,
 * y solo las campañas nuevas usan la corregida. Sin esto, los conteos de los
 * proyectos scouts existentes cambiarían en silencio.
 */
export const normalizarCampania = (doc = {}) => {
  const esV2 = (doc.schemaVersion ?? 1) >= 2;
  const nombre = doc.nombreProyecto || doc.nombre || "(sin nombre)";

  return {
    id: doc.id,
    slug: doc.slug || `${slugify(nombre)}-${String(doc.id || "").slice(0, 4)}`,
    nombre,
    descripcion: doc.descripcion || "",
    tipo: doc.tipo || TIPO_CAMPANIA.PROYECTO,
    schemaVersion: doc.schemaVersion ?? 1,

    fechaInicio: toDate(doc.fechaInicio),
    fechaFin: toDate(doc.fechaFin),
    estado: getEstadoCampania(doc),

    publica: doc.publica === true,
    destacada: doc.destacada === true,
    orden: doc.orden ?? 0,

    participacion:
      doc.participacion === PARTICIPACION.ABIERTO
        ? PARTICIPACION.ABIERTO
        : PARTICIPACION.MAPEADORES,
    idMapeadores: doc.idMapeadores || [],

    reglas: {
      criterioFecha:
        doc.reglas?.criterioFecha ||
        (esV2 ? CRITERIO_FECHA.CUALQUIER_MONITOREO : CRITERIO_FECHA.PRIMER_MONITOREO),
      especies: doc.reglas?.especies || null,
      municipios: doc.reglas?.municipios || null,
      fotos: doc.reglas?.fotos || null,
      requiereUbicacion: doc.reglas?.requiereUbicacion ?? false,
      revisionHumana: doc.reglas?.revisionHumana ?? false,
      criterioDesempate1: doc.reglas?.criterioDesempate1 || "municipiosDistintos",
    },

    iconoMarcador: doc.iconoMarcador || null,
    resultadosPublicados: doc.resultadosPublicados === true,

    usuarioAutorizado: doc.usuarioAutorizado || null,
    createdAt: toDate(doc.createdAt),
    updatedAt: toDate(doc.updatedAt),
    _raw: doc,
  };
};

/** Orden para el selector público: destacadas primero, luego `orden`, luego la más reciente. */
export const ordenarCampanias = (campanias = []) =>
  [...campanias].sort((a, b) => {
    if (a.destacada !== b.destacada) return a.destacada ? -1 : 1;
    if (a.orden !== b.orden) return b.orden - a.orden;
    return (b.fechaInicio?.getTime() ?? 0) - (a.fechaInicio?.getTime() ?? 0);
  });

/** Reglas por defecto del concurso de primavera, para prellenar el formulario. */
export const REGLAS_CONCURSO_PRIMAVERA = {
  criterioFecha: CRITERIO_FECHA.CUALQUIER_MONITOREO,
  especies: { ...REGLAS_ESPECIE_JACARANDA, filtraVisualizacion: false },
  municipios: null,
  fotos: { requeridas: ["fotoArbolCompleto"], algunaDe: ["fotoFlor"] },
  requiereUbicacion: true,
  revisionHumana: true,
  criterioDesempate1: "municipiosDistintos",
};
