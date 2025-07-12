// import * as turf from '@turf/turf';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
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
import { useRef } from 'react';
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
  const poligonoActivoRef = useRef(null);
  const layersRef = useRef(new Map());
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
    arbolSeleccionado,
    zonaSeleccionada
  } = useSelector((state) => state.mapa);

  const dispatch = useDispatch();
  const [geoData, setGeoData] = useState(null)
  const [arbolesMapeados, setArbolesMapeados] = useState([])


  const markersArbolesPlantados = useMemo(() => {
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
              // dispatch(setArbolSeleccionado([item.latitud, item.longitud]))
              document.querySelector(".leaflet-control-zoom-in").style.display = "none";
              document.querySelector(".leaflet-control-zoom-out").style.display = "none";
            }
          },
        }}
      />
    ));
  }, [arbolesFiltrados, filtroAplied, filtro, arbolesPlantados, active, dispatch]);

  const markersArbolesMapeados = useMemo(() => {
    const items = arbolesMapeados;
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
              // dispatch(setArbolSeleccionado([item.latitud, item.longitud]))
              document.querySelector(".leaflet-control-zoom-in").style.display = "none";
              document.querySelector(".leaflet-control-zoom-out").style.display = "none";
            }
          },
        }}
      />
    ));
  }, [arbolesMapeados, active, dispatch]);

  // const scoutsMarkers = useMemo(() => {
  //   const 
  // })

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

  const onEachFeature = (feature, layer) => {
    const map = useMap();
    const idFeature = feature.id

    layersRef.current.set(idFeature, layer);

    // layer.on('mouseover', () => {
    //   if (poligonoActivoRef.current !== layer) {
    //     layer.setStyle({
    //       fillColor: '#74CE82',
    //       // color: '#ff3300',
    //       fillOpacity: 0.7,
    //       weight: 2
    //     });
    //   }
    // });
    //
    // layer.on('mouseout', () => {
    //   if (poligonoActivoRef.current !== layer) {
    //     layer.setStyle(
    //       {
    //         fillColor: '#BED9FF',
    //         "stroke": "#555555",
    //         "stroke-width": 2,
    //         "stroke-opacity": 1,
    //         "fill": "#eefe0b",
    //         "fill-opacity": 0.5
    //       }
    //     );
    //   }
    // });

    layer.on('click', () => {
      // seleccionarPoligono(idFeature, map)
      const poligono = polygon(feature.geometry.coordinates);

      const markers_ArbolesPlantadosDentro = arbolesPlantados.filter((marker) => {
        const punto = point([marker.longitud, marker.latitud]);
        return booleanPointInPolygon(punto, poligono);
      });

      const markers_ArbolesMapeadosDentro = arbolesMapeados.filter((marker) => {
        const punto = point([marker.longitud, marker.latitud]);
        return booleanPointInPolygon(punto, poligono);
      });

      const contenido = markers_ArbolesPlantadosDentro.length
        ? `<div class="marker-wrapper"> 
            <div class="marker-dentro">Arboles Plantados dentro la zona:</div>${markers_ArbolesPlantadosDentro
          .map((m, i) => {
            return `<div class="marker-row">${i + 1}. ${m.nombrePropio} - ${m.nombreCientifico}</div>`
          }).join('')}
          </div>`
        : 'No hay arboles plantados dentro de esta área.';

      const contenido2 = markers_ArbolesMapeadosDentro.length
        ? `<div class="marker-wrapper"> 
            <div class="marker-dentro">Arboles Mapeados dentro la zona:</div>${markers_ArbolesMapeadosDentro
          .map((m, i) => {
            return `<div class="marker-row">${i + 1}. ${m.nombrePropio} - ${m.nombreCientifico}</div>`
          }).join('')}
          </div>`
        : 'No hay arboles Mapeados dentro de esta área.';

      layer.bindPopup(`
        <div class="popup-card">
          <div class="popup-title">
            <span>Grupo Scout:</span><span>${feature.properties['GRUPO SCOUT']}</span>
          </div> 
          ${contenido}
          ${contenido2}
        </div>
      `).openPopup();

      const bounds = layer.getBounds();

    });
  };

  function puntoEnPoligono(punto, poligono) {
    const [x, y] = punto;
    let dentro = false;

    for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
      const [xi, yi] = poligono[i];
      const [xj, yj] = poligono[j];

      const intersecta = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

      if (intersecta) dentro = !dentro;
    }

    return dentro;
  }

  const seleccionarPoligono = (id, map) => {
    const layer = layersRef.current.get(id);
    console.log("layer", layer)
    const poligono = polygon(layer.feature.geometry.coordinates);

    const markers_ArbolesPlantadosDentro = arbolesPlantados.filter((marker) => {
      const punto = point([marker.longitud, marker.latitud]);
      return booleanPointInPolygon(punto, poligono);
    });

    const markers_ArbolesMapeadosDentro = arbolesMapeados.filter((marker) => {
      const punto = point([marker.longitud, marker.latitud]);
      return booleanPointInPolygon(punto, poligono);
    });

    const contenido = markers_ArbolesPlantadosDentro.length
      ? `<div class="marker-wrapper"> 
            <div class="marker-dentro">Arboles Plantados dentro la zona:</div>${markers_ArbolesPlantadosDentro
        .map((m, i) => {
          return `<div class="marker-row">${i + 1}. ${m.nombrePropio} - ${m.nombreCientifico}</div>`
        }).join('')}
          </div>`
      : 'No hay arboles plantados dentro de esta área.';

    const contenido2 = markers_ArbolesMapeadosDentro.length
      ? `<div class="marker-wrapper"> 
            <div class="marker-dentro">Arboles Mapeados dentro la zona: ${markers_ArbolesMapeadosDentro.length}</div>
          </div>
`
      : 'No hay arboles Mapeados dentro de esta área.';

    layer.bindPopup(`
        <div class="popup-card">
          <div class="popup-title">
            <span>Grupo Scout:</span><span>${layer.feature.properties['GRUPO SCOUT']}</span>
          </div> 
          ${contenido}
          ${contenido2}
        </div>
      `).openPopup();

    const bounds = layer.getBounds();
    console.log("bounds", bounds)
    // map.fitBounds(bounds, {
    //   paddingTopLeft: [150, 20],
    //   paddingBottomRight: [20, 20],
    //   animate: true,
    //   duration: 2,
    //   easeLinearity: 0.5
    // });
    // const map = useMap();
    // const layer = layersRef.current.get(id);
    // console.log("useeffect", layer)
    // const bounds = layer.getBounds();
    // map.fitBounds(bounds, {
    //   paddingTopLeft: [150, 20],
    //   paddingBottomRight: [20, 20],
    //   animate: true,
    //   duration: 2,
    //   easeLinearity: 0.5
    // });
    //
  }

  useEffect(() => {
    if (zonaSeleccionada !== null) {
      seleccionarPoligono(zonaSeleccionada);
    }
  }, [zonaSeleccionada]);

  useEffect(() => {
    fetch('http://localhost:8111/triangulacion_grupos_scouts.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
    fetch('http://localhost:8111/arboles-mapeados')
      .then((res) => res.json())
      .then((data) => setArbolesMapeados(data))
  }, dispatch, arbolesMapeados, geoData)

  // if(geoData.features.)
  // console.log("geoicons", geoData.features)

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

            {showArbolesMapeados && geoData && <GeoJSON data={geoData} onEachFeature={onEachFeature} />}
            {showArbolesPlantados ?
              <MarkerClusterGroup chunkedLoading>
                {markersArbolesPlantados}
                {markersArbolesMapeados}
              </MarkerClusterGroup>
              : null
            }
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

export default MapaComponent;
