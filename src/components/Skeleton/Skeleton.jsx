import styles from "./Skeleton.module.css";

/**
 * Bloque gris que ocupa el sitio de un contenido que todavía no llegó. Es
 * decorativo: se oculta a los lectores de pantalla, que ya reciben el estado
 * de carga por el `role="status"` de quien lo envuelve.
 */
export const Skeleton = ({
  width = "100%",
  height = 16,
  radius = "var(--br-small)",
  className = "",
}) => (
  <span
    className={`${styles.skeleton} ${className}`}
    style={{ width, height, borderRadius: radius }}
    aria-hidden="true"
  />
);
