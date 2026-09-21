import { useEffect } from "react";
import { useDispatch } from "react-redux";

import styles from "./MapaPage.module.css";
import { MapWrapper } from "./components/MapWrapper/MapWrapper";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { CardTree } from "./components/CardTree/CardTree";
import { cargarDatosMapaPublico } from "../../actions/mapaPublico.actions";
import { useActividadEnUrl } from "./hooks/useActividadEnUrl";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";

const MapaComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(cargarDatosMapaPublico());
  }, [dispatch]);

  // `/mapa?actividad=…` abre el mapa ya puesto en esa actividad, y elegir una
  // reescribe la URL para que compartir sea copiar la barra de direcciones.
  useActividadEnUrl();

  return (
    <div className={styles.mainGrid}>
      <Sidebar />
      <ErrorBoundary>
        <CardTree />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div style={{ padding: "1rem" }}>No se pudo cargar el mapa.</div>}>
        <MapWrapper />
      </ErrorBoundary>
    </div>
  );
};

export default MapaComponent;
