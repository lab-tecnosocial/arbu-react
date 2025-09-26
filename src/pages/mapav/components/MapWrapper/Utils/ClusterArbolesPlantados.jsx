import { Marker } from "react-leaflet";
import { useMemo } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useDispatch } from "react-redux";
import { setModalState } from "../../../../../actions/mapaActions";

export default function ClusterArbolesPlantados({
  arbolesPlantados,
  customIcon,
  setClickPosition
}) {
  const dispatch = useDispatch();

  if (!arbolesPlantados.isActive) return null;

  const markers = useMemo(() => {
    const items =
      arbolesPlantados.filteredData.length > 0
        ? arbolesPlantados.filteredData
        : arbolesPlantados.data;

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
  }, [arbolesPlantados.filteredData, arbolesPlantados.data, dispatch]);


  return (
    <MarkerClusterGroup chunkedLoading>
      {markers}
    </MarkerClusterGroup>
  );
}

