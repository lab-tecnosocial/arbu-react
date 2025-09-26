import { Marker } from "react-leaflet";
import { useMemo } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useDispatch } from "react-redux";
import { setModalState } from "../../../../../actions/mapaActions";

export default function ClusterArbolesMapeados({
  arbolesMapeados,
  customIcon,
  setClickPosition
}) {
  const dispatch = useDispatch();

  if (!arbolesMapeados.isActive) return null;

  const markers = useMemo(() => {
    const items =
      arbolesMapeados.filteredData.length > 0
        ? arbolesMapeados.filteredData
        : arbolesMapeados.data;

    return items.map((item) => (
      <Marker
        key={item.id}
        position={[item.latitud, item.longitud]}
        title={item.nombrePropio}
        icon={customIcon}
        eventHandlers={{
          click: () => {
            dispatch(setModalState("OPEN", item));
            setClickPosition([item.latitud, item.longitud]);
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

