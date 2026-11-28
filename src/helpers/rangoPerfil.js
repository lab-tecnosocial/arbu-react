export const RANGOS = [
  { nombre: "Aprendíz", min: 0, insignia: "/insignias/1.svg" },
  { nombre: "Protector", min: 100, insignia: "/insignias/2.svg" },
  { nombre: "Leyenda", min: 500, insignia: "/insignias/3.svg" },
  { nombre: "Ancestro", min: 1500, insignia: "/insignias/4.svg" },
]

export const EJEMPLOS_POSICION = [
  { posicion: 100, tono: "azul" },
  { posicion: 50, tono: "rojo" },
  { posicion: 10, tono: "amarillo" },
  { posicion: 1, tono: "verde" },
]

export function rangoDesdePuntos(puntos) {
  const valor = Number(puntos) || 0
  let actual = RANGOS[0]
  for (const rango of RANGOS) {
    if (valor >= rango.min) actual = rango
  }
  return actual
}

export function tonoPosicion(posicion) {
  const valor = Number(posicion)
  if (!Number.isFinite(valor) || valor < 1) return null
  if (valor === 1) return "verde"
  if (valor <= 10) return "amarillo"
  if (valor <= 50) return "rojo"
  if (valor <= 100) return "azul"
  return null
}
