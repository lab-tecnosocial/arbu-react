import React, { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Box, Chip } from "@mui/material";
import locationIcon from "../mapa/location.svg";
import "../mapa/MarkerCluster.Default.css";

const customIcon = new L.Icon({
  iconUrl: locationIcon,
  iconSize: new L.Point(40, 47),
});

const MapaProyecto = ({ arboles, mapeadoresMap }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const markers = useMemo(() => {
    // Filtrar árboles con coordenadas válidas
    const validTrees = arboles.filter(
      (tree) => tree.latitud && tree.longitud
    );

    return validTrees.map((tree) => {
      const mapper = mapeadoresMap[tree.mapeadoPor];

      // Obtener datos del primer monitoreo
      let monitoreoData = {};
      if (tree.monitoreos && typeof tree.monitoreos === 'object') {
        const monitoreoKeys = Object.keys(tree.monitoreos);
        if (monitoreoKeys.length > 0) {
          monitoreoData = tree.monitoreos[monitoreoKeys[0]];
        }
      }

      return (
        <Marker
          key={tree.id}
          position={[tree.latitud, tree.longitud]}
          icon={customIcon}
        >
          <Popup maxWidth={300}>
            <div className="popup-content">
              <h3 style={{ color: "#268576", marginTop: 0 }}>
                {tree.nombrePropio || "Sin nombre"}
              </h3>

              {tree.nombreComun && (
                <p>
                  <strong>Nombre común:</strong> {tree.nombreComun}
                </p>
              )}

              {tree.nombreCientifico && (
                <p style={{ fontStyle: "italic" }}>
                  <strong>Nombre científico:</strong> {tree.nombreCientifico}
                </p>
              )}

              {tree.lugarDePlantacion && (
                <p>
                  <strong>Lugar:</strong> {tree.lugarDePlantacion}
                </p>
              )}

              {tree.proyecto && (
                <p>
                  <strong>Proyecto:</strong> {tree.proyecto}
                </p>
              )}

              {monitoreoData.altura && (
                <p>
                  <strong>Altura:</strong> {monitoreoData.altura}m
                </p>
              )}

              {monitoreoData.diametroAlturaPecho && (
                <p>
                  <strong>DAP:</strong> {monitoreoData.diametroAlturaPecho}cm
                </p>
              )}

              {monitoreoData.timestamp && (
                <p>
                  <strong>Fecha de mapeo:</strong> {formatDate(monitoreoData.timestamp)}
                </p>
              )}

              <hr style={{ margin: "10px 0", borderColor: "#e0e0e0" }} />

              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", color: "#268576" }}>
                  Información del Mapeador
                </h4>
                {mapper ? (
                  <>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Nombre:</strong> {mapper.nombre}
                    </p>
                    {mapper.email && (
                      <p style={{ margin: "4px 0" }}>
                        <strong>Email:</strong> {mapper.email}
                      </p>
                    )}
                    {mapper.grupo && (
                      <p style={{ margin: "4px 0" }}>
                        <strong>Grupo:</strong> {mapper.grupo}
                      </p>
                    )}
                    {mapper.rama && (
                      <p style={{ margin: "4px 0" }}>
                        <strong>Rama:</strong> {mapper.rama}
                      </p>
                    )}
                  </>
                ) : (
                  <p style={{ margin: 0 }}>
                    Información del mapeador no disponible
                  </p>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [arboles, mapeadoresMap]);

  const totalArboles = markers.length;

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Chip
          label={`${totalArboles} árbol${totalArboles !== 1 ? "es" : ""} en el mapa`}
          color="success"
          sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
        />
      </Box>

      <MapContainer
        center={[-17.3917, -66.1448]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapaProyecto;
