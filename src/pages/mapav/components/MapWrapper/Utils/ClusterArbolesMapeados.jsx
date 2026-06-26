import { Marker } from "react-leaflet";
import { useMemo } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useDispatch } from "react-redux";
import { setPanelState, setSelectedCoords, setSelectedTree } from "../../../../../actions/mapaActions";

export default function ClusterArbolesMapeados({
  arbolesMapeados,
  customIcon,
}) {
  const dispatch = useDispatch();

  if (!arbolesMapeados.isActive) return null;

  const markers = useMemo(() => {
    const arboles =
      arbolesMapeados.filteredData.length > 0
        ? arbolesMapeados.filteredData
        : arbolesMapeados.data;

    return arboles.map((arbol, index) => (
      <Marker
        key={arbol.id}
        position={[arbol.latitud, arbol.longitud]}
        title={arbol.nombrePropio}
        icon={customIcon}
        eventHandlers={{
          click: () => {
            dispatch(setPanelState("OPEN"));
            dispatch(setSelectedTree(index, arbol));
            dispatch(setSelectedCoords([arbol.latitud, arbol.longitud], 18, 1.5));
          },
        }}
      />
    ));
  }, [arbolesMapeados.filteredData, arbolesMapeados.data, dispatch]);

  return (
    <MarkerClusterGroup chunkedLoading>
      {markers}
    </MarkerClusterGroup>
  );
}

