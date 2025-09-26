import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export const MapEvents = ({ setMarkerCoords, markerCoords }) => {
  const map = useMap();
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerCoords([lat, lng]);
      map.flyTo([lat, lng], map.getZoom(), { duration: 1.5 });
    },
  })

  useEffect(() => {
    if (markerCoords) {
      setTimeout(() => {
        map.invalidateSize();
        map.flyTo(markerCoords, map.getZoom(), { duration: .5 });
      }, 100);
    }
  }, [markerCoords, map]);

  return null
}
