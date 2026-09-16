import { useDispatch, useSelector } from "react-redux";
import { RotateCw, TriangleAlert } from "lucide-react";

import styles from "./EstadoMapa.module.css";
import { Spinner } from "../../../../components/Spinner/Spinner";
import {
  selectArbolesCargando,
  selectArbolesError,
  selectHayArbolesCargados,
} from "../../../../selectors/arboles";
import { cargarDatosMapaPublico } from "../../../../actions/mapaPublico.actions";

/**
 * Aviso flotante sobre el mapa mientras llegan los árboles, y reintento si no
 * llegan. El mapa base se pinta en menos de un segundo pero los marcadores
 * tardan varios más: sin este aviso, el mapa "vacío" parece el resultado
 * final. No bloquea: se puede arrastrar y hacer zoom mientras tanto.
 */
export const EstadoMapa = () => {
  const dispatch = useDispatch();
  const cargando = useSelector(selectArbolesCargando);
  const error = useSelector(selectArbolesError);
  const hayArboles = useSelector(selectHayArbolesCargados);

  // Cargar manda sobre fallar: son dos capas y la primera en volver puede ser
  // la que falló. Avisar del error antes de tiempo haría parpadear el aviso.
  if (cargando) {
    return (
      <div className={styles.aviso} role="status" aria-live="polite">
        <Spinner size={18} label="Cargando árboles" />
        <span>Cargando árboles…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.aviso} ${styles.avisoError}`} role="alert">
        <TriangleAlert size={18} strokeWidth={1.75} aria-hidden="true" />
        <span>
          {hayArboles
            ? "Faltan árboles por cargar."
            : "No se pudieron cargar los árboles."}
        </span>
        <button
          type="button"
          className={styles.reintentar}
          onClick={() => dispatch(cargarDatosMapaPublico())}
        >
          <RotateCw size={16} strokeWidth={1.75} aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  return null;
};
