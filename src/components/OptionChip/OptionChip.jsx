import { Check } from "lucide-react";
import styles from "./OptionChip.module.css"

/**
 * Chip seleccionable del sidebar del mapa.
 *
 * `control` decide el dibujo y la semántica accesible: "radio" para selección
 * única (campañas) y "checkbox" para multi-selección (capas de árboles). El
 * icono de checkbox es el mismo que el del componente Checkbox, para que no
 * haya dos dibujos distintos del mismo control en el sitio.
 */
export const OptionChip = ({ children, checked, onClick, fullWidth, control = "radio" }) => {
  const esCheckbox = control === "checkbox";

  return (
    <button
      type="button"
      role={esCheckbox ? "checkbox" : "radio"}
      aria-checked={Boolean(checked)}
      onClick={onClick}
      className={`${styles.optionChip} ${checked ? styles.checked : ""} ${fullWidth ? styles.fullWidth : ""}`}>
      {esCheckbox ? (
        <div className={`${styles.iconBox} ${checked ? styles.iconBoxChecked : ""}`}>
          <Check size={16} strokeWidth={3.5} />
        </div>
      ) : checked ? (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="1" width="15" height="15" rx="7.5" stroke="currentColor" />
          <circle cx="8" cy="8.5" r="5" fill="currentColor" />
        </svg>
      ) : (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="1" width="15" height="15" rx="7.5" stroke="currentColor" />
        </svg>
      )}
      {children}
    </button>
  )
}
