import { getAnalytics, isSupported, logEvent, setUserId } from 'firebase/analytics'
import { app } from '../firebase/firebase-config'

/** Nombres de evento GA4 (uno por acción). */
export const AnalyticsEvents = {
  VER_ARBOL_MAPA: 'ver_arbol_mapa',
  VER_GUIA_PLANTACION: 'ver_guia_plantacion',
  VER_GUIA_SELECCION_ESPECIES: 'ver_guia_seleccion_especies',
  VER_CATALOGO_ESPECIES: 'ver_catalogo_especies',
  DESCARGA_ANDROID: 'descarga_android',
  DESCARGA_IOS: 'descarga_ios',
  CLIC_FACEBOOK: 'clic_facebook',
  CLIC_INSTAGRAM: 'clic_instagram',
  CLIC_TIKTOK: 'clic_tiktok',
}

let analyticsInstance = null
let analyticsInitPromise = null

async function getAnalyticsReady() {
  if (typeof window === 'undefined') return null
  if (analyticsInstance) return analyticsInstance
  if (!analyticsInitPromise) {
    analyticsInitPromise = isSupported()
      .then((supported) => {
        if (!supported || !import.meta.env.VITE_MEASUREMENT_ID) return null
        analyticsInstance = getAnalytics(app)
        return analyticsInstance
      })
      .catch(() => null)
  }
  return analyticsInitPromise
}

export async function setAnalyticsUserId(uid) {
  const analytics = await getAnalyticsReady()
  if (!analytics) return
  try {
    setUserId(analytics, uid ?? null)
  } catch {
    /* analytics no disponible */
  }
}

export async function trackAnalyticsEvent(eventName, params = {}) {
  const analytics = await getAnalyticsReady()
  if (!analytics) return
  try {
    logEvent(analytics, eventName, params)
  } catch {
    /* entorno sin medición */
  }
}

export function trackVerArbolMapa(arbol, origen = 'mapa') {
  void trackAnalyticsEvent(AnalyticsEvents.VER_ARBOL_MAPA, {
    origen,
    arbol_id: arbol?.id ?? '',
    nombre_comun: arbol?.nombreComun ?? '',
  })
}

export function trackVerGuiaPlantacion(origen = 'aprende') {
  void trackAnalyticsEvent(AnalyticsEvents.VER_GUIA_PLANTACION, { origen })
}

export function trackVerGuiaSeleccion(origen = 'aprende') {
  void trackAnalyticsEvent(AnalyticsEvents.VER_GUIA_SELECCION_ESPECIES, { origen })
}

export function trackVerCatalogoEspecies(origen = 'aprende') {
  void trackAnalyticsEvent(AnalyticsEvents.VER_CATALOGO_ESPECIES, { origen })
}

export function trackDescargaAndroid(origen) {
  void trackAnalyticsEvent(AnalyticsEvents.DESCARGA_ANDROID, { origen })
}

export function trackDescargaIos(origen) {
  void trackAnalyticsEvent(AnalyticsEvents.DESCARGA_IOS, { origen })
}

export function trackClicFacebook(origen) {
  void trackAnalyticsEvent(AnalyticsEvents.CLIC_FACEBOOK, { origen })
}

export function trackClicInstagram(origen) {
  void trackAnalyticsEvent(AnalyticsEvents.CLIC_INSTAGRAM, { origen })
}

export function trackClicTiktok(origen) {
  void trackAnalyticsEvent(AnalyticsEvents.CLIC_TIKTOK, { origen })
}

/** Registra la descarga según URL de Play Store o App Store. */
export function trackDescargaPorUrl(url, origen) {
  const href = String(url ?? '')
  if (href.includes('play.google.com')) {
    trackDescargaAndroid(origen)
    return
  }
  if (href.includes('apps.apple.com')) {
    trackDescargaIos(origen)
    return
  }
}

/** Registra clic en red social según URL. */
export function trackSocialPorUrl(url, origen) {
  const href = String(url ?? '').toLowerCase()
  if (href.includes('facebook.com')) {
    trackClicFacebook(origen)
    return
  }
  if (href.includes('instagram.com')) {
    trackClicInstagram(origen)
    return
  }
  if (href.includes('tiktok.com')) {
    trackClicTiktok(origen)
    return
  }
}
