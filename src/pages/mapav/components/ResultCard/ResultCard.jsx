import { ClipboardPlus, Droplet, Heart, MapPinCheckInside, MoveVertical } from "lucide-react"
import styles from "./ResultCard.module.css"
import { useDispatch } from "react-redux"
import { setPanelState, setSelectedCoords, setSelectedTree } from "../../../../actions/mapaActions"

export const ResultCard = ({ index, arbolData }) => {
  const dispatch = useDispatch()

  const handleButton = () => {
    dispatch(setPanelState("OPEN"))
    dispatch(setSelectedTree(index, arbolData))
    dispatch(setSelectedCoords([arbolData.latitud, arbolData.longitud], 18))
  }

  return (
    <button className={styles.resultCard}
      onClick={handleButton}
    >
      <div className={styles.resultDetails}>
        <h5>{arbolData.nombreComun}</h5>
        <div className={styles.detail}>
          <ClipboardPlus size={16} strokeWidth={1.75} />
          <span>{arbolData.nombreCientifico}</span>
        </div>
        <div className={styles.detail}>
          <ClipboardPlus size={16} strokeWidth={1.75} />
          <span>{arbolData.nombrePropio}</span>
        </div>
        <div className={styles.detail}>
          <ClipboardPlus size={16} strokeWidth={1.75} />
          <span>{arbolData.lugarDePlantacion}</span>
          {/* <span>{Object.keys(arbolData.monitoreos).length > 0 ? sanidad : ""}</span> */}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.detail}>
          <Heart size={16} strokeWidth={1.75} />
          <span>{arbolData.estado}</span>
        </div>
        <div className={styles.detail}>
          <MoveVertical size={16} strokeWidth={1.75} />
          <span>1.5</span>
        </div>
        <div className={styles.detail}>
          <Droplet size={16} strokeWidth={1.75} />
          <span>{Object.keys(arbolData.riegos).length}</span>
        </div>
        <div className={styles.detail}>
          <MapPinCheckInside size={16} strokeWidth={1.75} />
          <span>{Object.keys(arbolData.monitoreos).length}</span>
        </div>
      </div>
    </button>
  )
}

