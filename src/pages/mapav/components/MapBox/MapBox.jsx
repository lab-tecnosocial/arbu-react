import styles from "./MapBox.module.css"
import { activeArbol, hideDetailArbol, setArbolSeleccionado, setBusqueda } from "../../../../actions/mapaActions";
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import L, { MarkerCluster } from "leaflet";
import { useMapEvents } from 'react-leaflet/hooks'
import { useSelector, useDispatch } from "react-redux";
import MarkerClusterGroup from "react-leaflet-cluster";
import { seleccionarPoligono } from '../../utils/selectPolygon';
import locationIcon from "../../location.svg";
import { selectArbolPlantado, setActiveArbolPlantado } from "../../../../actions/arbolesPlantados.actions";

const customIcon = new L.Icon({
  iconUrl: locationIcon,
  iconSize: new L.Point(40, 47),
});

export const MapBox = () => {
  const layersRef = useRef(new Map());
  const {
    // arboles: arbolesPlantados,
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
  const {
    arbolesPlantadosData, isActiveArbolesPlantados, arbolesPlantadosFiltrados
  } = useSelector((state) => state.arbolesPlantados)
  const {
    dataArbolesMapeados, isActiveArbolesMapeados
  } = useSelector((state) => state.arbolesMapeados)
  const {
    isActiveScouts, scouts
  } = useSelector((state) => state.geoScouts)

  const dispatch = useDispatch();

  const markersArbolesPlantados = useMemo(() => {
    const items = arbolesPlantadosFiltrados.length > 0 ? arbolesPlantadosFiltrados : arbolesPlantadosData;
    return items.map((item) => (
      <Marker
        key={item.id}
        position={[item.latitud, item.longitud]}
        title={item.nombrePropio}
        icon={customIcon}
        eventHandlers={{
          click: () => {
            // if (active?.id !== item?.id) {
            // dispatch(activeArbol(item.id, { ...item }));
            dispatch(setActiveArbolPlantado(true))
            dispatch(selectArbolPlantado(item))
            // dispatch(setArbolSeleccionado([item.latitud, item.longitud]))
            document.querySelector(".leaflet-control-zoom-in").style.display = "none";
            document.querySelector(".leaflet-control-zoom-out").style.display = "none";
            // }
          },
        }}
      />
    ));
  }, [arbolesPlantadosFiltrados, filtroAplied, filtro, arbolesPlantadosData, active, dispatch]);

  const markersArbolesMapeados = useMemo(() => {
    // const items = arbolesMapeados;
    // const items = arbolesFiltrados.length > 0 ? arbolesFiltrados : dataArbolesMapeados;
    return dataArbolesMapeados.map((item) => (
      <Marker
        key={item.id}
        position={[item.latitud, item.longitud]}
        title={item.nombrePropio}
        icon={customIcon}
        eventHandlers={{
          click: () => {
            // if (active?.id !== item?.id) {
            // dispatch(setActiveArbolPlantado(item.id, { ...item }));
            dispatch(setActiveArbolPlantado(item));
            // dispatch(setArbolSeleccionado([item.latitud, item.longitud]))
            document.querySelector(".leaflet-control-zoom-in").style.display = "none";
            document.querySelector(".leaflet-control-zoom-out").style.display = "none";
            // }
          },
        }}
      />
    ));
  }, [dataArbolesMapeados, active, dispatch]);

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
      const poligono = polygon(feature.geometry.coordinates);

      const markers_ArbolesPlantadosDentro = arbolesPlantadosData.filter((marker) => {
        const punto = point([marker.longitud, marker.latitud]);
        return booleanPointInPolygon(punto, poligono);
      });

      const markers_ArbolesMapeadosDentro = dataArbolesMapeados.filter((marker) => {
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

  useEffect(() => {
    if (zonaSeleccionada !== null) {
      seleccionarPoligono(zonaSeleccionada);
    }
  }, [zonaSeleccionada]);

  // useEffect(() => {
  //   fetch('http://localhost:8080/triangulacion_grupos_scouts.geojson')
  //     .then((res) => res.json())
  //     .then((data) => setGeoData(data))
  //   fetch('http://localhost:8080/arboles-mapeados')
  //     .then((res) => res.json())
  //     .then((data) => setArbolesMapeados(data))
  // }, dispatch, arbolesMapeados, geoData)
  // console.log('isactive', isActiveArbolesMapeados)
  // console.log('isactive', dataArbolesMapeados)

  return (
    <div className={styles.map}>
      <MapContainer
        center={[-17.3917, -66.1448]}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <ZoomControl position="bottomright" />

        {/* <MyComponent /> */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* {arbolSeleccionado && <MapView position={arbolSeleccionado} />} */}
        {/* {showArbolesMapeados && geoData && <GeoJSON data={geoData} onEachFeature={onEachFeature} />} */}
        {isActiveScouts && scouts &&
          <GeoJSON data={scouts} />
        }
        {isActiveArbolesMapeados ?
          <MarkerClusterGroup chunkedLoading>
            {markersArbolesMapeados}
          </MarkerClusterGroup>
          : null
        }
        {isActiveArbolesPlantados ?
          <MarkerClusterGroup chunkedLoading>
            {markersArbolesPlantados}
          </MarkerClusterGroup>
          : null
        }
      </MapContainer>
    </div>
  )
}
