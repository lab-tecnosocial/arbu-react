import { useEffect, useReducer } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCoords } from "../../../../../actions/mapaActions";

export const MapEvents = () => {
  const dispatch = useDispatch();
  const { selectedCoords, zoom, duration } = useSelector((state) => state.mapa)
  const map = useMap();
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      dispatch(setSelectedCoords([lat, lng]));
    },
  })

  useEffect(() => {
    if (selectedCoords) {
      setTimeout(() => {
        map.invalidateSize();
        map.flyTo(selectedCoords, zoom === 18 ? zoom : map.getZoom(), { duration: duration });
      }, 200);
    }
  }, [selectedCoords, map]);

  return null
}
