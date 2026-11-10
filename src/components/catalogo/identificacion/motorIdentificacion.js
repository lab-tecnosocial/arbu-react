import { getBytes, ref } from 'firebase/storage'
import { storage } from '../../../firebase/firebase-config'
import { buscarEspecieEnCatalogo, tituloDesdeEtiqueta } from './mapearEspecie'

export const MODELOS_IDENTIFICACION = {
  hoja: {
    clases: 15,
    rutas: ['modelos/identificacion/model_hoja.tflite'],
    urlEnv: 'VITE_MODELO_HOJA_URL',
  },
  arbol: {
    clases: 10,
    rutas: [
      'modelos/identificacion/model_arbol.tflite',
      'modelos/identificacion/model.tflite',
    ],
    urlEnv: 'VITE_MODELO_ARBOL_URL',
  },
}

const WASM_LOCAL = '/mediapipe/wasm'
const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm'
const MAX_RESULTADOS = 5
const UMBRAL_MINIMO = 0.04

let wasmFileset = null
let clasificador = null
let tipoCargado = null
let cargaEnCurso = null
let tipoEnCarga = null
const buffersModelo = {}

function mensajeErrorIdentificacion(error) {
  const code = String(error?.code ?? '')
  const msg = String(error?.message ?? error ?? '')
  if (code.includes('unauthorized') || msg.includes('unauthorized')) {
    return 'Storage no permite leer el modelo. Publica la regla de lectura en modelos/identificacion.'
  }
  if (code.includes('object-not-found') || msg.includes('object-not-found')) {
    return 'No se encontró el modelo en Storage. Revisa modelos/identificacion/ y que coincida el proyecto del .env.'
  }
  if (/failed to fetch|cors|networkerror/i.test(msg)) {
    return 'El navegador bloqueó la descarga del modelo. Recarga e inténtalo de nuevo.'
  }
  if (/ModuleFactory|wasm/i.test(msg)) {
    return 'No se pudo cargar el motor de identificación. Recarga la página o prueba en Chrome.'
  }
  return msg || 'No se pudo analizar la foto. Prueba de nuevo o usa Chrome.'
}

async function bytesDesdeRespuesta(respuesta) {
  if (!respuesta.ok) throw new Error(`No se pudo bajar el modelo (${respuesta.status})`)
  const bytes = new Uint8Array(await respuesta.arrayBuffer())
  if (bytes.byteLength < 1000) throw new Error('El archivo del modelo está vacío o incompleto')
  return bytes
}

async function descargarModelo(tipo, onEstado) {
  if (buffersModelo[tipo]) return buffersModelo[tipo]
  onEstado?.('descargando')

  const modelo = MODELOS_IDENTIFICACION[tipo]
  if (!modelo) throw new Error('Tipo de foto no válido')

  const urlEnv = import.meta.env[modelo.urlEnv]
  let ultimoError

  const guardar = (bytes) => {
    buffersModelo[tipo] = bytes
    return bytes
  }

  if (import.meta.env.DEV) {
    for (const ruta of modelo.rutas) {
      const archivo = ruta.split('/').pop()
      try {
        return guardar(await bytesDesdeRespuesta(await fetch(`/api/storage-modelos/${archivo}`)))
      } catch (error) {
        ultimoError = error
      }
    }
  }

  if (urlEnv) {
    try {
      return guardar(await bytesDesdeRespuesta(await fetch(urlEnv)))
    } catch (error) {
      ultimoError = error
    }
  }

  for (const ruta of modelo.rutas) {
    try {
      const buffer = await getBytes(ref(storage, ruta))
      return guardar(new Uint8Array(buffer))
    } catch (error) {
      ultimoError = error
    }
  }

  throw ultimoError ?? new Error('No se encontró el modelo en Storage')
}

async function cargarVision() {
  if (wasmFileset) return wasmFileset
  const { FilesetResolver } = await import('@mediapipe/tasks-vision')
  const intentos = [
    [WASM_LOCAL, false],
    [WASM_LOCAL, true],
    [WASM_CDN, false],
    [WASM_CDN, true],
  ]
  let ultimoError
  for (const [ruta, usarModulo] of intentos) {
    try {
      wasmFileset = await FilesetResolver.forVisionTasks(ruta, usarModulo)
      return wasmFileset
    } catch (error) {
      ultimoError = error
    }
  }
  throw ultimoError ?? new Error('No se pudo cargar el runtime de identificación')
}

async function crearClasificador(tipo, delegate, onEstado) {
  const { ImageClassifier } = await import('@mediapipe/tasks-vision')
  const vision = await cargarVision()
  const modeloBytes = await descargarModelo(tipo, onEstado)

  return ImageClassifier.createFromOptions(vision, {
    baseOptions: {
      modelAssetBuffer: modeloBytes.slice(),
      delegate,
    },
    runningMode: 'IMAGE',
    maxResults: MAX_RESULTADOS,
    scoreThreshold: UMBRAL_MINIMO,
  })
}

export async function prepararMotorIdentificacion(tipo, onEstado) {
  if (!MODELOS_IDENTIFICACION[tipo]) {
    throw new Error('Tipo de foto no válido')
  }
  if (tipoCargado === tipo && clasificador) return clasificador
  if (cargaEnCurso) {
    if (tipoEnCarga === tipo) return cargaEnCurso
    try {
      await cargaEnCurso
    } catch {
      /* se recarga el modelo del tipo pedido */
    }
    if (tipoCargado === tipo && clasificador) return clasificador
  }

  tipoEnCarga = tipo
  cargaEnCurso = (async () => {
    clasificador?.close?.()
    clasificador = null
    tipoCargado = null

    const errores = []
    for (const delegate of ['CPU', 'GPU']) {
      try {
        clasificador = await crearClasificador(tipo, delegate, onEstado)
        tipoCargado = tipo
        return clasificador
      } catch (error) {
        errores.push(error)
      }
    }
    throw errores.at(-1) ?? new Error('No se pudo iniciar el clasificador')
  })()

  try {
    return await cargaEnCurso
  } finally {
    cargaEnCurso = null
    tipoEnCarga = null
  }
}

function categoriasDeResultado(resultado) {
  const cabeza = resultado?.classifications?.[0]
  const categorias = cabeza?.categories ?? []
  return [...categorias].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
}

export function modeloIdentificacionEnCache(tipo) {
  return Boolean(buffersModelo[tipo])
}

export async function identificarEspecie(tipo, archivo, especiesCatalogo = [], onEstado) {
  if (!archivo) throw new Error('Falta la foto')
  let motor
  try {
    if (!modeloIdentificacionEnCache(tipo)) onEstado?.('descargando')
    motor = await prepararMotorIdentificacion(tipo, onEstado)
    onEstado?.('analizando')
  } catch (error) {
    throw new Error(mensajeErrorIdentificacion(error))
  }
  const bitmap = await createImageBitmap(archivo)
  try {
    const crudo = motor.classify(bitmap)
    return categoriasDeResultado(crudo).map((categoria) => {
      const etiqueta = categoria.categoryName || categoria.displayName || ''
      const especie = buscarEspecieEnCatalogo(etiqueta, especiesCatalogo)
      return {
        etiqueta,
        nombre: especie?.nombreComun || tituloDesdeEtiqueta(etiqueta),
        score: categoria.score ?? 0,
        especie,
      }
    })
  } finally {
    bitmap.close?.()
  }
}

export function liberarMotorIdentificacion() {
  clasificador?.close?.()
  clasificador = null
  tipoCargado = null
  wasmFileset = null
}
