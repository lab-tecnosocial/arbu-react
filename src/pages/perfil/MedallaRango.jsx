import { tonoPosicion } from "../../helpers/rangoPerfil"
import styles from "./MedallaRango.module.css"

export const MedallaRango = ({ rango, posicion, onClick, tamano = "md" }) => {
  const tono = tonoPosicion(posicion)
  const clase = [styles.medalla, styles[tamano]].filter(Boolean).join(" ")
  const contenido = (
    <>
      <img src={rango.insignia} alt="" className={styles.insignia} />
      {tono ? (
        <span className={`${styles.posicion} ${styles[tono]}`}>{posicion}</span>
      ) : null}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className={clase}
        onClick={onClick}
        aria-label={`${rango.nombre}. Ver medallas de clasificación.`}
      >
        {contenido}
      </button>
    )
  }

  return <div className={clase}>{contenido}</div>
}
