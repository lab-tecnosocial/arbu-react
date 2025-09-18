import styles from "./MapaPage.module.css";
// import "./MarkerCluster.Default.css"

import { MapWrapper } from './components/MapWrapper/MapWrapper';
import { Sidebar } from "./components/Sidebar/Sidebar";
import { CardTree } from "./components/CardTree/CardTree";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchArbolesPlantados } from "../../actions/arbolesPlantados.actions";
import { fetchArbolesMapeados } from "../../actions/arbolesMapeados.actions";
import { fetchGeoScouts } from "../../actions/geoScouts.actions";
import { startLoadingUsuarios } from "../../actions/mapaActions";

const MapaComponent = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchArbolesPlantados())
    dispatch(fetchArbolesMapeados())
    dispatch(fetchGeoScouts())
    dispatch(startLoadingUsuarios());
  }, [dispatch])

  return (
    <div className={styles.mainGrid} >
      <Sidebar />
      <CardTree />
      <MapWrapper />
    </div >
  );
};

export default MapaComponent;
