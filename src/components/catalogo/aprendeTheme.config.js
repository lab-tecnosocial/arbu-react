/**
 * Bandera del modo noche para el módulo /aprende.
 * Cambiar a `true` para activarlo en todo el módulo.
 *
 * Más adelante el interruptor del home reemplazará esta constante
 * leyendo preferencia de usuario (contexto, Redux o localStorage).
 */
export const APRENDE_NIGHT_MODE_ENABLED = true

/** Clase CSS aplicada al contenedor cuando el modo noche está activo */
export const APRENDE_NIGHT_MODE_CLASS = 'catalogo-main--night'

export const APRENDE_LAB_LOGO_LIGHT = 'tecnolab.png'
export const APRENDE_LAB_LOGO_DARK = 'lab-oscuro.webp'

export const getAprendeLabLogo = (nightModeEnabled = APRENDE_NIGHT_MODE_ENABLED) =>
  nightModeEnabled ? APRENDE_LAB_LOGO_DARK : APRENDE_LAB_LOGO_LIGHT
