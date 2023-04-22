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
import Navbar from "./Navbar";
const customIcon = new L.Icon({
  iconUrl: require("./location.svg").default,
  iconSize: new L.Point(40, 47),
});

const createClusterCustomIcon = function (cluster: MarkerCluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: L.point(33, 33, true),
  });
};

const MapaComponent = () => {
  // const [usuarios, setUsuarios] = useState(users);
  const { arboles: arbolesPlantados, active, filtro, filtroAplied } = useSelector(state => state.mapa);
  const dispatch = useDispatch();
  // const [arbolesPlantados, setArbolesPlantados] = useState(arboles);

  // const [arbolDetail, setArbolDetail] = useState(null);
  // const asArray = Object.entries(users);


  // console.log(asArray);
  // useEffect(() => {
  // getUsuariosFromDB();
  // getArbolesFromDB();
  // }, []);

  // const getUsuariosFromDB = async () => {
  //   const usuariosSnapshot = await db.collection("usuarios_public").get();
  //   const arrayUsuarios = [];
  //   usuariosSnapshot.forEach((element) => {
  //     const usuario = element.data();
  //     arrayUsuarios.push(usuario);
  //   });
  //   setUsuarios(arrayUsuarios);
  // };
  // const getArbolesFromDB = async () => {
  //   const arbolesSnapshot = await db.collection("arbolesPlantados").get();
  //   const arrayArboles = [];
  //   arbolesSnapshot.forEach((element) => {
  //     const arbol = element.data();
  //     arrayArboles.push(arbol);
  //   });
  //   setArbolesPlantados(arrayArboles);
  // };
  // console.log('desde Map');
  function MyComponent() {
    const map = useMapEvents({
      click: () => {
        // console.log('map clicked');
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
        <MarkerClusterGroup chunkedLoading>
          {
            filtroAplied
              ?
              filtro.map((item) => (
                <Marker
                  key={item.id}
                  position={[item.latitud, item.longitud]}
                  title={item.nombrePropio}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => {
                      if (active?.id !== item?.id) {
                        dispatch(activeArbol(item.id, { ...item }))
                        document.querySelector('.leaflet-control-zoom-in').style.display = 'none';
                        document.querySelector('.leaflet-control-zoom-out').style.display = 'none';
                      }
                    },
                  }}
                >
                  {/* <PopupMarker arbol={item} usuarios={item.usuariosQueAdoptaron} arrayUsers={asArray} setArbolDetail={setArbolDetail} /> */}

                </Marker>
              ))
              :
              arbolesPlantados.map((item) => (
                <Marker
                  key={item.id}
                  position={[item.latitud, item.longitud]}
                  title={item.nombrePropio}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => {
                      if (active?.id !== item?.id) {
                        dispatch(activeArbol(item.id, { ...item }))
                        document.querySelector('.leaflet-control-zoom-in').style.display = 'none';
                        document.querySelector('.leaflet-control-zoom-out').style.display = 'none';
                      }
                    },
                  }}
                >
                  {/* <PopupMarker arbol={item} usuarios={item.usuariosQueAdoptaron} arrayUsers={asArray} setArbolDetail={setArbolDetail} /> */}

                </Marker>
              ))

          }
        </MarkerClusterGroup>

      </MapContainer>

    </main>


  );
}

export default MapaComponent;
