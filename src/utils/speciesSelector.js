import {
  getProfileBySpeciesName,
  normalizeSpeciesName,
} from '../components/catalogo/data/speciesPlantingProfiles'

const RESTRICTION_MESSAGES = {
  cables_media: 'No recomendada bajo cables de media tensión por su porte.',
  cables_baja: 'Porte elevado; evaluar distancia bajo cables.',
  espacio_reducido: 'Requiere más espacio lateral para desarrollarse.',
  calle_alto_trafico: 'Evitar calles y avenidas de alto tráfico.',
  contaminacion: 'Poca tolerancia a contaminación del aire.',
  suelo_arcilloso: 'No apta para suelos arcillosos.',
  suelo_arcilloso_extremo: 'Poco tolerante a suelos muy arcillosos.',
  suelo_encharcado: 'No tolera encharcamiento del suelo.',
  sequia: 'Poco tolerante a sequías.',
  mucha_sombra: 'No apta para lugares con mucha sombra.',
  heladas: 'Sensible a heladas intensas.',
  flores_toxicas: 'Usar con cautela por flores tóxicas.',
  plagas_pulgones: 'Puede ser susceptible a pulgones.',
  vida_util_corta: 'Vida útil relativamente corta.',
}

const PORTE_LABEL = {
  arbusto: 'arbusto',
  bajo: 'árbol pequeño',
  medio: 'árbol mediano',
  alto: 'árbol grande',
  muy_alto: 'árbol muy grande',
}

const TOLERANCIA_SCORE = { alta: 3, media: 1, baja: -2 }

function appliesRestriction(restriction, answers, profile) {
  const { lugar, ancho, cables } = answers

  switch (restriction) {
    case 'cables_media':
      return cables === 'Media'
    case 'cables_baja':
      return cables === 'Baja' && (profile.porte === 'alto' || profile.porte === 'muy_alto')
    case 'espacio_reducido':
      return typeof ancho === 'number' && ancho > 0 && ancho < (profile.anchoMinimo || 2.5)
    case 'calle_alto_trafico':
      return lugar === 'Calle' || lugar === 'Rotonda'
    case 'contaminacion':
      return lugar === 'Calle' || lugar === 'Rotonda'
    case 'suelo_arcilloso':
    case 'suelo_arcilloso_extremo':
    case 'suelo_encharcado':
    case 'sequia':
    case 'mucha_sombra':
    case 'heladas':
    case 'flores_toxicas':
    case 'plagas_pulgones':
    case 'vida_util_corta':
      return false
    default:
      return false
  }
}

function scoreSpecies(profile, answers) {
  const { lugar, ancho, cables } = answers
  let score = 0
  const reasons = []
  const warnings = []

  if (profile.lugaresIdeal.includes(lugar)) {
    score += 10
    reasons.push(`Ideal para ${lugar.toLowerCase()}.`)
  } else if (profile.lugaresAceptables?.includes(lugar)) {
    score += 5
    reasons.push(`Puede adaptarse a ${lugar.toLowerCase()}.`)
  } else {
    score -= 4
    warnings.push(`No es la opción más indicada para ${lugar.toLowerCase()}.`)
  }

  if (typeof ancho === 'number' && ancho > 0) {
    if (profile.anchoMinimo && ancho >= profile.anchoMinimo) {
      score += 4
      reasons.push(`El ancho disponible (${ancho} m) es adecuado.`)
    } else if (profile.anchoMinimo && ancho < profile.anchoMinimo) {
      score -= 6
      warnings.push(`Se recomienda al menos ${profile.anchoMinimo} m de ancho.`)
    }

    if (ancho <= 2 && (profile.porte === 'arbusto' || profile.porte === 'bajo')) {
      score += 4
      reasons.push('Apta para espacios reducidos.')
    }

    if (ancho <= 2 && (profile.porte === 'alto' || profile.porte === 'muy_alto')) {
      score -= 5
      warnings.push(`Porte de ${PORTE_LABEL[profile.porte]}; poco apta para aceras angostas.`)
    }
  }

  if (cables === 'Media') {
    if (profile.porte === 'arbusto' || profile.porte === 'bajo') {
      score += 4
      reasons.push('Porte compatible con cables de media tensión.')
    }
    if (profile.porte === 'alto' || profile.porte === 'muy_alto') {
      score -= 8
      warnings.push('Porte alto: no recomendada bajo cables de media tensión.')
    }
  }

  if (cables === 'Baja') {
    score += TOLERANCIA_SCORE[profile.toleranciaCables] || 0
    if (profile.toleranciaCables === 'alta') {
      reasons.push('Compatible con cables de baja tensión.')
    }
  }

  if (lugar === 'Calle' || lugar === 'Rotonda') {
    score += TOLERANCIA_SCORE[profile.toleranciaContaminacion] || 0
    if (profile.toleranciaContaminacion === 'alta') {
      reasons.push('Tolera contaminación del aire.')
    }
    if (profile.toleranciaContaminacion === 'baja') {
      score -= 6
      warnings.push('Poca resistencia a contaminación vehicular.')
    }
  }

  if (lugar === 'Corredor biológico' && profile.origen === 'Nativa') {
    score += 3
    reasons.push('Especie nativa, valiosa para corredores biológicos.')
  }

  if (profile.conservacion && ['Parque', 'Bosque urbano', 'Corredor biológico', 'Plaza'].includes(lugar)) {
    score += 2
    reasons.push(`Estado de conservación: ${profile.conservacion}.`)
  }

  for (const restriction of profile.restricciones || []) {
    if (appliesRestriction(restriction, answers, profile)) {
      score -= 8
      warnings.push(RESTRICTION_MESSAGES[restriction] || 'Presenta limitaciones para este sitio.')
    }
  }

  if (profile.destacado && reasons.length < 3) {
    reasons.push(profile.destacado)
  }

  return {
    score: Math.max(0, score),
    reasons: [...new Set(reasons)].slice(0, 3),
    warnings: [...new Set(warnings)].slice(0, 2),
    profile,
  }
}

function buildFallbackProfile(especie) {
  const text = `${especie.recomendablePara || ''} ${especie.descripcion2 || ''}`.toLowerCase()

  let porte = 'medio'
  if (/arbusto|muro|jardinera|angost/.test(text)) porte = 'arbusto'
  else if (/espacios amplios|35 m|20 m|30 m|15 m/.test(text)) porte = 'alto'

  let toleranciaContaminacion = 'media'
  if (/contaminaci[oó]n|tr[aá]fico/.test(text)) {
    toleranciaContaminacion = /poco resistente|evitar su plantaci[oó]n en calles/.test(text) ? 'baja' : 'alta'
  }

  return {
    key: normalizeSpeciesName(especie.nombreComun),
    lugaresIdeal: [],
    lugaresAceptables: [],
    porte,
    anchoMinimo: porte === 'arbusto' ? 1.5 : 3,
    toleranciaContaminacion,
    toleranciaCables: porte === 'alto' ? 'baja' : 'media',
    origen: especie.origen || 'Introducida',
    restricciones: [],
    destacado: especie.descripcion2 || especie.recomendablePara || 'Sin perfil detallado.',
  }
}

export function getCompatibilityLevel(score = 0) {
  if (score >= 20) {
    return {
      label: 'Excelente',
      description: 'Muy buena opción para las condiciones indicadas.',
    }
  }

  if (score >= 15) {
    return {
      label: 'Alta',
      description: 'Buena compatibilidad con el sitio de plantación.',
    }
  }

  if (score >= 10) {
    return {
      label: 'Media',
      description: 'Puede funcionar, pero conviene revisar las advertencias.',
    }
  }

  return {
    label: 'Baja',
    description: 'Compatibilidad limitada; considera otras opciones.',
  }
}

/**
 * @param {Array} especies listado del catálogo (Redux / Firebase)
 * @param {{ lugar?: string, ancho?: number, cables?: string }} answers
 * @param {{ topN?: number, minScore?: number }} options
 */
export function recommendSpecies(especies = [], answers = {}, options = {}) {
  const topN = options.topN || 5
  const minScore = options.minScore ?? 1

  const scored = especies
    .map((especie) => {
      const profile = getProfileBySpeciesName(especie.nombreComun) || buildFallbackProfile(especie)
      const result = scoreSpecies(profile, answers)

      return {
        especie,
        score: result.score,
        reasons: result.reasons,
        warnings: result.warnings,
        hasProfile: Boolean(getProfileBySpeciesName(especie.nombreComun)),
      }
    })
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, topN).map((item, index) => ({
    ...item,
    rank: index + 1,
  }))
}

export default { recommendSpecies, getCompatibilityLevel }
