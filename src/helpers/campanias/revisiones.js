/**
 * Composición del juicio humano sobre los registros derivados.
 *
 * Lo derivable (especie, municipio, fechas, fotos) NO se guarda: se recalcula.
 * Lo que un humano decide SÍ se guarda, y es lo único que vive en Firestore.
 */

export const VEREDICTO = {
  VALIDO: "valido",
  INVALIDO: "invalido",
  DUPLICADO: "duplicado",
};

export const ESTADO_PARTICIPANTE = {
  ACTIVO: "activo",
  EN_VERIFICACION: "en_verificacion",
  DESCALIFICADO: "descalificado",
};

/** Motivos de invalidez de un registro concreto. */
export const MOTIVO_INVALIDO = {
  ESPECIE_NO_ELEGIBLE: "Especie no elegible",
  NO_EN_FLOR: "No está en flor",
  FUERA_DE_AREA: "Fuera del área del concurso",
  FUERA_DE_PERIODO: "Fuera del periodo",
  SIN_COORDENADAS: "Sin coordenadas",
  DATOS_INSUFICIENTES: "Datos insuficientes",
  DUPLICADO_MISMO_EJEMPLAR: "Repetición del mismo ejemplar",
  OTRO: "Otro",
};

/** Motivos de descalificación de una PERSONA, como los plantean las bases. */
export const MOTIVO_DESCALIFICACION = {
  INFORMACION_FALSA: "Información falsa",
  FOTO_IA: "Fotografías generadas por IA",
  UBICACION_MANIPULADA: "Manipulación de ubicaciones",
  REGISTRO_MASIVO: "Registros masivos que no corresponden a árboles reales",
  DUPLICACION_INTENCIONAL: "Duplicaciones intencionales",
};

/**
 * Aplica revisiones y descalificaciones sobre los registros derivados.
 *
 * Reglas de composición:
 *  - Si hay revisión humana, manda sobre el veredicto automático.
 *  - Si la persona está descalificada, ninguno de sus registros cuenta.
 *  - Sin revisión, vale lo que dijo el evaluador automático.
 *
 * @param {Array} registros salida de registrosDeCampania
 * @param {Map|object} revisiones indexadas por `clave` del registro
 * @param {Map|object} participantes indexados por uid
 */
export const aplicarRevisiones = (registros = [], revisiones, participantes) => {
  const getRevision = (clave) =>
    revisiones instanceof Map ? revisiones.get(clave) : revisiones?.[clave];
  const getParticipante = (uid) =>
    participantes instanceof Map ? participantes.get(uid) : participantes?.[uid];

  return registros.map((registro) => {
    const revision = getRevision(registro.clave) ?? null;
    const participante = getParticipante(registro.uid) ?? null;
    const descalificado = participante?.estado === ESTADO_PARTICIPANTE.DESCALIFICADO;

    const validoAuto = registro.valido;
    const validoRevisado = revision ? revision.veredicto === VEREDICTO.VALIDO : validoAuto;

    return {
      ...registro,
      revision,
      participante,
      descalificado,
      revisado: Boolean(revision),
      validoAuto,
      validoFinal: descalificado ? false : validoRevisado,
    };
  });
};

/** Índice por uid con los conteos que necesita el ranking. */
export const agruparPorParticipante = (registrosFinales = []) => {
  const porUid = new Map();

  for (const registro of registrosFinales) {
    if (!registro.uid) continue;

    if (!porUid.has(registro.uid)) {
      porUid.set(registro.uid, {
        uid: registro.uid,
        registros: [],
        validos: 0,
        invalidos: 0,
        pendientes: 0,
        descalificado: registro.descalificado,
      });
    }

    const entrada = porUid.get(registro.uid);
    entrada.registros.push(registro);
    if (registro.validoFinal) entrada.validos += 1;
    else if (registro.revisado) entrada.invalidos += 1;
    else entrada.pendientes += 1;
  }

  return porUid;
};
