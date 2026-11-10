const ALIAS_POR_ETIQUETA = {
  alamo_negro: ['alamo negro'],
  algarrobo: ['algarrobo'],
  caliandra: ['caliandra', 'calliandra'],
  carnavalito: ['carnavalito'],
  cepillo: ['cepillo'],
  chacatea: ['chacatea'],
  clavelina: ['clavelina', 'pajarilla'],
  cucarda: ['cucarda'],
  falso_laurel: ['falso laurel'],
  ficus: ['ficus'],
  flor_de_jupiter: ['flor de jupiter', 'crespon'],
  jacaranda: ['jacaranda'],
  jazmin_paraguayo: ['jazmin paraguayo', 'diamela'],
  magnolia: ['magnolia'],
  molle: ['molle'],
  pacay: ['pacay'],
  palo_verde: ['palo verde', 'cina cina', 'sina sina'],
  tipa: ['tipa'],
}

export function normalizarNombre(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[_./,-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tituloDesdeEtiqueta(etiqueta) {
  const limpio = String(etiqueta ?? '').replace(/_/g, ' ').trim()
  if (!limpio) return 'Desconocida'
  return limpio.replace(/\b\w/g, (c) => c.toUpperCase())
}

function tokensNombre(nombre) {
  return normalizarNombre(nombre)
    .split(',')
    .map((parte) => parte.trim())
    .filter(Boolean)
}

export function buscarEspecieEnCatalogo(etiqueta, especies = []) {
  const alias = ALIAS_POR_ETIQUETA[etiqueta] ?? [normalizarNombre(etiqueta)]
  const lista = Array.isArray(especies) ? especies : []

  for (const clave of alias) {
    const claveNorm = normalizarNombre(clave)
    const exacto = lista.find((especie) =>
      tokensNombre(especie?.nombreComun).some((token) => token === claveNorm),
    )
    if (exacto) return exacto
  }

  for (const clave of alias) {
    const claveNorm = normalizarNombre(clave)
    const parcial = lista.find((especie) => {
      const tokens = tokensNombre(especie?.nombreComun)
      return tokens.some((token) => token.includes(claveNorm) || claveNorm.includes(token))
    })
    if (parcial) return parcial
  }

  return null
}
