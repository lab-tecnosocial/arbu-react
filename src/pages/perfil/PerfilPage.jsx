import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Droplets, Heart, MapPinned, Stethoscope } from "lucide-react"
import Footer from "../../components/footer/Footer"
import DetailEspecie from "../../components/catalogo/DetailEspecie"
import { CardTree } from "../mapav/components/CardTree/CardTree"
import { setPanelState, setSelectedTree } from "../../actions/mapaActions"
import {
  setActiveEspecie,
  setHideDetailEspecie,
  startLoadEspeciesCatalogo,
} from "../../actions/catalogoActions"
import { especieDesdeArbol } from "../../helpers/especieDesdeArbol"
import {
  escudoDeInstitucion,
  fotoPerfilDe,
  institucionDe,
  loadPerfilUsuario,
  portadaDe,
} from "../../helpers/loadPerfil"
import { rangoDesdePuntos } from "../../helpers/rangoPerfil"
import { useTheme } from "../../context/ThemeContext"
import { APRENDE_NIGHT_MODE_CLASS } from "../../components/catalogo/aprendeTheme.config"
import "../../components/catalogo/aprende-theme.css"
import { MedallaRango } from "./MedallaRango"
import styles from "./PerfilPage.module.css"

const PerfilPage = () => {
  const dispatch = useDispatch()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const authUser = useSelector((state) => state.auth.user)
  const { especies } = useSelector((state) => state.catalogo)
  const [estado, setEstado] = useState({ cargando: true, error: null, datos: null })

  useEffect(() => {
    dispatch(startLoadEspeciesCatalogo())
  }, [dispatch])

  useEffect(() => {
    let vivo = true
    if (!authUser?.uid) return undefined

    setEstado({ cargando: true, error: null, datos: null })
    loadPerfilUsuario(authUser.uid)
      .then((datos) => {
        if (vivo) setEstado({ cargando: false, error: null, datos })
      })
      .catch((error) => {
        console.error(error)
        if (vivo) {
          setEstado({
            cargando: false,
            error: "No se pudo cargar el perfil. Inténtalo de nuevo.",
            datos: null,
          })
        }
      })

    return () => {
      vivo = false
      dispatch(setHideDetailEspecie())
      dispatch(setPanelState("CLOSE"))
      dispatch(setSelectedTree(null, {}))
    }
  }, [authUser?.uid, dispatch])

  const abrirDetalle = (arbol, index) => {
    const especie = especieDesdeArbol(arbol, especies)
    if (especie) {
      dispatch(setPanelState("CLOSE"))
      dispatch(setActiveEspecie(especie))
      return
    }
    dispatch(setHideDetailEspecie())
    dispatch(setSelectedTree(index, arbol, "perfil"))
    dispatch(setPanelState("OPEN"))
  }

  const { cargando, error, datos } = estado
  const usuario = datos?.usuario ?? {}
  const nombre = usuario.nombre || authUser?.displayName || "Sin nombre"
  const institucion = institucionDe(usuario)
  const foto = fotoPerfilDe(usuario, authUser)
  const portada = portadaDe(usuario)
  const escudo = escudoDeInstitucion(institucion)
  const puntos = datos?.puntos ?? 0
  const rango = rangoDesdePuntos(puntos)
  const stats = datos?.stats ?? { riegos: 0, monitoreos: 0, adoptados: 0, mapeados: 0 }

  return (
    <div className={styles.page}>
      <div
        className={["catalogo-main", isDark ? APRENDE_NIGHT_MODE_CLASS : "", styles.detalleAprende]
          .filter(Boolean)
          .join(" ")}
      >
        <DetailEspecie />
      </div>
      <aside className={styles.detalle}>
        <CardTree />
      </aside>
      <div className={styles.contenido}>
        {cargando ? (
          <p className={styles.estado} role="status">Cargando perfil…</p>
        ) : error ? (
          <p className={styles.estado} role="alert">{error}</p>
        ) : (
          <>
            <section className={styles.hero}>
              <div className={styles.portada} aria-hidden>
                {portada ? (
                  <img src={portada} alt="" className={styles.portadaFoto} />
                ) : null}
              </div>

              <div className={styles.cuerpo}>
                <div className={styles.identidad}>
                  {escudo ? (
                    <img className={styles.escudo} src={escudo} alt={institucion} />
                  ) : (
                    <span className={styles.identidadLado} />
                  )}
                  {foto ? (
                    <img
                      className={styles.avatar}
                      src={foto}
                      alt={`Foto de ${nombre}`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={styles.avatarVacio} aria-hidden>
                      {nombre.slice(0, 1)}
                    </div>
                  )}
                  <span className={styles.identidadLado} />
                </div>

                <h1 className={styles.nombre}>{nombre}</h1>
                {institucion ? <p className={styles.institucion}>{institucion}</p> : null}

                <div className={styles.clasificacion}>
                  <h2>Clasificación</h2>
                  <div className={styles.rangoFila}>
                    <span className={styles.puntos}>{puntos} pts</span>
                    <MedallaRango rango={rango} />
                    <span className={styles.rangoNombre}>{rango}</span>
                  </div>
                </div>

                <div className={styles.estadisticas}>
                  <h2>Estadísticas</h2>
                  <div className={styles.statsGrid}>
                    <Stat icon={<Heart size={22} strokeWidth={1.75} />} valor={stats.adoptados} etiqueta="Adoptados" />
                    <Stat icon={<Stethoscope size={22} strokeWidth={1.75} />} valor={stats.monitoreos} etiqueta="Monitoreos" />
                    <Stat icon={<Droplets size={22} strokeWidth={1.75} />} valor={stats.riegos} etiqueta="Riegos" />
                    <Stat icon={<MapPinned size={22} strokeWidth={1.75} />} valor={stats.mapeados} etiqueta="Mapeados" />
                  </div>
                </div>
              </div>
            </section>

            <div className={styles.listas}>
              <ListaArboles
                titulo="Árboles Adoptados"
                vacio="No tienes árboles adoptados aún…"
                arboles={datos.adoptados}
                onDetalle={abrirDetalle}
              />
              <ListaArboles
                titulo="Árboles Mapeados"
                vacio="No tienes árboles mapeados aún…"
                arboles={datos.mapeados}
                onDetalle={abrirDetalle}
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

const Stat = ({ icon, valor, etiqueta }) => (
  <div className={styles.stat}>
    <span className={styles.statIcon}>{icon}</span>
    <strong>{valor}</strong>
    <span>{etiqueta}</span>
  </div>
)

const ListaArboles = ({ titulo, vacio, arboles, onDetalle }) => (
  <section className={styles.listaBloque}>
    <h2>{titulo}</h2>
    {arboles.length === 0 ? (
      <p className={styles.vacio}>{vacio}</p>
    ) : (
      <ul className={styles.carrusel}>
        {arboles.map((arbol, index) => (
          <li key={arbol.id} className={styles.tarjeta}>
            {arbol.foto ? (
              <img className={styles.tarjetaFoto} src={arbol.foto} alt="" />
            ) : (
              <div className={styles.tarjetaFotoVacia} />
            )}
            <strong>{arbol.nombreComun || "Sin nombre común"}</strong>
            <em>{arbol.nombreCientifico || arbol.nombreComun || ""}</em>
            <button type="button" onClick={() => onDetalle(arbol, index)}>
              Ver detalle
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
)

export default PerfilPage
