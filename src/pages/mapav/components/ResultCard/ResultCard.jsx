import { ClipboardPlus, Droplet, Heart, MapPinCheckInside, MoveVertical } from "lucide-react"
import styles from "./ResultCard.module.css"
import { useDispatch } from "react-redux"
import { selectArbolPlantado, setActiveArbolPlantado } from "../../../../actions/arbolesPlantados.actions"

export const ResultCard = ({ key, data }) => {
  const dispatch = useDispatch()
  // const obj = Object.keys(data.monitoreos)[0]
  // const { sanidad, altura } = data.monitoreos[obj]
  const handleButton = () => {
    dispatch(setActiveArbolPlantado(true))
    dispatch(selectArbolPlantado(data))
  }
  return (
    <button key={key} className={styles.resultCard}
      onClick={handleButton}
    >
      <div className={styles.resultDetails}>
        <h5>{data.nombreComun}</h5>
        <div className={styles.detail}>
          <ClipboardPlus size={16} strokeWidth={1.75} />
          <span>{data.nombreCientifico}</span>
        </div>
        <div className={styles.detail}>
          <ClipboardPlus size={16} strokeWidth={1.75} />
          <span>{data.nombrePropio}</span>
        </div>
        <div className={styles.detail}>
          <ClipboardPlus size={16} strokeWidth={1.75} />
          <span>{data.lugarDePlantacion}</span>
          {/* <span>{Object.keys(data.monitoreos).length > 0 ? sanidad : ""}</span> */}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.detail}>
          <Heart size={16} strokeWidth={1.75} />
          <span>{data.estado}</span>
        </div>
        <div className={styles.detail}>
          <MoveVertical size={16} strokeWidth={1.75} />
          <span>1.5</span>
        </div>
        <div className={styles.detail}>
          <Droplet size={16} strokeWidth={1.75} />
          <span>{Object.keys(data.riegos).length}</span>
        </div>
        <div className={styles.detail}>
          <MapPinCheckInside size={16} strokeWidth={1.75} />
          <span>{Object.keys(data.monitoreos).length}</span>
        </div>
      </div>
    </button>
  )
}

