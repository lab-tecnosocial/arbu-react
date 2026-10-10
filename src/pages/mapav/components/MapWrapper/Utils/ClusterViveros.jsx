import { Marker } from "react-leaflet";
import { useMemo } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useDispatch } from "react-redux";
import { setPanelState, setSelectedCoords, setSelectedTree } from "../../../../../actions/mapaActions";

export default function ClusterViveros({ viveros, icono }) {
  const dispatch = useDispatch();

  const markers = useMemo(() => {
    return viveros.data.map((vivero, index) => (
      <Marker
        key={vivero.id}
        position={[vivero.latitud, vivero.longitud]}
        title={vivero.nombre}
        icon={icono}
        eventHandlers={{
          click: () => {
            dispatch(setPanelState("OPEN"));
            dispatch(setSelectedTree(index, vivero));
            dispatch(setSelectedCoords([vivero.latitud, vivero.longitud], 18, 1.5));
          },
        }}
      />
    ));
  }, [viveros.data, icono, dispatch]);

  if (!viveros.isActive) return null;

  return (
    <MarkerClusterGroup chunkedLoading>
      {markers}
    </MarkerClusterGroup>
  );
}
