import { tieneEspecieIdentificada } from "./especies";

/**
 * Precalificación automática de un registro.
 *
 * Separa lo objetivo (¿cae dentro del área? ¿dentro del periodo?) de lo
 * heurístico (¿está en flor?). Solo lo objetivo bloquea; lo demás es una
 * advertencia que manda el registro a la cola de revisión humana.
 */

export const SEVERIDAD = { BLOQUEANTE: "bloqueante", ADVERTENCIA: "advertencia" };

export const VEREDICTO_AUTO = { APTO: "apto", DUDOSO: "dudoso", NO_APTO: "no_apto" };

export const REGLAS = {
  COORDENADAS: {
    clave: "COORDENADAS",
    severidad: SEVERIDAD.BLOQUEANTE,
    mensaje: "Sin coordenadas válidas",
    cumple: (r) => r.motivos.tieneUbicacion,
  },
  AREA: {
    clave: "AREA",
    severidad: SEVERIDAD.BLOQUEANTE,
    mensaje: "Fuera del área del concurso",
    cumple: (r) => r.motivos.municipioAdmitido,
  },
  PERIODO: {
    clave: "PERIODO",
    severidad: SEVERIDAD.BLOQUEANTE,
    mensaje: "Fuera del periodo",
    cumple: (r) => r.motivos.enPeriodo,
  },
  // Advertencia y no bloqueante a propósito: en los datos reales abundan los
  // registros sin especie (`nombreCientifico: "..."`). Si esto descartara
  // solo, se perderían jacarandás legítimos mal etiquetados. Que lo mire una
  // persona con la foto delante.
  ESPECIE: {
    clave: "ESPECIE",
    severidad: SEVERIDAD.ADVERTENCIA,
    mensaje: "La especie no coincide o no está identificada",
    cumple: (r) => r.motivos.especieAdmitida,
  },
  // La inferencia es especie objetivo + foto de flor. Un jacarandá en flor sin
  // foto de flor existe: nunca debe invalidar por sí sola.
  EN_FLOR: {
    clave: "EN_FLOR",
    severidad: SEVERIDAD.ADVERTENCIA,
    mensaje: "No hay foto de flor que lo respalde",
    cumple: (r) => r.motivos.enFlor,
  },
  DATOS_MINIMOS: {
    clave: "DATOS_MINIMOS",
    severidad: SEVERIDAD.ADVERTENCIA,
    mensaje: "Faltan fotos o datos mínimos",
    cumple: (r) => r.motivos.fotosCompletas,
  },
  PRECISION_SOSPECHOSA: {
    clave: "PRECISION_SOSPECHOSA",
    severidad: SEVERIDAD.ADVERTENCIA,
    mensaje: "Coordenadas con muy poca precisión",
    cumple: (r) => {
      const decimales = (n) => String(n ?? "").split(".")[1]?.length ?? 0;
      return Math.min(decimales(r.latitud), decimales(r.longitud)) > 3;
    },
  },
};

export const evaluarRegistro = (registro, { grupoDuplicado = null } = {}) => {
  const incumplidas = Object.values(REGLAS)
    .filter((regla) => !regla.cumple(registro))
    .map(({ clave, severidad, mensaje }) => ({ clave, severidad, mensaje }));

  if (grupoDuplicado) {
    incumplidas.push({
      clave: "POSIBLE_DUPLICADO",
      severidad: SEVERIDAD.ADVERTENCIA,
      mensaje: "Podría ser el mismo ejemplar que otro registro suyo",
    });
  }

  const tieneBloqueante = incumplidas.some((r) => r.severidad === SEVERIDAD.BLOQUEANTE);

  return {
    veredicto: tieneBloqueante
      ? VEREDICTO_AUTO.NO_APTO
      : incumplidas.length
        ? VEREDICTO_AUTO.DUDOSO
        : VEREDICTO_AUTO.APTO,
    reglasIncumplidas: incumplidas,
    especieIdentificada: tieneEspecieIdentificada(registro),
    completitud: registro.completitud,
  };
};

/** Evalúa una lista completa, añadiendo `auto` a cada registro. */
export const evaluarRegistros = (registros = [], { porArbol = {} } = {}) =>
  registros.map((registro) => ({
    ...registro,
    auto: evaluarRegistro(registro, { grupoDuplicado: porArbol[registro.clave] ?? null }),
  }));
