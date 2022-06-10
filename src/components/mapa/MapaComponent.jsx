import React from "react";
import L, { MarkerCluster } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "./MarkerCluster.Default.css";
import "./MapaComponent.css";
import { arboles } from "./arbolesPlantados";

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
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>MapaComponent</h2>
      <MapContainer
        center={[-17.3917, -66.1448]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading>
          {arboles.map((item) => (
            <Marker
              key={item.id}
              position={[item.latitud, item.longitud]}
              title={item.nombrePropio}
              icon={customIcon}
            >
              <Popup>
                <img
                  src={Object.values(item.monitoreos).pop().fotografia}
                  alt={item.nombrePropio}
                  width="250px"
                  height="200px"
                  style={{ objectFit: "cover" }}
                />
                <br />
                {item.nombrePropio} <br />
                {item.nombreComun}
                <br />
                Adoptado por: <br />
                <center>
                  <h4>Ver detalle</h4>
                </center>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </main>
  );
};

export default MapaComponent;
