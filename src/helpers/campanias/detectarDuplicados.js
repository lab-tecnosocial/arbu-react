/**
 * Detección de registros que podrían ser el mismo ejemplar.
 *
 * ⚠️ REGLA DE LAS BASES, NO TOCAR: si personas DISTINTAS mapean el mismo árbol,
 * el registro es válido para todas ellas. Aquí eso NO se deduplica nunca; solo
 * se informa. Lo sospechoso es que UNA MISMA persona registre el mismo
 * ejemplar varias veces.
 */

/**
 * Distancia en metros (haversine). No se usa @turf/distance a propósito: con
 * pnpm habría que declarar el subpaquete (ver el gotcha de dependencias
 * fantasma en CLAUDE.md) y esto son ocho líneas.
 */
const metros = (a, b) => {
  const R = 6371000;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.latitud - a.latitud);
  const dLon = rad(b.longitud - a.longitud);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitud)) * Math.cos(rad(b.latitud)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export const detectarDuplicados = (registros = [], { radioMetros = 15, ventanaHoras = 6 } = {}) => {
  const conCoords = registros.filter((r) => Number.isFinite(r.latitud) && Number.isFinite(r.longitud));

  // --- Sospechosos: mismo uid, misma especie, cerca y seguidos en el tiempo ---
  const porUid = new Map();
  for (const registro of conCoords) {
    if (!registro.uid) continue;
    if (!porUid.has(registro.uid)) porUid.set(registro.uid, []);
    porUid.get(registro.uid).push(registro);
  }

  const gruposSospechosos = [];
  const porArbol = {};
  const ventanaMs = ventanaHoras * 60 * 60 * 1000;

  for (const [uid, propios] of porUid) {
    const ordenados = [...propios].sort((a, b) => (a.fecha?.getTime() ?? 0) - (b.fecha?.getTime() ?? 0));
    const visitados = new Set();

    for (let i = 0; i < ordenados.length; i += 1) {
      if (visitados.has(ordenados[i].clave)) continue;

      const grupo = [ordenados[i]];
      visitados.add(ordenados[i].clave);

      for (let j = i + 1; j < ordenados.length; j += 1) {
        if (visitados.has(ordenados[j].clave)) continue;

        const cercaDeAlguno = grupo.some((miembro) => {
          const dt = Math.abs((ordenados[j].fecha?.getTime() ?? 0) - (miembro.fecha?.getTime() ?? 0));
          return dt <= ventanaMs && metros(miembro, ordenados[j]) <= radioMetros;
        });

        if (cercaDeAlguno) {
          grupo.push(ordenados[j]);
          visitados.add(ordenados[j].clave);
        }
      }

      if (grupo.length > 1) {
        const id = `${uid}__${grupo[0].clave}`;
        grupo.forEach((r) => {
          porArbol[r.clave] = id;
        });
        gruposSospechosos.push({
          id,
          uid,
          claves: grupo.map((r) => r.clave),
          registros: grupo,
          distanciaMaxM: Math.max(
            ...grupo.flatMap((a) => grupo.map((b) => (a === b ? 0 : metros(a, b))))
          ),
          spanMinutos:
            (Math.max(...grupo.map((r) => r.fecha?.getTime() ?? 0)) -
              Math.min(...grupo.map((r) => r.fecha?.getTime() ?? 0))) /
            60000,
        });
      }
    }
  }

  // --- Compartidos: mismo punto, personas distintas. VÁLIDO para todas. ---
  const celdas = new Map();
  for (const registro of conCoords) {
    const clave = `${registro.latitud.toFixed(5)},${registro.longitud.toFixed(5)}`;
    if (!celdas.has(clave)) celdas.set(clave, []);
    celdas.get(clave).push(registro);
  }

  const gruposCompartidos = [];
  for (const [, enCelda] of celdas) {
    const uids = new Set(enCelda.map((r) => r.uid).filter(Boolean));
    if (uids.size > 1) {
      gruposCompartidos.push({
        claves: enCelda.map((r) => r.clave),
        uids: [...uids],
      });
    }
  }

  // --- Señales por participante, para el panel de alertas ---
  const flagsParticipante = {};
  for (const [uid, propios] of porUid) {
    const porHora = new Map();
    for (const r of propios) {
      const hora = r.fecha ? Math.floor(r.fecha.getTime() / 3600000) : null;
      if (hora === null) continue;
      porHora.set(hora, (porHora.get(hora) ?? 0) + 1);
    }
    const coordsExactas = new Set(propios.map((r) => `${r.latitud},${r.longitud}`));
    flagsParticipante[uid] = {
      maxPorHora: porHora.size ? Math.max(...porHora.values()) : 0,
      coordsIdenticas: propios.length - coordsExactas.size,
      total: propios.length,
    };
  }

  return { gruposSospechosos, porArbol, gruposCompartidos, flagsParticipante };
};
