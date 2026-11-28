import { useEffect } from "react"
import { X } from "lucide-react"
import { EJEMPLOS_POSICION, RANGOS } from "../../helpers/rangoPerfil"
import { MedallaRango } from "./MedallaRango"
import styles from "./InfoMedallas.module.css"

export const InfoMedallas = ({ onCerrar }) => {
  useEffect(() => {
    const onTecla = (evento) => {
      if (evento.key === "Escape") onCerrar()
    }
    window.addEventListener("keydown", onTecla)
    return () => window.removeEventListener("keydown", onTecla)
  }, [onCerrar])

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <div
        className={styles.tarjeta}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-medallas-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id="info-medallas-titulo">Medallas de Clasificación</h2>
        <p>
          Las medallas de clasificación determinan el nivel de habilidad de cada
          participante de Arbu.
        </p>
        <p className={styles.subtitulo}>Existen 4 medallas en total:</p>

        <ul className={styles.niveles}>
          {RANGOS.map((rango) => (
            <li key={rango.nombre}>
              <MedallaRango rango={rango} tamano="sm" />
              <span>{rango.nombre}</span>
            </li>
          ))}
        </ul>

        <p>
          Los mejores participantes muestran su posición numérica en la parte
          inferior derecha de la medalla.
        </p>

        <ul className={styles.ejemplos}>
          {EJEMPLOS_POSICION.map((ejemplo) => (
            <li key={ejemplo.posicion}>
              <MedallaRango
                rango={RANGOS[3]}
                posicion={ejemplo.posicion}
                tamano="sm"
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.cerrar}
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          <X size={28} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  )
}
