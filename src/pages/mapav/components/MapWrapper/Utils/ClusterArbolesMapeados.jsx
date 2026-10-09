import { Marker } from "react-leaflet";
import { useMemo } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useDispatch } from "react-redux";
import { setPanelState, setSelectedCoords, setSelectedTree } from "../../../../../actions/mapaActions";

export default function ClusterArbolesMapeados({
  arbolesMapeados,
  customIcon,
  iconoDe,
  agrupar = true,
}) {
  const dispatch = useDispatch();

  const markers = useMemo(() => {
    return arbolesMapeados.visibleData.map((arbol, index) => (
      <Marker
        key={arbol.id}
        position={[arbol.latitud, arbol.longitud]}
        title={arbol.nombrePropio}
        icon={iconoDe ? iconoDe(arbol) : customIcon}
        eventHandlers={{
          click: () => {
            dispatch(setPanelState("OPEN"));
            dispatch(setSelectedTree(index, arbol));
            dispatch(setSelectedCoords([arbol.latitud, arbol.longitud], 18, 1.5));
          },
        }}
      />
    ));
  }, [arbolesMapeados.visibleData, customIcon, iconoDe, dispatch]);

  // El return condicional va DESPUÉS de los hooks: si no, alternar la capa cambia
  // el número de hooks entre renders y React lanza "Rendered more hooks…".
  if (!arbolesMapeados.isActive) return null;

  // Sin agrupar, los marcadores cuelgan directo del mapa.
  if (!agrupar) return <>{markers}</>;

  return (
    <MarkerClusterGroup chunkedLoading>
      {markers}
    </MarkerClusterGroup>
  );
}
