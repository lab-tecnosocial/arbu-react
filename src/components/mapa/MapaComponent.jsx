import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { activeArbol, hideDetailArbol } from "../../actions/mapaActions";
import { useMapEvents } from 'react-leaflet/hooks'
import L, { MarkerCluster } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import "./MarkerCluster.Default.css";
import "./MapaComponent.css";
// import { arboles } from "./arbolesPlantados";
// import { db } from "../../firebase/firebase-config";
import { usuarios as users } from './usuarios';
// import PopupMarker from "./PopupMarker";
import DetailArbol from "./DetailArbol";
import FiltroComponent from "./filtro/FiltroComponent";
import locationIcon from "./location.svg";
import Navbar from "./Navbar";
const customIcon = new L.Icon({
  iconUrl: locationIcon,
  iconSize: new L.Point(40, 47),
});

// const createClusterCustomIcon = function (cluster: MarkerCluster) {
//   return L.divIcon({
//     html: `<span>${cluster.getChildCount()}</span>`,
//     className: "custom-marker-cluster",
//     iconSize: L.point(33, 33, true),
//   });
// };

const MapaComponent = () => {
  // const [usuarios, setUsuarios] = useState(users);
  const { arboles: arbolesPlantados, active, filtro, filtroAplied } = useSelector(state => state.mapa);
  const dispatch = useDispatch();

  function MyComponent() {
    const map = useMapEvents({
      click: () => {
        if (active !== null) {
          dispatch(hideDetailArbol());
          document.querySelector('.leaflet-control-zoom-in').style.display = 'block';
          document.querySelector('.leaflet-control-zoom-out').style.display = 'block';
        }
      },

    })
    return null
  }
  return (

    <main >
      {/* <Navbar /> */}
      <DetailArbol />

      <FiltroComponent />
      <MapContainer
        center={[-17.3917, -66.1448]}
        zoom={13}
        scrollWheelZoom={true}

      >

        <MyComponent />
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/labtecnosocial/ckmrvd5jx2gbu17p7atlk1xay/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoibGFidGVjbm9zb2NpYWwiLCJhIjoiY2ttcnBlcG53MDl4ejJxcnMyc3N2dGpoYSJ9.MaXq1p4n25cMQ6gXIN14Eg" maxZoom={19} tileSize={512} zoomOffset={-1}
        />
        

      </MapContainer>

    </main>


  );
}

export default MapaComponent;
