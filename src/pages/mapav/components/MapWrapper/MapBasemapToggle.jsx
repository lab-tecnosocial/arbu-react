import { VISTA_MAPA } from '../../../../helpers/basemap'
import styles from './MapBasemapToggle.module.css'

const OPCIONES = [
  { value: VISTA_MAPA.CALLEJERO, label: 'Mapa' },
  { value: VISTA_MAPA.SATELITE, label: 'Satélite' },
]

export const MapBasemapToggle = ({ vistaMapa, onVistaMapaChange }) => (
  <div className={styles.toggle} role='group' aria-label='Vista del mapa'>
    {OPCIONES.map((option) => {
      const activa = vistaMapa === option.value
      return (
        <button
          key={option.value}
          type='button'
          className={`${styles.option} ${activa ? styles.optionActive : ''}`}
          aria-pressed={activa}
          onClick={() => onVistaMapaChange(option.value)}
        >
          {option.label}
        </button>
      )
    })}
  </div>
)
