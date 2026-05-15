// Simple species selector based on species.recomendablePara and user answers
// Exports: recommendSpecies(especies, answers, options)
// answers: { lugar: 'Calle'|'Parque'|..., ancho?: number, cables?: 'No'|'Baja'|'Media' }
// options: { topN: number }

function normalize(text = '') {
  return String(text).toLowerCase();
}

function scoreForArea(recomendablePara, lugar, ancho) {
  const text = normalize(recomendablePara || '');
  const place = normalize(lugar || '');
  let score = 0;

  if (!text) return 0;

  // direct keyword matches
  const keywords = {
    aceras: /aceras?/,
    'aceras amplias': /aceras amplias/,
    'aceras angostas': /aceras angostas|aceras angosta/,
    parques: /parques?/,
    jardines: /jardines?/,
    plaza: /plaza/,
    plazuela: /plazuela/,
    rotonda: /rotonda/,
    'areas verdes': /areas? verdes?/,
    'areas amplias': /espacios amplios|areas amplias|espacios amplios/,
    'restauracion': /restauraci[oó]n|restauraci?n/,
    'jardineras': /jardinera|jardineras?/,
    'corredor biologico': /corredor biol[oó]gico/,
  };

  // award points when species recommends the current place
  for (const key of Object.keys(keywords)) {
    if (keywords[key].test(text)) {
      if (place.includes(key.split(' ')[0]) || key === place) {
        score += 5;
      } else if (key === 'areas amplias' && /parque|espacio|amplio/.test(place)) {
        score += 4;
      } else if (key === 'aceras angostas' && /calle|acera/.test(place)) {
        // consider width if provided
        if (typeof ancho === 'number') {
          if (ancho <= 2) score += 5; // narrow sidewalks
          else score += 1; // less ideal
        } else {
          score += 3;
        }
      }
    }
  }

  // fallback: if text mentions 'recomendable' and place keyword appears
  if (/recomendable/.test(text) && place && text.includes(place)) score += 3;

  return score;
}

function scoreForCables(recomendablePara, cables, lugar) {
  const text = normalize(recomendablePara || '');
  const place = normalize(lugar || '');
  let score = 0;

  if (!cables || cables === 'No') return 0;

  // if medium tension lines above, prefer species recommended for parks/areas amplias
  if (cables === 'Media') {
    if (/parque|espacio|areas? amplias|plaza/.test(text)) score += 3;
    if (/acera|calle/.test(text)) score -= 3;
  }

  if (cables === 'Baja') {
    if (/aceras?/.test(text)) score += 1;
  }

  return score;
}

export function recommendSpecies(especies = [], answers = {}, options = {}) {
  const { lugar = '', ancho, cables } = answers;
  const topN = options.topN || 5;

  const scored = especies.map((s) => {
    const base = s.recomendablePara || '';
    let score = 0;
    score += scoreForArea(base, lugar, ancho);
    score += scoreForCables(base, cables, lugar);

    // small boost for native species when recommending for public planting
    if (/nativa/.test((s.origen || '').toLowerCase()) && /parque|areas? verdes|corredor/.test(lugar.toLowerCase())) {
      score += 1;
    }

    return { especie: s, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // return topN species with score
  return scored.slice(0, topN).map((r) => ({ ...r }));
}

export default { recommendSpecies };
