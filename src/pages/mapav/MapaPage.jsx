import { useEffect } from "react";
import { useDispatch } from "react-redux";

import styles from "./MapaPage.module.css";
import { MapWrapper } from "./components/MapWrapper/MapWrapper";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { CardTree } from "./components/CardTree/CardTree";
import { startLoadingUsuarios } from "../../actions/mapaActions";
import {
  fetchInscripcionesMapeo,
  fetchMappedTrees,
  fetchPlantedTrees,
} from "../../actions/arboles.actions";
import { fetchCampaniasPublicas } from "../../actions/campanias.actions";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";

const MapaComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlantedTrees());
    dispatch(fetchMappedTrees());
    dispatch(fetchInscripcionesMapeo());
    dispatch(fetchCampaniasPublicas());
    dispatch(startLoadingUsuarios());
  }, [dispatch]);

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
