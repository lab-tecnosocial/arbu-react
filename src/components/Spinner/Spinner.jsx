import styles from "./Spinner.module.css";

/**
 * Indicador de carga circular. Toma el color de `--color-spinner-*`, así que
 * funciona igual en claro y en oscuro sin pasarle nada.
 */
export const Spinner = ({ size = 16, label = "Cargando", className = "" }) => (
  <span
    className={`${styles.spinner} ${className}`}
    style={{
      width: size,
      height: size,
      borderWidth: Math.max(2, Math.round(size / 8)),
    }}
    role="status"
    aria-label={label}
  />
);
