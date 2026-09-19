import { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import { useSelector } from "react-redux";

import styles from "./MapWrapper.module.css";
import { BASEMAP_ATTRIBUTION, basemapPorTema } from "../../../../helpers/basemap";
import { MapEvents } from "./Utils/MapEvents";
import { customIcon, jacarandaIcon } from "./Utils/CustomIcon";
import ClusterArbolesPlantados from "./Utils/ClusterArbolesPlantados";
import ClusterArbolesMapeados from "./Utils/ClusterArbolesMapeados";
import { selectCampaniaSeleccionada } from "../../../../selectors/campanias";
import { coincideEspecie } from "../../../../helpers/campanias/especies";
import { exportarGeoJsonMunicipios } from "../../../../helpers/geo/municipios";
import { useTheme } from "../../../../context/ThemeContext";
import { EstadoMapa } from "./EstadoMapa";

const estiloMunicipios = {
  fill: false,
  color: "#268576",
  weight: 2,
  dashArray: "4 4",
};

export const MapWrapper = () => {
  const { arbolesPlantados, arbolesMapeados } = useSelector((state) => state.arboles);
  const campania = useSelector(selectCampaniaSeleccionada);
  const { resolvedTheme } = useTheme();

  // Los árboles que cumplen la especie de la campaña llevan su propio icono.
  // La especie no oculta nada: solo cambia el pin.
  const reglasEspecie = campania?.reglas?.especies ?? null;
  const iconoDe = useCallback(
    (arbol) => (reglasEspecie && coincideEspecie(arbol, reglasEspecie) ? jacarandaIcon : customIcon),
    [reglasEspecie]
  );

  // El contorno de los municipios solo se pinta si la campaña los restringe.
  const municipios = useMemo(
    () => (campania?.reglas?.municipios?.length ? exportarGeoJsonMunicipios() : null),
    [campania]
  );

  return (
    <div className={styles.map}>
      <EstadoMapa />

      <MapContainer
        center={[-17.3917, -66.1448]}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          key={resolvedTheme}
          attribution={BASEMAP_ATTRIBUTION}
          url={basemapPorTema(resolvedTheme)}
        />

        <MapEvents />

        {municipios && (
          <GeoJSON key={campania.id} data={municipios} style={estiloMunicipios} interactive={false} />
        )}

        <ClusterArbolesPlantados
          arbolesPlantados={arbolesPlantados}
          customIcon={customIcon}
          iconoDe={iconoDe}
        />
        <ClusterArbolesMapeados
          arbolesMapeados={arbolesMapeados}
          customIcon={customIcon}
          iconoDe={iconoDe}
        />
      </MapContainer>
    </div>
  );
};
