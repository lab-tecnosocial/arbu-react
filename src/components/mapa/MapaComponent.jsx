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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

      </MapContainer>

    </main>


  );
}

export default MapaComponent;
