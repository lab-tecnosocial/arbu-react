const RANGOS = [
  { nombre: "Aprendiz", min: 0 },
  { nombre: "Explorador", min: 100 },
  { nombre: "Cuidador", min: 500 },
  { nombre: "Guardián", min: 1500 },
  { nombre: "Leyenda", min: 5000 },
]

export function rangoDesdePuntos(puntos) {
  const valor = Number(puntos) || 0
  let actual = RANGOS[0]
  for (const rango of RANGOS) {
    if (valor >= rango.min) actual = rango
  }
  return actual.nombre
}
