import React, { createContext, useContext, useState, useEffect } from "react";
import { loadMapeoData } from "../helpers/loadMapeoData";

const MapeoScoutContext = createContext();

export const useMapeoScout = () => {
  const context = useContext(MapeoScoutContext);
  if (!context) {
    throw new Error("useMapeoScout must be used within MapeoScoutProvider");
  }
  return context;
};

export const MapeoScoutProvider = ({ children }) => {
  const [mapeadores, setMapeadores] = useState([]);
  const [arbolesMapeados, setArbolesMapeados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadMapeoData();
        setMapeadores(data.mapeadores);
        setArbolesMapeados(data.arbolesMapeados);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error in MapeoScoutContext:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    mapeadores,
    arbolesMapeados,
    loading,
    error,
  };

  return (
    <MapeoScoutContext.Provider value={value}>
      {children}
    </MapeoScoutContext.Provider>
  );
};
