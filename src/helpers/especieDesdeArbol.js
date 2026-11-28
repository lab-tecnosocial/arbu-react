const normalizar = (valor) =>
  String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

export function especieDesdeArbol(arbol, especies = []) {
  if (!arbol || !especies.length) return null

  const comun = normalizar(arbol.nombreComun)
  const cientifico = normalizar(arbol.nombreCientifico)
  if (!comun && !cientifico) return null

  const exacta = especies.find((especie) => {
    const eComun = normalizar(especie.nombreComun)
    const eCientifico = normalizar(especie.nombreCientifico)
    return (comun && eComun === comun) || (cientifico && eCientifico === cientifico)
  })
  if (exacta) return exacta

  return especies.find((especie) => {
    const eComun = normalizar(especie.nombreComun)
    const eCientifico = normalizar(especie.nombreCientifico)
    return (
      (comun && eComun && (eComun.includes(comun) || comun.includes(eComun))) ||
      (cientifico && eCientifico && (eCientifico.includes(cientifico) || cientifico.includes(eCientifico)))
    )
  }) ?? null
}
