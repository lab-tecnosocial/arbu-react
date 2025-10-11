import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { loadProyectos, loadProyectoById, loadArbolesProyecto, loadMapeadoresInfo } from "../helpers/loadProyectos";
import {
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
} from "../helpers/proyectoOperations";

const ProyectosContext = createContext();

export const useProyectos = () => {
  const context = useContext(ProyectosContext);
  if (!context) {
    throw new Error("useProyectos must be used within ProyectosProvider");
  }
  return context;
};

export const ProyectosProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar proyectos del usuario
  const fetchProyectos = useCallback(async () => {
    if (!user || !user.email) {
      setProyectos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await loadProyectos(user.email);
      setProyectos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error in ProyectosContext:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar proyectos al montar o cuando cambia el usuario
  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  // Crear nuevo proyecto
  const crear = async (proyectoData) => {
    if (!user || !user.email) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const result = await crearProyecto(proyectoData, user.email);

    if (result.success) {
      // Recargar proyectos después de crear
      await fetchProyectos();
    }

    return result;
  };

  // Actualizar proyecto existente
  const actualizar = async (proyectoId, proyectoData) => {
    if (!user || !user.email) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const result = await actualizarProyecto(proyectoId, proyectoData, user.email);

    if (result.success) {
      // Recargar proyectos después de actualizar
      await fetchProyectos();
    }

    return result;
  };

  // Eliminar proyecto
  const eliminar = async (proyectoId) => {
    if (!user || !user.email) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const result = await eliminarProyecto(proyectoId, user.email);

    if (result.success) {
      // Recargar proyectos después de eliminar
      await fetchProyectos();
    }

    return result;
  };

  // Obtener un proyecto por ID (con validación de ownership)
  const obtenerProyecto = async (proyectoId) => {
    if (!user || !user.email) {
      return null;
    }

    return await loadProyectoById(proyectoId, user.email);
  };

  // Obtener árboles de un proyecto
  const obtenerArbolesProyecto = async (proyecto) => {
    return await loadArbolesProyecto(proyecto);
  };

  // Obtener información de mapeadores
  const obtenerMapeadoresInfo = async (mapeadorIds) => {
    return await loadMapeadoresInfo(mapeadorIds);
  };

  const value = {
    proyectos,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    obtenerProyecto,
    obtenerArbolesProyecto,
    obtenerMapeadoresInfo,
    recargar: fetchProyectos,
  };

  return (
    <ProyectosContext.Provider value={value}>
      {children}
    </ProyectosContext.Provider>
  );
};
