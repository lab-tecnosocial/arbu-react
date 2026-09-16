import { getMonitoreosOrdenados, getFechaArbol, toMillis } from "../fechaArbol";
import { municipioDeCoordenada } from "../geo/municipios";
import { coincideEspecie, tieneEspecieIdentificada } from "./especies";
import { CRITERIO_FECHA, PARTICIPACION } from "./campaniaModel";

/**
 * La unidad de conteo de una campaña NO es el árbol: es el REGISTRO, entendido
 * como el par (árbol, monitoreo) cuyo timestamp cae dentro de la ventana.
 *
 * Dos razones, ambas de las bases del concurso:
 *  - Si varias personas mapean el mismo ejemplar, vale para todas.
 *  - Un árbol mapeado hace un año que recibe un monitoreo durante el concurso
 *    cuenta, y las fotos que importan son las DE ESE monitoreo, no las del
 *    primero.
 */

const tieneCoordenadas = (arbol) =>
  Number.isFinite(arbol?.latitud) &&
  Number.isFinite(arbol?.longitud) &&
  !(arbol.latitud === 0 && arbol.longitud === 0);

const noVacio = (valor) => typeof valor === "string" && valor.trim().length > 0;

const CLAVES_FOTO = [
  "fotoArbolCompleto",
  "fotoCorteza",
  "fotoHoja",
  "fotoFlor",
  "fotoRaiz",
];

/** Checklist fija de completitud. Decide un premio: no cambiarla a mitad de concurso. */
export const ITEMS_COMPLETITUD = [
  (arbol, mon) => noVacio(mon.fotoArbolCompleto),
  (arbol, mon) => noVacio(mon.fotoFlor),
  (arbol, mon) => noVacio(mon.fotoHoja),
  (arbol, mon) => noVacio(mon.fotoCorteza),
  (arbol) => noVacio(arbol.nombreComun),
  (arbol) => noVacio(arbol.nombreCientifico),
  (arbol) => noVacio(arbol.lugarDePlantacion),
  (arbol, mon) => Number.isFinite(mon.altura) || Number.isFinite(mon.diametroAlturaPecho),
];

const calcularCompletitud = (arbol, monitoreo) =>
  ITEMS_COMPLETITUD.filter((item) => {
    try {
      return item(arbol, monitoreo);
    } catch {
      return false;
    }
  }).length / ITEMS_COMPLETITUD.length;

/** Clave determinista del registro; también es el docId de su revisión. */
export const claveRegistro = (arbolId, monitoreoKey) => `${arbolId}__${monitoreoKey}`;

const dentroDeVentana = (fecha, inicio, fin) => {
  if (!fecha) return false;
  const t = fecha.getTime();
  if (inicio && t < inicio) return false;
  if (fin && t > fin) return false;
  return true;
};

/**
 * Todos los registros de una campaña.
 * @returns {Array<object>} un registro por par (árbol, monitoreo) en ventana
 */
export const registrosDeCampania = (arboles = [], campania) => {
  if (!campania) return [];

  const inicio = toMillis(campania.fechaInicio);
  const fin = toMillis(campania.fechaFin);
  const { reglas = {}, participacion, idMapeadores = [] } = campania;
  const soloMapeadores = participacion === PARTICIPACION.MAPEADORES;
  const setMapeadores = new Set(idMapeadores);
  const porPrimerMonitoreo = reglas.criterioFecha === CRITERIO_FECHA.PRIMER_MONITOREO;

  const registros = [];

  for (const arbol of arboles) {
    const monitoreos = getMonitoreosOrdenados(arbol);
    if (!monitoreos.length) continue;

    // En semántica v1 la fecha del árbol es la de su primer monitoreo, y el
    // árbol entero entra o no entra; en v2 se evalúa monitoreo a monitoreo.
    const fechaArbol = porPrimerMonitoreo ? getFechaArbol(arbol) : null;
    const candidatos = porPrimerMonitoreo ? monitoreos.slice(0, 1) : monitoreos;

    for (const monitoreo of candidatos) {
      const fecha = porPrimerMonitoreo ? fechaArbol : monitoreo.fecha;
      const enPeriodo = dentroDeVentana(fecha, inicio, fin);
      if (!enPeriodo) continue;

      const uid = monitoreo.monitoreoRealizadoPor || arbol.mapeadoPor || null;
      const participante = soloMapeadores ? Boolean(uid && setMapeadores.has(uid)) : Boolean(uid);
      if (!participante) continue;

      const conCoordenadas = tieneCoordenadas(arbol);
      const municipio = conCoordenadas
        ? municipioDeCoordenada(arbol.latitud, arbol.longitud)
        : null;

      const especieAdmitida = coincideEspecie(arbol, reglas.especies);
      const especieIdentificada = tieneEspecieIdentificada(arbol);

      const municipioAdmitido = reglas.municipios?.length
        ? Boolean(municipio && reglas.municipios.includes(municipio.codigoIne))
        : true;

      const fotosRequeridas = reglas.fotos?.requeridas ?? [];
      const fotosAlgunaDe = reglas.fotos?.algunaDe ?? [];
      const fotosCompletas = fotosRequeridas.every((k) => noVacio(monitoreo[k]));
      // "En flor" es una INFERENCIA: especie objetivo + foto de flor. Nunca
      // invalida por sí sola; la decide un humano mirando la foto.
      const enFlor = fotosAlgunaDe.length
        ? especieAdmitida && fotosAlgunaDe.some((k) => noVacio(monitoreo[k]))
        : true;

      const fotos = Object.fromEntries(CLAVES_FOTO.map((k) => [k, monitoreo[k] || null]));

      const motivos = {
        enPeriodo,
        participante,
        especieAdmitida,
        especieIdentificada,
        municipioAdmitido,
        enFlor,
        fotosCompletas,
        tieneUbicacion: reglas.requiereUbicacion ? conCoordenadas : true,
      };

      registros.push({
        clave: claveRegistro(arbol.id, monitoreo.key),
        campaniaId: campania.id,
        arbolId: arbol.id,
        monitoreoKey: monitoreo.key,
        uid,
        fecha,
        latitud: arbol.latitud,
        longitud: arbol.longitud,
        municipio,
        nombreComun: arbol.nombreComun || "",
        nombreCientifico: arbol.nombreCientifico || "",
        nombrePropio: arbol.nombrePropio || "",
        lugarDePlantacion: arbol.lugarDePlantacion || "",
        altura: monitoreo.altura ?? null,
        diametroAlturaPecho: monitoreo.diametroAlturaPecho ?? null,
        fotos,
        completitud: calcularCompletitud(arbol, monitoreo),
        motivos,
        valido: Object.values(motivos).every(Boolean),
        arbol,
      });
    }
  }

  return registros;
};

/**
 * Los árboles que el mapa público debe pintar para una campaña.
 *
 * Filtra SOLO por ventana de fechas y participación. La especie no oculta
 * nada: un jacarandá con `nombreCientifico: "..."` debe seguir viéndose y caer
 * en la cola de revisión, no desaparecer. Solo se respeta el filtro por
 * especie si la campaña lo pide explícitamente con `filtraVisualizacion`.
 */
export const filtrarArbolesDeCampania = (arboles = [], campania) => {
  if (!campania) return arboles;

  const registros = registrosDeCampania(arboles, campania);
  const filtraPorEspecie = campania.reglas?.especies?.filtraVisualizacion === true;

  const idsVisibles = new Set(
    registros
      .filter((r) => (filtraPorEspecie ? r.motivos.especieAdmitida : true))
      .map((r) => r.arbolId)
  );

  return arboles.filter((arbol) => idsVisibles.has(arbol.id));
};

/** Evaluación de un árbol concreto, para la ficha y el panel. */
export const evaluarArbolEnCampania = (arbol, campania) => {
  const registros = registrosDeCampania([arbol], campania);
  return { registros, algunoValido: registros.some((r) => r.valido) };
};
