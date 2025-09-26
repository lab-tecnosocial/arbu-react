import styles from "./MapaPage.module.css";

import { MapWrapper } from './components/MapWrapper/MapWrapper';
import { Sidebar } from "./components/Sidebar/Sidebar";
import { CardTree } from "./components/CardTree/CardTree";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadGeoScouts, startLoadingUsuarios } from "../../actions/mapaActions";
import { fetchMappedTrees, fetchPlantedTrees } from "../../actions/arboles.actions";

const MapaComponent = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // NOTE: fetch data, load archivos
    dispatch(fetchPlantedTrees())
    dispatch(fetchMappedTrees())
    dispatch(loadGeoScouts())
    dispatch(startLoadingUsuarios());
  }, [dispatch])

  return (
    <div className={styles.mainGrid} >
      <Sidebar />
      <CardTree />
      <MapWrapper />
    </div>
  );
};

export default MapaComponent;
