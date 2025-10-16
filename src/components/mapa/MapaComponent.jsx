import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { activeArbol, hideDetailArbol } from "../../actions/mapaActions";
import { useMapEvents } from 'react-leaflet/hooks'
import L, { MarkerCluster } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

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

const jacarandaIcon = new L.Icon({
  iconUrl: "/jacaranda.png",
  iconSize: new L.Point(40, 47),
});

// const createClusterCustomIcon = function (cluster: MarkerCluster) {
//   return L.divIcon({
//     html: `<span>${cluster.getChildCount()}</span>`,
//     className: "custom-marker-cluster",
//     iconSize: L.point(33, 33, true),
//   });
// };

// Función para determinar qué icono usar
const getIcon = (item) => {
  const nombreComun = item.nombreComun?.toLowerCase() || "";
  const nombreCientifico = item.nombreCientifico || "";

  if (nombreComun.includes("jacaranda") || nombreCientifico === "Jacarandá mimosifolia D. Don") {
    return jacarandaIcon;
  }

  return customIcon;
};

const MapaComponent = () => {
  // const [usuarios, setUsuarios] = useState(users);
  const {
    arboles: arbolesPlantados,
    arbolesMapeados,
    active,
    filtro,
    filtroAplied,
  } = useSelector((state) => state.mapa);
  const dispatch = useDispatch();
  const [tipoArbol, setTipoArbol] = useState('todos');

  const handleTipoArbolChange = (event) => {
    setTipoArbol(event.target.value);
  };

  const markers = useMemo(() => {
    let arbolesMezclados;

    // Filtrar por tipo (Todos, Adoptados, Mapeados)
    if (tipoArbol === 'adoptados') {
      arbolesMezclados = arbolesPlantados;
    } else if (tipoArbol === 'mapeados') {
      arbolesMezclados = arbolesMapeados;
    } else {
      arbolesMezclados = [...arbolesPlantados, ...arbolesMapeados];
    }

    // Si hay filtro de especies aplicado, filtrar el resultado por tipo
    let items;
    if (filtroAplied) {
      // Aplicar el filtro de especies sobre los datos ya filtrados por tipo
      items = filtro.filter(arbol => {
        if (tipoArbol === 'adoptados') {
          return arbolesPlantados.some(a => a.id === arbol.id);
        } else if (tipoArbol === 'mapeados') {
          return arbolesMapeados.some(a => a.id === arbol.id);
        }
        return true; // para "todos"
      });
    } else {
      items = arbolesMezclados;
    }
    return items.map((item) => (
      <Marker
        key={item.id}
        position={[item.latitud, item.longitud]}
        title={item.nombrePropio}
        icon={getIcon(item)}
        eventHandlers={{
          click: () => {
            if (active?.id !== item?.id) {
              dispatch(activeArbol(item.id, { ...item }));
              document.querySelector(".leaflet-control-zoom-in").style.display = "none";
              document.querySelector(".leaflet-control-zoom-out").style.display = "none";
            }
          },
        }}
      />
    ));
  }, [filtroAplied, filtro, arbolesPlantados, arbolesMapeados, active, dispatch, tipoArbol]);
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
  return (
    <main className="mapa-main">
      {/* <Navbar /> */}
      <DetailArbol />

      <FiltroComponent />

      <div className="tipo-arbol-selector">
        <FormControl size="small" sx={{ minWidth: { xs: 110, sm: 140 } }}>
          <Select
            value={tipoArbol}
            onChange={handleTipoArbolChange}
            displayEmpty
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              fontFamily: 'Poppins',
              fontSize: { xs: '0.85rem', sm: '1rem' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#268576',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#174C44',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#268576',
              },
            }}
          >
            <MenuItem value="todos" sx={{ fontFamily: 'Poppins', fontSize: { xs: '0.85rem', sm: '1rem' } }}>Todos</MenuItem>
            <MenuItem value="adoptados" sx={{ fontFamily: 'Poppins', fontSize: { xs: '0.85rem', sm: '1rem' } }}>Adoptados</MenuItem>
            <MenuItem value="mapeados" sx={{ fontFamily: 'Poppins', fontSize: { xs: '0.85rem', sm: '1rem' } }}>Mapeados</MenuItem>
          </Select>
        </FormControl>
      </div>
      <MapContainer
        center={[-17.3917, -66.1448]}
        zoom={13}
        maxZoom={20}
        scrollWheelZoom={true}
      >
        <MyComponent />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>
      </MapContainer>
    </main>
  );
};

export default MapaComponent;
