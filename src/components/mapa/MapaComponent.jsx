import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { activeArbol, hideDetailArbol, setArbolSeleccionado, setBusqueda } from "../../actions/mapaActions";
import { useMapEvents } from 'react-leaflet/hooks'
import L, { MarkerCluster } from "leaflet";
import { MapContainer, Marker, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import "./MarkerCluster.Default.css";
import "./MapaComponent.css";
import DetailArbol from "./DetailArbol";
import FiltroComponent from "./filtro/FiltroComponent";
import locationIcon from "./location.svg";
import Navbar from "./Navbar";
import FiltroVarianteComponent from "./filtrovariante/FiltroVarianteComponent";
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
  const {
    arboles: arbolesPlantados,
    showArbolesPlantados,
    showArbolesMapeados,
    arbolesFiltrados,
    busqueda,
    active,
    filtro,
    filtroAplied,
    arbolSeleccionado
  } = useSelector((state) => state.mapa);
  const dispatch = useDispatch();
  const [geoData, setGeoData] = useState(null)
  // const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch('http://localhost:8111/triangulacion_grupos_scouts.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
  }, dispatch, geoData)

  // const datosFiltrados = arbolesPlantados.filter((item) =>
  //   item.nombreComun?.toLowerCase().includes(busqueda.toLowerCase())
  // );
  //
  // console.log("TEST", arbolesPlantados)
  // console.log("TEST2", geoData)
  // console.log("TEST3", arbolesFiltrados)
  // console.log("DATOS FILTRAODS", datosFiltrados)

  const markers = useMemo(() => {
    // const items = filtroAplied ? filtro : arbolesPlantados;
    const items = arbolesFiltrados.length > 0 ? arbolesFiltrados : arbolesPlantados;
    return items.map((item) => (
      <Marker
        key={item.id}
        position={[item.latitud, item.longitud]}
        title={item.nombrePropio}
        icon={customIcon}
        eventHandlers={{
          click: () => {
            if (active?.id !== item?.id) {
              dispatch(activeArbol(item.id, { ...item }));
              dispatch(setArbolSeleccionado([item.latitud, item, longitud]))
              document.querySelector(".leaflet-control-zoom-in").style.display = "none";
              document.querySelector(".leaflet-control-zoom-out").style.display = "none";
            }
          },
        }}
      />
    ));
  }, [arbolesFiltrados, filtroAplied, filtro, arbolesPlantados, active, dispatch]);
  // const MyComponent = React.memo(() => {
  //   const map = useMapEvents({
  //     click: () => {
  //       if (active !== null) {
  //         dispatch(hideDetailArbol());
  //         document.querySelector(".leaflet-control-zoom-in").style.display = "block";
  //         document.querySelector(".leaflet-control-zoom-out").style.display = "block";
  //       }
  //     },
  //   });
  //   return null;
  // });

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

  const MapView = ({ position, zoomCurrent = 18 }) => {
    const map = useMap();
    map.flyTo(position, zoomCurrent);
    return null;
  }

  console.log("arbolSeleccionado", arbolSeleccionado)

  return (
    <main>
      {/* <Navbar /> */}
      <DetailArbol />
      <FiltroComponent />
      {geoData &&
        <FiltroVarianteComponent geoData={geoData} />
      }
      <div className="main-grid">
        {/* <div className="filtro-sidebar"></div> */}
        <div className="mapa">
          <MapContainer
            center={[-17.3917, -66.1448]}
            zoom={13}
            zoomControl={false}
            scrollWheelZoom={true}
          >
            <ZoomControl position="bottomright" />

            <MyComponent />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {arbolSeleccionado && <MapView position={arbolSeleccionado} />}

            {showArbolesMapeados && geoData && <GeoJSON data={geoData} />}
            {showArbolesPlantados ?
              <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>
              : null
            }
            {/* <MarkerClusterGroup> */}
            {/*   {arbolesPlantados ? arbolesPlantados.map((arbol_marker) => { */}
            {/*     const { id, nombrePropio, latitud, longitud } = arbol_marker; */}
            {/*     return ( */}
            {/*       <Marker */}
            {/*         key={id} */}
            {/*         position={[latitud, longitud]} */}
            {/*         icon={customIcon} */}
            {/*         title={nombrePropio} */}
            {/*       // eventHandlers={{ */}
            {/*       //   click: () => dispatch(loadActiveArbol(arbol_marker)) */}
            {/*       // }} */}
            {/*       > */}
            {/*       </Marker> */}
            {/*     ); */}
            {/*   }) : null} */}
            {/* </MarkerClusterGroup> */}
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

export default MapaComponent;
