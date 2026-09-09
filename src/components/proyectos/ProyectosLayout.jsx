import React from "react";
import { Outlet } from "react-router-dom";
import { ProyectosProvider } from "../../context/ProyectosContext";
import { MapeoScoutProvider } from "../../context/MapeoScoutContext";

/**
 * Layout que envuelve todas las rutas de proyectos con los providers necesarios
 * Usa <Outlet /> para renderizar las rutas hijas
 */
const ProyectosLayout = () => {
  return (
    <ProyectosProvider>
      <MapeoScoutProvider>
        <Outlet />
      </MapeoScoutProvider>
    </ProyectosProvider>
  );
};

export default ProyectosLayout;
