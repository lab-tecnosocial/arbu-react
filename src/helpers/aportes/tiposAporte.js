import { ORIGEN, ETIQUETA_ORIGEN } from "../campanias/origenArbol";
import { MAPPED_PHOTO_FIELDS } from "../../pages/mapav/components/CardTree/treePhotos";
import {
  sugerenciasNombresCientificos,
  sugerenciasNombresComunes,
} from "../../components/tabla/constants";

/**
 * Qué es un "aporte" y cómo se escribe.
 *
 * Un aporte es lo que una persona registra: un árbol con su primer monitoreo.
 * Hasta ahora solo lo creaban las apps móviles y la web únicamente sabía
 * corregir seis campos desde el panel del concurso. Aquí se declara la forma
 * del dato UNA vez, y de esa declaración salen las tres cosas que si no habría
 * que escribir por separado —y desincronizar—: el formulario, el validador y
 * el importador de planillas.
 *
 * Esta entrega implementa el mapeo (`arbolesMapeados`). Añadir la adopción
 * (`arbolesPlantados`, una sola foto `fotografia`, autoría en `plantadoPor`) es
 * otra entrada en `TIPOS_APORTE`, no una segunda implementación: ver
 * `origenArbol.js`, que ya normaliza la diferencia entre ambas colecciones.
 */

/** Tipos de campo que el formulario y el importador saben tratar. */
export const CAMPO = {
  TEXTO: "texto",
  NUMERO: "numero",
  FECHA: "fecha",
};

const TIPO_MAPEO = {
  id: "mapeo",
  etiqueta: ETIQUETA_ORIGEN[ORIGEN.MAPEADO],
  coleccion: "arbolesMapeados",
  origen: ORIGEN.MAPEADO,

  /**
   * Sin este campo el árbol no es un mapeo.
   * El mapa público decide qué galería pintar con
   * `Object.hasOwn(arbol, "mapeadoPor")` (CardTree.jsx): un documento sin él se
   * renderiza como adopción, con las fotos equivocadas y sin escudo scout.
   */
  campoAutor: "mapeadoPor",

  camposArbol: [
    {
      nombre: "nombreComun",
      etiqueta: "Nombre común",
      tipo: CAMPO.TEXTO,
      sugerencias: sugerenciasNombresComunes,
    },
    {
      nombre: "nombreCientifico",
      etiqueta: "Nombre científico",
      tipo: CAMPO.TEXTO,
      sugerencias: sugerenciasNombresCientificos,
    },
    { nombre: "nombrePropio", etiqueta: "Nombre propio", tipo: CAMPO.TEXTO },
    { nombre: "lugarDePlantacion", etiqueta: "Lugar de plantación", tipo: CAMPO.TEXTO },
    { nombre: "proyecto", etiqueta: "Proyecto", tipo: CAMPO.TEXTO },
    {
      nombre: "latitud",
      etiqueta: "Latitud",
      tipo: CAMPO.NUMERO,
      requerido: true,
      min: -90,
      max: 90,
    },
    {
      nombre: "longitud",
      etiqueta: "Longitud",
      tipo: CAMPO.NUMERO,
      requerido: true,
      min: -180,
      max: 180,
    },
  ],

  camposMonitoreo: [
    {
      nombre: "timestamp",
      etiqueta: "Fecha del mapeo",
      tipo: CAMPO.FECHA,
      requerido: true,
    },
    { nombre: "altura", etiqueta: "Altura (m)", tipo: CAMPO.NUMERO, min: 0 },
    {
      nombre: "diametroAlturaPecho",
      etiqueta: "DAP (cm)",
      tipo: CAMPO.NUMERO,
      min: 0,
    },
  ],

  /** Las seis claves de foto del mapeo, del catálogo que ya usa la ficha. */
  clavesFoto: MAPPED_PHOTO_FIELDS,
};

export const TIPOS_APORTE = [TIPO_MAPEO];

export const tipoPorId = (id) => TIPOS_APORTE.find((t) => t.id === id) ?? null;

/** El tipo al que pertenece un árbol ya guardado, por la presencia de su campo de autoría. */
export const tipoDeArbol = (arbol) =>
  TIPOS_APORTE.find((t) => arbol && Object.hasOwn(arbol, t.campoAutor)) ?? TIPO_MAPEO;

export const camposDelTipo = (tipo) => [...tipo.camposArbol, ...tipo.camposMonitoreo];

export const campoPorNombre = (tipo, nombre) =>
  camposDelTipo(tipo).find((c) => c.nombre === nombre) ?? null;

/** ¿El campo vive dentro de `monitoreos.{key}` en vez de en la raíz del árbol? */
export const esDeMonitoreo = (tipo, nombre) =>
  tipo.camposMonitoreo.some((c) => c.nombre === nombre);

export { TIPO_MAPEO };
