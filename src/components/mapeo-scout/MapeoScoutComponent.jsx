import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TableChartIcon from "@mui/icons-material/TableChart";
import MapIcon from "@mui/icons-material/Map";
import GroupsIcon from "@mui/icons-material/Groups";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { MapeoScoutProvider, useMapeoScout } from "../../context/MapeoScoutContext";
import TablaMapeo from "./TablaMapeo";
import TablaGrupos from "./TablaGrupos";
import MapaMapeo from "./MapaMapeo";
import "./MapeoScoutComponent.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mapeo-tabpanel-${index}`}
      aria-labelledby={`mapeo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `mapeo-tab-${index}`,
    "aria-controls": `mapeo-tabpanel-${index}`,
  };
}

const MapeoScoutContent = () => {
  const [value, setValue] = useState(0);
  const { loading, error } = useMapeoScout();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error al cargar datos: {error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="mapeo scout tabs"
          centered={true}
        >
          <Tab
            icon={<TableChartIcon />}
            sx={{ fontFamily: "Poppins" }}
            label="PARTICIPANTES"
            {...a11yProps(0)}
          />
          <Tab
            icon={<GroupsIcon />}
            sx={{ fontFamily: "Poppins" }}
            label="GRUPOS"
            {...a11yProps(1)}
          />
          <Tab
            icon={<MapIcon />}
            sx={{ fontFamily: "Poppins" }}
            label="MAPA"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TablaMapeo />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TablaGrupos />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MapaMapeo />
      </TabPanel>
    </div>
  );
};

const MapeoScoutComponent = () => {
  return (
    <MapeoScoutProvider>
      <MapeoScoutContent />
    </MapeoScoutProvider>
  );
};

export default MapeoScoutComponent;
