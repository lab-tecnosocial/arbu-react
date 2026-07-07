/**
 * Características ideales de plantación por especie del catálogo ARBU.
 * Se vinculan con las especies del sistema por nombre común normalizado.
 */

export const LUGARES = [
  'Calle',
  'Parque',
  'Plazuela',
  'Rotonda',
  'Jardín privado',
  'Plaza',
  'Bosque urbano',
  'Corredor biológico',
  'Hacienda privada',
]

export const OPCIONES_CABLES = ['No', 'Baja', 'Media']

/** @typedef {'arbusto'|'bajo'|'medio'|'alto'|'muy_alto'} Porte */
/** @typedef {'alta'|'media'|'baja'} Tolerancia */

/**
 * @typedef {Object} SpeciesPlantingProfile
 * @property {string} key
 * @property {string[]} lugaresIdeal
 * @property {string[]} [lugaresAceptables]
 * @property {Porte} porte
 * @property {number} [anchoMinimo] metros
 * @property {Tolerancia} toleranciaContaminacion
 * @property {Tolerancia} toleranciaCables
 * @property {'Nativa'|'Introducida'} origen
 * @property {string|null} [conservacion]
 * @property {string[]} [restricciones] claves internas evaluadas por el selector
 * @property {string} destacado frase corta para resultados
 */

/** @type {SpeciesPlantingProfile[]} */
export const speciesPlantingProfiles = [
  {
    key: 'chacatea',
    lugaresIdeal: ['Calle', 'Jardín privado', 'Plazuela'],
    lugaresAceptables: ['Parque', 'Rotonda', 'Hacienda privada'],
    porte: 'arbusto',
    anchoMinimo: 1,
    toleranciaContaminacion: 'alta',
    toleranciaCables: 'alta',
    origen: 'Introducida',
    restricciones: [],
    destacado: 'Resiste suelos degradados y contaminación; ideal como muro o arbolito.',
  },
  {
    key: 'tipa',
    lugaresIdeal: ['Parque', 'Plaza', 'Bosque urbano'],
    lugaresAceptables: ['Plazuela', 'Hacienda privada', 'Corredor biológico'],
    porte: 'alto',
    anchoMinimo: 4,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    conservacion: 'VULNERABLE',
    restricciones: ['cables_media'],
    destacado: 'Adaptación amplia; requiere tutores en etapa juvenil.',
  },
  {
    key: 'toborochi',
    lugaresIdeal: ['Parque', 'Plaza', 'Bosque urbano'],
    lugaresAceptables: ['Plazuela', 'Hacienda privada'],
    porte: 'alto',
    anchoMinimo: 5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    restricciones: ['cables_media', 'espacio_reducido'],
    destacado: 'Amplia adaptación y resistencia a plagas.',
  },
  {
    key: 'palo verde',
    lugaresIdeal: ['Calle', 'Rotonda', 'Plazuela'],
    lugaresAceptables: ['Parque', 'Jardín privado', 'Plaza'],
    porte: 'medio',
    anchoMinimo: 2.5,
    toleranciaContaminacion: 'alta',
    toleranciaCables: 'media',
    origen: 'Nativa',
    destacado: 'Resistente a sequía, viento y presión ambiental.',
  },
  {
    key: 'siraricito',
    lugaresIdeal: ['Parque', 'Plaza', 'Plazuela'],
    lugaresAceptables: ['Calle', 'Bosque urbano', 'Corredor biológico'],
    porte: 'alto',
    anchoMinimo: 4,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    restricciones: ['cables_media', 'espacio_reducido'],
    destacado: 'Se adapta a distintos suelos urbanos y aporta nitrógeno.',
  },
  {
    key: 'magnolia',
    lugaresIdeal: ['Jardín privado', 'Parque', 'Hacienda privada'],
    lugaresAceptables: ['Plaza', 'Plazuela'],
    porte: 'medio',
    anchoMinimo: 3,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'media',
    origen: 'Introducida',
    restricciones: ['encharcamiento', 'calle_alto_trafico'],
    destacado: 'Prefiere suelos con materia orgánica y buen drenaje.',
  },
  {
    key: 'pata de buey',
    lugaresIdeal: ['Parque', 'Plazuela', 'Jardín privado'],
    lugaresAceptables: ['Calle', 'Plaza', 'Hacienda privada'],
    porte: 'medio',
    anchoMinimo: 2.5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'media',
    origen: 'Nativa',
    restricciones: ['suelo_encharcado'],
    destacado: 'Ideal para suelos drenados; aporta nitrógeno.',
  },
  {
    key: 'tara',
    lugaresIdeal: ['Parque', 'Plazuela', 'Bosque urbano'],
    lugaresAceptables: ['Jardín privado', 'Corredor biológico', 'Hacienda privada'],
    porte: 'bajo',
    anchoMinimo: 2,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'alta',
    origen: 'Nativa',
    restricciones: ['mucha_sombra'],
    destacado: 'Tolerante a varios suelos; evitar zonas muy sombreadas.',
  },
  {
    key: 'algarrobo',
    lugaresIdeal: ['Parque', 'Bosque urbano', 'Hacienda privada'],
    lugaresAceptables: ['Plaza', 'Corredor biológico'],
    porte: 'alto',
    anchoMinimo: 4,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    conservacion: 'VULNERABLE',
    restricciones: ['cables_media', 'espacio_reducido'],
    destacado: 'Muy adaptable, incluso a suelos arcillosos.',
  },
  {
    key: 'terebinto',
    lugaresIdeal: ['Parque', 'Plaza', 'Plazuela'],
    lugaresAceptables: ['Calle', 'Bosque urbano'],
    porte: 'medio',
    anchoMinimo: 3,
    toleranciaContaminacion: 'alta',
    toleranciaCables: 'media',
    origen: 'Nativa',
    destacado: 'Tolerante a contaminación ambiental.',
  },
  {
    key: 'jazmin paraguayo o diamela',
    lugaresIdeal: ['Jardín privado', 'Plazuela'],
    lugaresAceptables: ['Hacienda privada'],
    porte: 'arbusto',
    anchoMinimo: 1.5,
    toleranciaContaminacion: 'baja',
    toleranciaCables: 'alta',
    origen: 'Introducida',
    restricciones: ['calle_alto_trafico', 'contaminacion'],
    destacado: 'Evitar calles y avenidas de alto tráfico.',
  },
  {
    key: 'tajibo',
    lugaresIdeal: ['Parque', 'Plaza', 'Plazuela'],
    lugaresAceptables: ['Calle', 'Bosque urbano'],
    porte: 'medio',
    anchoMinimo: 3,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'media',
    origen: 'Nativa',
    restricciones: ['suelo_arcilloso_extremo'],
    destacado: 'Buena adaptación urbana excepto suelos muy arcillosos.',
  },
  {
    key: 'carnavalito',
    lugaresIdeal: ['Calle', 'Parque', 'Plazuela'],
    lugaresAceptables: ['Plaza', 'Rotonda', 'Jardín privado'],
    porte: 'medio',
    anchoMinimo: 3,
    toleranciaContaminacion: 'alta',
    toleranciaCables: 'media',
    origen: 'Nativa',
    destacado: 'Bien adaptado a centros urbanos.',
  },
  {
    key: 'falso laurel',
    lugaresIdeal: ['Jardín privado', 'Plazuela'],
    lugaresAceptables: ['Hacienda privada'],
    porte: 'arbusto',
    anchoMinimo: 1.5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'alta',
    origen: 'Introducida',
    restricciones: ['flores_toxicas'],
    destacado: 'Usar con cautela por flores tóxicas; requiere poda.',
  },
  {
    key: 'cucarda',
    lugaresIdeal: ['Calle', 'Jardín privado', 'Plazuela'],
    lugaresAceptables: ['Parque', 'Plaza', 'Rotonda'],
    porte: 'arbusto',
    anchoMinimo: 1.5,
    toleranciaContaminacion: 'alta',
    toleranciaCables: 'alta',
    origen: 'Introducida',
    destacado: 'Amplia adaptación en la ciudad; atrae polinizadores.',
  },
  {
    key: 'jarca',
    lugaresIdeal: ['Parque', 'Bosque urbano', 'Corredor biológico'],
    lugaresAceptables: ['Plaza', 'Plazuela', 'Hacienda privada'],
    porte: 'medio',
    anchoMinimo: 3,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'media',
    origen: 'Nativa',
    restricciones: ['suelo_arcilloso'],
    destacado: 'No apta para suelos arcillosos.',
  },
  {
    key: 'clavelina',
    lugaresIdeal: ['Jardín privado', 'Plazuela', 'Calle'],
    lugaresAceptables: ['Parque', 'Hacienda privada'],
    porte: 'arbusto',
    anchoMinimo: 1.5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'alta',
    origen: 'Introducida',
    restricciones: ['suelo_arcilloso_extremo', 'suelo_encharcado'],
    destacado: 'Requiere suelos drenados.',
  },
  {
    key: 'molle',
    lugaresIdeal: ['Parque', 'Bosque urbano', 'Plaza'],
    lugaresAceptables: ['Corredor biológico', 'Hacienda privada', 'Plazuela'],
    porte: 'alto',
    anchoMinimo: 4,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    restricciones: ['cables_media', 'espacio_reducido'],
    destacado: 'Excelente para combinaciones en parques amplios.',
  },
  {
    key: 'oreja de mono',
    lugaresIdeal: ['Parque', 'Plaza', 'Bosque urbano'],
    lugaresAceptables: ['Hacienda privada', 'Corredor biológico'],
    porte: 'alto',
    anchoMinimo: 5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    restricciones: ['cables_media', 'espacio_reducido'],
    destacado: 'Amplia adaptación edáfica.',
  },
  {
    key: 'garrocha',
    lugaresIdeal: ['Jardín privado', 'Corredor biológico', 'Hacienda privada'],
    lugaresAceptables: ['Parque', 'Plazuela'],
    porte: 'bajo',
    anchoMinimo: 2,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'alta',
    origen: 'Nativa',
    restricciones: ['suelo_arcilloso', 'suelo_encharcado'],
    destacado: 'Ideal para suelos drenados, arenosos o pedregosos.',
  },
  {
    key: 'negundo',
    lugaresIdeal: ['Jardín privado', 'Parque', 'Hacienda privada'],
    lugaresAceptables: ['Plazuela', 'Plaza'],
    porte: 'medio',
    anchoMinimo: 3,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'media',
    origen: 'Introducida',
    restricciones: ['vida_util_corta'],
    destacado: 'Vida útil corta; sensible a hongos y taladros.',
  },
  {
    key: 'moto moto',
    lugaresIdeal: ['Calle', 'Jardín privado', 'Plazuela'],
    lugaresAceptables: ['Parque', 'Rotonda'],
    porte: 'arbusto',
    anchoMinimo: 1,
    toleranciaContaminacion: 'alta',
    toleranciaCables: 'alta',
    origen: 'Nativa',
    destacado: 'Ideal para jardineras pequeñas y zonas pedregosas.',
  },
  {
    key: 'lloque',
    lugaresIdeal: ['Jardín privado', 'Hacienda privada', 'Corredor biológico'],
    lugaresAceptables: ['Plazuela', 'Parque'],
    porte: 'bajo',
    anchoMinimo: 2,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'alta',
    origen: 'Nativa',
    conservacion: 'VULNERABLE',
    restricciones: ['suelo_encharcado'],
    destacado: 'Prefiere suelos rocosos y bien drenados.',
  },
  {
    key: 'pacay',
    lugaresIdeal: ['Parque', 'Bosque urbano', 'Hacienda privada'],
    lugaresAceptables: ['Plaza', 'Corredor biológico'],
    porte: 'alto',
    anchoMinimo: 4,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Introducida',
    restricciones: ['sequia', 'cables_media'],
    destacado: 'Prefiere suelos húmedos y drenados.',
  },
  {
    key: 'chillijchi',
    lugaresIdeal: ['Parque', 'Bosque urbano', 'Corredor biológico'],
    lugaresAceptables: ['Plaza', 'Hacienda privada'],
    porte: 'alto',
    anchoMinimo: 5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    conservacion: 'EN PELIGRO',
    restricciones: ['cables_media', 'espacio_reducido', 'suelo_encharcado'],
    destacado: 'Ideal para suelos drenados con buena humedad.',
  },
  {
    key: 'cedro',
    lugaresIdeal: ['Parque', 'Bosque urbano', 'Corredor biológico'],
    lugaresAceptables: ['Hacienda privada', 'Plaza'],
    porte: 'muy_alto',
    anchoMinimo: 5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    conservacion: 'EN PELIGRO',
    restricciones: ['cables_media', 'cables_baja', 'sequia', 'espacio_reducido'],
    destacado: 'Mejor en suelos arenosos drenados; no tolera sequías fuertes al inicio.',
  },
  {
    key: 'cepillo',
    lugaresIdeal: ['Calle', 'Jardín privado', 'Plazuela'],
    lugaresAceptables: ['Parque', 'Rotonda', 'Plaza'],
    porte: 'arbusto',
    anchoMinimo: 1.5,
    toleranciaContaminacion: 'alta',
    toleranciaCables: 'alta',
    origen: 'Introducida',
    destacado: 'Tolera contaminación; especie melífera.',
  },
  {
    key: 'flor de jupiter',
    lugaresIdeal: ['Jardín privado', 'Parque', 'Plazuela'],
    lugaresAceptables: ['Calle', 'Hacienda privada'],
    porte: 'bajo',
    anchoMinimo: 2,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'alta',
    origen: 'Introducida',
    restricciones: ['suelo_arcilloso_extremo', 'suelo_encharcado'],
    destacado: 'Crecimiento rápido con resistencia a heladas.',
  },
  {
    key: 'caliandra',
    lugaresIdeal: ['Jardín privado', 'Plazuela', 'Hacienda privada'],
    lugaresAceptables: ['Parque'],
    porte: 'arbusto',
    anchoMinimo: 2,
    toleranciaContaminacion: 'baja',
    toleranciaCables: 'alta',
    origen: 'Introducida',
    restricciones: ['calle_alto_trafico', 'contaminacion'],
    destacado: 'Mejor en zonas poco transitadas por vehículos.',
  },
  {
    key: 'jacaranda',
    lugaresIdeal: ['Parque', 'Plaza', 'Plazuela'],
    lugaresAceptables: ['Calle', 'Bosque urbano'],
    porte: 'alto',
    anchoMinimo: 4,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Nativa',
    conservacion: 'VULNERABLE',
    restricciones: ['cables_media', 'heladas'],
    destacado: 'Amplia adaptación; no tolera heladas severas.',
  },
  {
    key: 'nispero',
    lugaresIdeal: ['Jardín privado', 'Parque', 'Plazuela'],
    lugaresAceptables: ['Plaza', 'Hacienda privada'],
    porte: 'bajo',
    anchoMinimo: 2.5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'media',
    origen: 'Introducida',
    restricciones: ['suelo_arcilloso_extremo', 'sequia'],
    destacado: 'Evitar suelos muy arcillosos y sequías extremas.',
  },
  {
    key: 'soto',
    lugaresIdeal: ['Parque', 'Corredor biológico', 'Bosque urbano'],
    lugaresAceptables: ['Plaza', 'Hacienda privada', 'Plazuela'],
    porte: 'medio',
    anchoMinimo: 3,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'media',
    origen: 'Nativa',
    conservacion: 'VULNERABLE',
    restricciones: ['suelo_arcilloso_extremo', 'mucha_sombra'],
    destacado: 'Prefiere suelos drenados y lugares soleados.',
  },
  {
    key: 'cipres vela',
    lugaresIdeal: ['Parque', 'Bosque urbano', 'Hacienda privada'],
    lugaresAceptables: ['Plaza', 'Corredor biológico'],
    porte: 'muy_alto',
    anchoMinimo: 3,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'baja',
    origen: 'Introducida',
    restricciones: ['cables_media', 'cables_baja', 'espacio_reducido'],
    destacado: 'Útil como rompevientos en áreas verdes amplias.',
  },
  {
    key: 'pata de vaca',
    lugaresIdeal: ['Jardín privado', 'Parque', 'Plazuela'],
    lugaresAceptables: ['Calle', 'Plaza', 'Hacienda privada'],
    porte: 'medio',
    anchoMinimo: 2.5,
    toleranciaContaminacion: 'media',
    toleranciaCables: 'media',
    origen: 'Introducida',
    restricciones: ['plagas_pulgones'],
    destacado: 'Muy resistente a sequía; especie paisajística.',
  },
]

export function normalizeSpeciesName(name = '') {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** Resuelve perfil a partir del nombre común (incluye alias antes de coma). */
export function getProfileBySpeciesName(nombreComun = '') {
  const normalizedFull = normalizeSpeciesName(nombreComun)
  const primary = normalizedFull.split(',')[0].trim()

  return (
    speciesPlantingProfiles.find((profile) => profile.key === primary) ||
    speciesPlantingProfiles.find((profile) => profile.key === normalizedFull) ||
    speciesPlantingProfiles.find((profile) => normalizedFull.includes(profile.key)) ||
    null
  )
}

export function getProfileLookupMap() {
  const map = new Map()
  for (const profile of speciesPlantingProfiles) {
    map.set(profile.key, profile)
  }
  return map
}
