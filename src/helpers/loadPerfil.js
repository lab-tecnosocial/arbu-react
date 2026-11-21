import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/firebase-config"
import { anotarLecturas } from "./leerColeccion"
import { getUltimoMonitoreo } from "./fechaArbol"
import { getEscudoSrcByGrupo } from "../pages/mapav/utils/scoutEscudos"

const TAMANO_LOTE = 30

const idsDe = (...fuentes) => {
  const ids = []
  for (const valor of fuentes) {
    if (Array.isArray(valor)) ids.push(...valor.filter(Boolean))
  }
  return [...new Set(ids)]
}

const esUrl = (valor) => typeof valor === "string" && /^https?:\/\//i.test(valor.trim())

const textoDe = (...valores) =>
  valores.find((valor) => typeof valor === "string" && valor.trim())?.trim() || ""

async function leerDocumento(coleccion, id) {
  try {
    const snapshot = await getDoc(doc(db, coleccion, id))
    if (!snapshot.exists()) return null
    anotarLecturas("servidor", `${coleccion} (perfil)`, 1)
    return { id: snapshot.id, ...snapshot.data() }
  } catch (error) {
    console.error(`[perfil] no se pudo leer ${coleccion}/${id}:`, error)
    return null
  }
}

async function loadDocsPorIds(coleccion, ids) {
  const unicos = [...new Set(ids.filter(Boolean))]
  if (unicos.length === 0) return []

  const lotes = []
  for (let i = 0; i < unicos.length; i += TAMANO_LOTE) {
    lotes.push(unicos.slice(i, i + TAMANO_LOTE))
  }

  try {
    const respuestas = await Promise.all(
      lotes.map((lote) =>
        getDocs(query(collection(db, coleccion), where(documentId(), "in", lote)))
      )
    )
    const docs = respuestas.flatMap((snapshot) =>
      snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }))
    )
    anotarLecturas("servidor", `${coleccion} (perfil por id)`, docs.length)
    return docs
  } catch (error) {
    console.error(`[perfil] no se pudieron leer ids de ${coleccion}:`, error)
    return []
  }
}

async function loadDocsPorCampo(coleccion, campo, valor, operador = "==") {
  if (!valor) return []
  try {
    const snapshot = await getDocs(query(collection(db, coleccion), where(campo, operador, valor)))
    const docs = snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }))
    anotarLecturas("servidor", `${coleccion} (perfil ${campo})`, docs.length)
    return docs
  } catch (error) {
    console.error(`[perfil] no se pudo consultar ${coleccion}.${campo}:`, error)
    return []
  }
}

function fotoDeArbol(arbol) {
  const ultimo = getUltimoMonitoreo(arbol)
  return (
    ultimo?.fotoArbolCompleto ||
    ultimo?.fotografia ||
    arbol?.fotoArbolCompleto ||
    arbol?.fotografia ||
    ""
  )
}

function conFoto(arbol) {
  return { ...arbol, foto: fotoDeArbol(arbol) }
}

function contarEventos(arboles, campo, uid, clavesAutor) {
  let total = 0
  for (const arbol of arboles) {
    const eventos = arbol?.[campo]
    if (!eventos || typeof eventos !== "object" || Array.isArray(eventos)) continue
    for (const evento of Object.values(eventos)) {
      const autor = clavesAutor.map((clave) => evento?.[clave]).find(Boolean)
      if (!autor || autor === uid) total += 1
    }
  }
  return total
}

function unirArboles(listas) {
  const porId = new Map()
  for (const lista of listas) {
    for (const arbol of lista) {
      if (arbol?.id && !porId.has(arbol.id)) porId.set(arbol.id, conFoto(arbol))
    }
  }
  return [...porId.values()]
}

export function fotoPerfilDe(usuario, authUser) {
  const candidatas = [
    usuario?.imageProfileUrl,
    usuario?.imageProfile,
    authUser?.photoURL,
  ]
  return candidatas.find(esUrl) || ""
}

export function portadaDe(usuario) {
  return esUrl(usuario?.cover) ? usuario.cover.trim() : ""
}

export function institucionDe(usuario) {
  return textoDe(
    usuario?.institucion,
    usuario?.grupo,
    usuario?.grupoScout,
    usuario?.nombreInstitucion
  )
}

export function escudoDeInstitucion(institucion) {
  if (!institucion) return null
  const sinPrefijo = institucion.replace(/^grupo\s+scout\s+/i, "").trim()
  return getEscudoSrcByGrupo(sinPrefijo) || getEscudoSrcByGrupo(institucion)
}

export async function loadArbolesDeLista(ids, coleccionPreferida, coleccionRespaldo) {
  const preferidos = await loadDocsPorIds(coleccionPreferida, ids)
  const encontrados = new Set(preferidos.map((arbol) => arbol.id))
  const faltan = ids.filter((id) => !encontrados.has(id))
  const respaldo = faltan.length
    ? await loadDocsPorIds(coleccionRespaldo, faltan)
    : []

  const porId = new Map([...preferidos, ...respaldo].map((arbol) => [arbol.id, arbol]))
  return ids
    .map((id) => porId.get(id))
    .filter(Boolean)
    .map(conFoto)
}

export async function loadPerfilUsuario(uid) {
  const [privado, publico, score] = await Promise.all([
    leerDocumento("usuarios", uid),
    leerDocumento("usuarios_public", uid),
    leerDocumento("scores", uid),
  ])

  const usuario = {
    ...(publico ?? {}),
    ...(privado ?? {}),
    id: uid,
  }

  const idsAdoptados = idsDe(
    privado?.arbolesAdoptados,
    publico?.arbolesAdoptados,
    usuario.arbolesAdoptados
  )
  const idsMapeados = idsDe(
    privado?.arbolesMapeados,
    publico?.arbolesMapeados,
    privado?.arbolesAgregados,
    publico?.arbolesAgregados,
    usuario.arbolesMapeados,
    usuario.arbolesAgregados
  )

  const [adoptadosPorId, mapeadosPorId, mapeadosPorAutor, plantadosPorAutor, adoptadosPorCampo] =
    await Promise.all([
      loadArbolesDeLista(idsAdoptados, "arbolesPlantados", "arbolesMapeados"),
      loadArbolesDeLista(idsMapeados, "arbolesMapeados", "arbolesPlantados"),
      idsMapeados.length ? Promise.resolve([]) : loadDocsPorCampo("arbolesMapeados", "mapeadoPor", uid),
      idsAdoptados.length ? Promise.resolve([]) : loadDocsPorCampo("arbolesPlantados", "plantadoPor", uid),
      idsAdoptados.length
        ? Promise.resolve([])
        : loadDocsPorCampo("arbolesPlantados", "usuariosQueAdoptaron", uid, "array-contains"),
    ])

  const adoptados = unirArboles([adoptadosPorId, plantadosPorAutor, adoptadosPorCampo])
  const mapeados = unirArboles([mapeadosPorId, mapeadosPorAutor.map(conFoto)])
  const todos = unirArboles([adoptados, mapeados])
  const puntos = Number(score?.puntos ?? usuario.puntos ?? 0) || 0

  return {
    usuario,
    puntos,
    adoptados,
    mapeados,
    stats: {
      adoptados: Math.max(idsAdoptados.length, adoptados.length),
      mapeados: Math.max(idsMapeados.length, mapeados.length),
      riegos: contarEventos(todos, "riegos", uid, ["riegoRealizadoPor", "realizadoPor"]),
      monitoreos: contarEventos(todos, "monitoreos", uid, ["monitoreoRealizadoPor", "realizadoPor"]),
    },
  }
}
