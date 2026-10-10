import { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import { useSelector } from "react-redux";

import styles from "./MapWrapper.module.css";
import { BASEMAP_ATTRIBUTION, basemapPorTema } from "../../../../helpers/basemap";
import { MapEvents } from "./Utils/MapEvents";
import { customIcon, jacarandaIcon, iconoOculto, viveroIcon } from "./Utils/CustomIcon";
import ClusterArbolesPlantados from "./Utils/ClusterArbolesPlantados";
import ClusterArbolesMapeados from "./Utils/ClusterArbolesMapeados";
import ClusterViveros from "./Utils/ClusterViveros";
import { selectCampaniaSeleccionada } from "../../../../selectors/campanias";
import { coincideEspecie } from "../../../../helpers/campanias/especies";
import { exportarGeoJsonMunicipios } from "../../../../helpers/geo/municipios";
import { useTheme } from "../../../../context/ThemeContext";
import { EstadoMapa } from "./EstadoMapa";
import { VistaCampania, VISTA_CONCURSO_PRIMAVERA } from "./Utils/VistaCampania";

const estiloMunicipios = {
  fill: false,
  color: "#268576",
  weight: 2,
  dashArray: "4 4",
};

export const MapWrapper = () => {
  const { arbolesPlantados, arbolesMapeados, viveros } = useSelector((state) => state.arboles);
  const campania = useSelector(selectCampaniaSeleccionada);
  const { resolvedTheme } = useTheme();

  // Con especie en la campaña, solo se ven los árboles que la cumplen (con su
  // propio icono); el resto lleva un icono transparente y no se puede tocar.
  const reglasEspecie = campania?.reglas?.especies ?? null;
  const iconoDe = useCallback(
    (arbol) => {
      if (!reglasEspecie) return customIcon;
      return coincideEspecie(arbol, reglasEspecie) ? jacarandaIcon : iconoOculto;
    },
    [reglasEspecie]
  );

  // El concurso de primavera muestra cada árbol suelto: agrupar escondía
  // justo lo que la actividad quiere enseñar (cuántos jacarandás hay y dónde),
  // y además los grupos contarían los árboles ocultos. Solo este caso: el
  // resto de las capas sigue agrupando.
  const agrupar = !reglasEspecie;

  // El concurso ya abarca todo el departamento: al elegirlo, el mapa se abre
  // para enseñar el área metropolitana y Punata, no solo la ciudad.
  const limitesCampania = reglasEspecie ? VISTA_CONCURSO_PRIMAVERA : null;

  // El contorno de los municipios solo se pinta si la campaña los restringe.
  // En el concurso de primavera no se dibuja, aunque la campaña traiga municipios.
  const municipios = useMemo(
    () =>
      campania?.reglas?.municipios?.length && !reglasEspecie ? exportarGeoJsonMunicipios() : null,
    [campania, reglasEspecie]
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
        <VistaCampania campaniaId={campania?.id} limites={limitesCampania} />

        {municipios && (
          <GeoJSON key={campania.id} data={municipios} style={estiloMunicipios} interactive={false} />
        )}

        <ClusterArbolesPlantados
          arbolesPlantados={arbolesPlantados}
          customIcon={customIcon}
          iconoDe={iconoDe}
          agrupar={agrupar}
        />
        <ClusterArbolesMapeados
          arbolesMapeados={arbolesMapeados}
          customIcon={customIcon}
          iconoDe={iconoDe}
          agrupar={agrupar}
        />
        <ClusterViveros viveros={viveros} icono={viveroIcon} />
      </MapContainer>
    </div>
  );
};
