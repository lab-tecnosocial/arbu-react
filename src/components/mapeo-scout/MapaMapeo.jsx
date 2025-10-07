import React, { useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Box, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import { useMapeoScout } from "../../context/MapeoScoutContext";
import locationIcon from "../mapa/location.svg";
import "../mapa/MarkerCluster.Default.css";
import "./MapaMapeo.css";

const customIcon = new L.Icon({
  iconUrl: locationIcon,
  iconSize: new L.Point(40, 47),
});

const MapaMapeo = () => {
  const { arbolesMapeados, mapeadores } = useMapeoScout();
  const [filtroGrupo, setFiltroGrupo] = useState("todos");
  const [filtroRama, setFiltroRama] = useState("todos");

  // Create a map of mapeadoPor ID to mapper info
  const mapeadoresMap = useMemo(() => {
    const map = {};
    mapeadores.forEach((mapper) => {
      map[mapper.id] = mapper;
    });
    return map;
  }, [mapeadores]);

  // Obtener lista única de grupos y ramas
  const grupos = useMemo(() => {
    const uniqueGrupos = [...new Set(mapeadores.map((m) => m.grupo).filter(Boolean))];
    return uniqueGrupos.sort();
  }, [mapeadores]);

  const ramas = useMemo(() => {
    const uniqueRamas = [...new Set(mapeadores.map((m) => m.rama).filter(Boolean))];
    return uniqueRamas.sort();
  }, [mapeadores]);

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
    // Filter trees that have valid coordinates
    let validTrees = arbolesMapeados.filter(
      (tree) => tree.latitud && tree.longitud
    );

    // Aplicar filtros
    if (filtroGrupo !== "todos" || filtroRama !== "todos") {
      validTrees = validTrees.filter((tree) => {
        const mapper = mapeadoresMap[tree.mapeadoPor];
        if (!mapper) return false;

        const cumpleGrupo = filtroGrupo === "todos" || mapper.grupo === filtroGrupo;
        const cumpleRama = filtroRama === "todos" || mapper.rama === filtroRama;

        return cumpleGrupo && cumpleRama;
      });
    }

    return validTrees.map((tree) => {
      const mapper = mapeadoresMap[tree.mapeadoPor];

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

              {tree.nombreComun && (
                <p>
                  <strong>Nombre común:</strong> {tree.nombreComun}
                </p>
              )}

              {tree.altura && (
                <p>
                  <strong>Altura:</strong> {tree.altura}m
                </p>
              )}

              {tree.diametroAlturaPecho && (
                <p>
                  <strong>DAP:</strong> {tree.diametroAlturaPecho}cm
                </p>
              )}

              {tree.timestamp && (
                <p>
                  <strong>Fecha de mapeo:</strong> {formatDate(tree.timestamp)}
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
                    {mapper.estado && (
                      <p style={{ margin: "4px 0" }}>
                        <strong>Estado:</strong> {mapper.estado}
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
  }, [arbolesMapeados, mapeadoresMap, filtroGrupo, filtroRama]);

  const totalFiltrado = markers.length;

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      {/* Filtros */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filtro-grupo-label" sx={{ fontFamily: "Poppins" }}>
            Filtrar por Grupo
          </InputLabel>
          <Select
            labelId="filtro-grupo-label"
            value={filtroGrupo}
            label="Filtrar por Grupo"
            onChange={(e) => setFiltroGrupo(e.target.value)}
            sx={{ fontFamily: "Poppins", backgroundColor: "#fff" }}
          >
            <MenuItem value="todos" sx={{ fontFamily: "Poppins" }}>
              Todos los grupos
            </MenuItem>
            {grupos.map((grupo) => (
              <MenuItem key={grupo} value={grupo} sx={{ fontFamily: "Poppins" }}>
                {grupo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filtro-rama-label" sx={{ fontFamily: "Poppins" }}>
            Filtrar por Rama
          </InputLabel>
          <Select
            labelId="filtro-rama-label"
            value={filtroRama}
            label="Filtrar por Rama"
            onChange={(e) => setFiltroRama(e.target.value)}
            sx={{ fontFamily: "Poppins", backgroundColor: "#fff" }}
          >
            <MenuItem value="todos" sx={{ fontFamily: "Poppins" }}>
              Todas las ramas
            </MenuItem>
            {ramas.map((rama) => (
              <MenuItem key={rama} value={rama} sx={{ fontFamily: "Poppins" }}>
                {rama}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Chip
          label={`Mostrando ${totalFiltrado} árbol${totalFiltrado !== 1 ? "es" : ""}`}
          color="primary"
          sx={{ fontFamily: "Poppins", fontWeight: "bold", ml: "auto" }}
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

export default MapaMapeo;
