/**
 * Detección de especies para las campañas.
 *
 * Origen: el commit b411c11 ("icono jacaranda") ya resolvía esto en
 * `components/mapa/MapaComponent.jsx`, pero ese mapa dejó de estar enrutado y
 * la lógica nunca llegó a verse. Aquí se rescata y se le quita la fragilidad:
 * la versión original comparaba `nombreCientifico === "Jacarandá mimosifolia
 * D. Don"` con igualdad exacta, que falla ante una tilde, un espacio de más o
 * la autoría omitida.
 *
 * Un solo helper alimenta el icono del mapa y la regla de validez del
 * concurso, para que no puedan divergir.
 */

/** minúsculas, sin tildes, espacios colapsados. */
export const normalizarTexto = (texto = "") =>
  String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[(),.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const REGLAS_ESPECIE_JACARANDA = {
  clave: "jacaranda",
  etiqueta: "Jacarandá",
  generos: ["jacaranda"],
  nombresCientificos: ["Jacarandá mimosifolia D. Don", "Jacaranda mimosifolia"],
  nombresComunes: ["jacaranda", "tarco"],
};

/**
 * ¿El árbol coincide con las reglas de especie dadas?
 * Tres vías unidas por OR, porque `nombreCientifico` es texto libre que escribe
 * la app y llega en formas muy distintas.
 */
export const coincideEspecie = (arbol, reglas) => {
  if (!reglas) return true; // sin reglas de especie, no se restringe

  const comun = normalizarTexto(arbol?.nombreComun);
  const cientifico = normalizarTexto(arbol?.nombreCientifico);

  const { generos = [], nombresCientificos = [], nombresComunes = [] } = reglas;

  // 1. Género: primer token del nombre científico.
  const genero = cientifico.split(" ")[0];
  if (genero && generos.some((g) => normalizarTexto(g) === genero)) return true;

  // 2. Lista blanca exacta, ya normalizada.
  if (cientifico && nombresCientificos.some((n) => normalizarTexto(n) === cientifico)) return true;

  // 3. Nombre común por substring.
  if (comun && nombresComunes.some((n) => comun.includes(normalizarTexto(n)))) return true;

  return false;
};

/** Atajo para el caso del concurso de primavera. */
export const esJacaranda = (arbol) => coincideEspecie(arbol, REGLAS_ESPECIE_JACARANDA);

/**
 * ¿El árbol tiene la especie identificada?
 * En los datos reales abundan `nombreComun: ""` y `nombreCientifico: "..."`
 * (literalmente tres puntos). Eso NO es una especie: es un registro sin
 * identificar, y hay que poder distinguirlo de "identificado pero es otra
 * especie".
 */
export const tieneEspecieIdentificada = (arbol) => {
  const comun = normalizarTexto(arbol?.nombreComun);
  const cientifico = normalizarTexto(arbol?.nombreCientifico);
  const vacio = (t) => !t || /^[.\-_/?]+$/.test(t.replace(/\s/g, ""));
  return !(vacio(comun) && vacio(cientifico));
};
