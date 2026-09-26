import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TableChartIcon from "@mui/icons-material/TableChart";
import MapIcon from "@mui/icons-material/Map";
import { useProyectos } from "../../context/ProyectosContext";
import { useMapeoScout } from "../../context/MapeoScoutContext";
import TablaArbolesProyecto from "./TablaArbolesProyecto";
import MapaProyecto from "./MapaProyecto";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`proyecto-tabpanel-${index}`}
      aria-labelledby={`proyecto-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `proyecto-tab-${index}`,
    "aria-controls": `proyecto-tabpanel-${index}`,
  };
}

const DetalleProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerProyecto, obtenerArbolesProyecto, obtenerMapeadoresInfo } = useProyectos();
  const { mapeadores: todosLosMapeadores } = useMapeoScout();

  const [tabValue, setTabValue] = useState(0);
  const [proyecto, setProyecto] = useState(null);
  const [arboles, setArboles] = useState([]);
  const [mapeadores, setMapeadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProyecto = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar proyecto
        const proyectoData = await obtenerProyecto(id);

        if (!proyectoData) {
          setError("Proyecto no encontrado o no tienes permiso para verlo");
          setLoading(false);
          return;
        }

        setProyecto(proyectoData);

        // Cargar árboles del proyecto
        const arbolesData = await obtenerArbolesProyecto(proyectoData);
        setArboles(arbolesData);

        // Cargar información de mapeadores
        if (proyectoData.idMapeadores && proyectoData.idMapeadores.length > 0) {
          const mapeadoresData = await obtenerMapeadoresInfo(proyectoData.idMapeadores);
          setMapeadores(mapeadoresData);
        }
      } catch (err) {
        console.error("Error al cargar proyecto:", err);
        setError(err.message || "Error al cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    cargarProyecto();
  }, [id, obtenerProyecto, obtenerArbolesProyecto, obtenerMapeadoresInfo]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleVolver = () => {
    navigate("/proyectos");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Crear un mapa de mapeadores por ID (similar a MapeoScout)
  const mapeadoresMap = useMemo(() => {
    const map = {};
    todosLosMapeadores.forEach((mapper) => {
      map[mapper.id] = mapper;
    });
    return map;
  }, [todosLosMapeadores]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !proyecto) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Proyecto no encontrado"}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleVolver}
          sx={{ mt: 2, fontFamily: "Poppins" }}
        >
          Volver a Proyectos
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header del proyecto */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: "#f5f5f5" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleVolver}
          sx={{ mb: 2, fontFamily: "Poppins" }}
        >
          Volver a Proyectos
        </Button>

        <Typography
          variant="h4"
          sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#268576", mb: 2 }}
        >
          {proyecto.nombreProyecto}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <Chip
            label={`Inicio: ${formatDate(proyecto.fechaInicio)}`}
            sx={{ fontFamily: "Poppins" }}
          />
          <Chip
            label={`Fin: ${formatDate(proyecto.fechaFin)}`}
            sx={{ fontFamily: "Poppins" }}
          />
          <Chip
            label={`${mapeadores.length} mapeador${mapeadores.length !== 1 ? "es" : ""}`}
            color="primary"
            sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
          />
          <Chip
            label={`${arboles.length} árbol${arboles.length !== 1 ? "es" : ""}`}
            color="success"
            sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
          />
        </Box>

        {mapeadores.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
              Mapeadores:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {mapeadores.map((mapeador) => (
                <Chip
                  key={mapeador.id}
                  label={`${mapeador.nombre || "Sin nombre"} (${mapeador.email || "Sin email"})`}
                  size="small"
                  sx={{ fontFamily: "Poppins" }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="proyecto tabs"
          centered={true}
        >
          <Tab
            icon={<TableChartIcon />}
            sx={{ fontFamily: "Poppins" }}
            label="TABLA DE ÁRBOLES"
            {...a11yProps(0)}
          />
          <Tab
            icon={<MapIcon />}
            sx={{ fontFamily: "Poppins" }}
            label="MAPA"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TablaArbolesProyecto arboles={arboles} mapeadoresMap={mapeadoresMap} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <MapaProyecto arboles={arboles} mapeadoresMap={mapeadoresMap} />
      </TabPanel>
    </Box>
  );
};

export default DetalleProyecto;
