import { Check, X } from "lucide-react"
import styles from "./Chip.module.css"

export const Chip = ({ variant = "normal", label }) => {
  return (
    <div className={`${styles.cell} ${styles[variant]}`}>
      <div className={styles.icon}>
        {variant === "success" && <Check size={12} strokeWidth={3} />}
        {variant === "warning" && <X size={12} strokeWidth={3} />}
      </div>

      <span>{label}</span>
    </div>
  )
}

