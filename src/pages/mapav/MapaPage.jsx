import styles from "./MapaPage.module.css";

import { MapWrapper } from "./components/MapWrapper/MapWrapper";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { CardTree } from "./components/CardTree/CardTree";
import { useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { fetchArbolesPlantados } from "../../actions/arbolesPlantados.actions";
import Modal from "./components/Modal/Modal";
import { fetchArbolesMapeados } from "../../actions/arbolesMapeados.actions";
import { fetchGeoScouts } from "../../actions/geoScouts.actions";
import { startLoadingUsuarios } from "../../actions/mapaActions";
import { fetchMappedTrees, fetchPlantedTrees } from "../../actions/arboles.actions";

const MapaPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArbolesPlantados());
    dispatch(fetchArbolesMapeados());
    dispatch(fetchGeoScouts());
    dispatch(startLoadingUsuarios());

    dispatch(fetchMappedTrees())
    dispatch(fetchPlantedTrees())
  }, [dispatch]);

  return (
    <div className={styles.mainGrid}>
      <Sidebar />
      <CardTree />
      <MapWrapper />
      <Modal />
    </div>
  );
};

export default MapaPage;
