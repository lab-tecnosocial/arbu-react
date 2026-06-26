import styles from "./MapWrapper.module.css"
import { loadGeoScouts, setModalState, setSelectedCoords, setShowTreeMappingForm } from "../../../../actions/mapaActions";
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, GeoJSON, ZoomControl, useMap, useMapEvents } from "react-leaflet";
// import { useMapEvents } from 'react-leaflet/hooks'
import { MapEvents } from "./Utils/MapEvents";
import { useSelector, useDispatch } from "react-redux";
import MarkerClusterGroup from "react-leaflet-cluster";
import { seleccionarPoligono } from '../../utils/selectPolygon';
import { X } from "lucide-react"
import { customIcon } from "./Utils/CustomIcon";
import { ClickableMarker } from "./Utils/ClickableMarker";
import ClusterArbolesPlantados from "./Utils/ClusterArbolesPlantados";
import ClusterArbolesMapeados from "./Utils/ClusterArbolesMapeados";
import { TreeMappingForm } from "../TreeMappingForm/TreeMappingForm";

export const MapWrapper = () => {
  const dispatch = useDispatch();
  const layersRef = useRef(new Map());
  const {
    geoScouts,
    geoMode,
    selectedCoords,
    showTreeMappingForm
  } = useSelector((state) => state.mapa);

  const { arbolesPlantados, arbolesMapeados } = useSelector((state) => state.arboles)

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

      const markers_ArbolesPlantadosDentro = arbolesPlantados.data.filter((marker) => {
        const punto = point([marker.longitud, marker.latitud]);
        return booleanPointInPolygon(punto, poligono);
      });

      const markers_ArbolesMapeadosDentro = arbolesMapeados.data.filter((marker) => {
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
    if (!geoScouts) dispatch(loadGeoScouts());
  }, [geoScouts]);

  return (
    <div className={styles.map}>
      {
        selectedCoords && (
          <div className={styles.mapControls}>
            {/* <button onClick={dispatch(setShowTreeMappingForm(true))}>Adoptar Arbol</button> */}
            <button onClick={() => dispatch(setModalState("OPEN"))} >Mapear Arbol</button>
            <button onClick={() => dispatch(setSelectedCoords(null))}><X /></button>
          </div>
        )
      }

      <MapContainer
        center={[-17.3917, -66.1448]}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapEvents />
        <ClickableMarker position={selectedCoords} icon={customIcon} />

        {geoMode === "scouts" && <GeoJSON data={geoScouts} onEachFeature={onEachFeature} />}

        <ClusterArbolesPlantados
          arbolesPlantados={arbolesPlantados}
          customIcon={customIcon}
        />
        <ClusterArbolesMapeados
          arbolesMapeados={arbolesMapeados}
          customIcon={customIcon}
        />
      </MapContainer>
    </div>
  )
}
