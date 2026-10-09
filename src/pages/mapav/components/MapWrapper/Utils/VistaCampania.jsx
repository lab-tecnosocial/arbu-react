import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Mancha urbana del área metropolitana (Sipe Sipe a Sacaba) más Punata. Son
// límites y no un centro + zoom fijo: así el encuadre se ajusta a la pantalla
// y en un móvil tampoco se queda Punata fuera.
export const VISTA_CONCURSO_PRIMAVERA = [
  [-17.58, -66.38],
  [-17.3, -65.8],
];

/**
 * Encuadra el mapa al elegir una campaña que trae su propia vista. Solo se
 * dispara cuando cambia la campaña: después, el usuario mueve el mapa a su
 * gusto y los `flyTo` al tocar un árbol no se pisan.
 */
export const VistaCampania = ({ campaniaId, limites }) => {
  const map = useMap();

  useEffect(() => {
    if (!campaniaId || !limites) return;
    map.flyToBounds(limites, { duration: 1.2 });
    // `limites` es una constante de módulo: la campaña basta como dependencia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaniaId, map]);

  return null;
};
