import { agruparPorParticipante } from "./revisiones";

/**
 * Tabla de posiciones del concurso.
 *
 * Los criterios salen literalmente de las bases:
 *  1. Más registros válidos.
 *  2. "Mayor número de árboles válidos registrados en más de un municipio".
 *  3. "Mayor proporción de registros completos y verificables".
 *  4. "Quien haya alcanzado primero el total de registros válidos".
 *
 * El criterio 2 admite DOS lecturas y puede decidir quién gana, así que se
 * calculan las dos y se muestran ambas; cuál manda lo fija la campaña en
 * `reglas.criterioDesempate1`. Esto debe cerrarse por escrito con la
 * organización ANTES del cierre, no después de ver quién ganaría con cada una.
 */

export const CRITERIO_DESEMPATE_1 = {
  /** (a) Número de municipios distintos con al menos un válido. */
  MUNICIPIOS_DISTINTOS: "municipiosDistintos",
  /** (b) Válidos fuera del municipio donde más registró. */
  FUERA_DEL_PRINCIPAL: "validosFueraDelPrincipal",
};

const compararCon = (criterio1) => (a, b) => {
  const pasos = [
    { criterio: "Registros válidos", propio: a.validos, rival: b.validos, orden: "desc" },
    criterio1 === CRITERIO_DESEMPATE_1.FUERA_DEL_PRINCIPAL
      ? {
        criterio: "Válidos fuera del municipio principal",
        propio: a.validosFueraDelPrincipal,
        rival: b.validosFueraDelPrincipal,
        orden: "desc",
      }
      : {
        criterio: "Municipios distintos cubiertos",
        propio: a.nMunicipios,
        rival: b.nMunicipios,
        orden: "desc",
      },
    {
      criterio: "Proporción de registros completos",
      propio: Number(a.completitudMedia.toFixed(4)),
      rival: Number(b.completitudMedia.toFixed(4)),
      orden: "desc",
    },
    {
      criterio: "Alcanzó primero ese total",
      propio: a.fechaAlcanzoTotal?.getTime() ?? Infinity,
      rival: b.fechaAlcanzoTotal?.getTime() ?? Infinity,
      orden: "asc",
    },
  ];

  for (const paso of pasos) {
    if (paso.propio === paso.rival) continue;
    const gana = paso.orden === "desc" ? paso.propio > paso.rival : paso.propio < paso.rival;
    return { resultado: gana ? -1 : 1, paso };
  }

  return { resultado: 0, paso: null };
};

export const calcularRanking = (
  registrosFinales = [],
  { usuarios = new Map(), criterioDesempate1 = CRITERIO_DESEMPATE_1.MUNICIPIOS_DISTINTOS, aplicarDescalificaciones = true } = {}
) => {
  const porUid = agruparPorParticipante(registrosFinales);

  const filas = [...porUid.values()]
    .filter((p) => (aplicarDescalificaciones ? !p.descalificado : true))
    .map((participante) => {
      const validos = participante.registros.filter((r) => r.validoFinal);

      const porMunicipio = new Map();
      validos.forEach((r) => {
        const nombre = r.municipio?.nombre ?? "Sin municipio";
        porMunicipio.set(nombre, (porMunicipio.get(nombre) ?? 0) + 1);
      });

      const municipios = [...porMunicipio.keys()].filter((m) => m !== "Sin municipio");
      const municipioPrincipal =
        [...porMunicipio.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

      const completitudMedia = validos.length
        ? validos.reduce((acc, r) => acc + r.completitud, 0) / validos.length
        : 0;

      // Momento en que alcanzó su total actual de válidos: el válido n-ésimo.
      const fechasValidas = validos
        .map((r) => r.fecha)
        .filter(Boolean)
        .sort((a, b) => a - b);

      const usuario = usuarios instanceof Map
        ? usuarios.get(participante.uid)
        : usuarios?.[participante.uid];

      return {
        uid: participante.uid,
        nombre: usuario?.nombre || "(sin nombre)",
        imageProfile: usuario?.imageProfile || null,
        institucion: usuario?.institucion || "",
        validos: validos.length,
        invalidos: participante.invalidos,
        pendientes: participante.pendientes,
        total: participante.registros.length,
        municipios,
        nMunicipios: municipios.length,
        municipioPrincipal,
        validosFueraDelPrincipal: validos.filter(
          (r) => r.municipio?.nombre && r.municipio.nombre !== municipioPrincipal
        ).length,
        completitudMedia,
        fechaAlcanzoTotal: fechasValidas[fechasValidas.length - 1] ?? null,
        descalificado: participante.descalificado,
      };
    });

  const comparar = compararCon(criterioDesempate1);

  // Orden estable: ante un empate en los cuatro criterios se usa el uid, pero
  // la fila queda marcada para que nadie gane en silencio por orden de claves.
  filas.sort((a, b) => {
    const { resultado } = comparar(a, b);
    return resultado !== 0 ? resultado : a.uid.localeCompare(b.uid);
  });

  return filas.map((fila, i) => {
    const anterior = filas[i - 1];
    const { paso, resultado } = anterior ? comparar(anterior, fila) : { paso: null, resultado: 0 };

    return {
      ...fila,
      posicion: i + 1,
      // Por qué esta fila va detrás de la anterior, en datos: la UI lo redacta.
      desempate: anterior
        ? {
          rival: anterior.nombre,
          rivalUid: anterior.uid,
          empateTotal: resultado === 0,
          criterio: paso?.criterio ?? null,
          valorRival: paso?.rival ?? null,
          valorPropio: paso?.propio ?? null,
        }
        : null,
    };
  });
};
