import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Alert, Box, Grid, TextField, Typography } from "@mui/material";
import { BASEMAP_URL, BASEMAP_ATTRIBUTION } from "../../helpers/basemap";
import { municipioDeCoordenada } from "../../helpers/geo/municipios";
import locationIcon from "../mapa/location.svg";

/**
 * Elegir dónde está el árbol.
 *
 * Una coordenada escrita a mano es la forma más fácil de meter basura en el
 * mapa: un signo cambiado manda el árbol al hemisferio norte y nadie lo nota
 * hasta que aparece solo en mitad del océano. Por eso el mapa y los dos campos
 * numéricos son la MISMA cosa vista de dos maneras, y debajo se dice en qué
 * municipio cae el punto: si sale "fuera del área metropolitana", algo va mal.
 */

const CENTRO_COCHABAMBA = [-17.3917, -66.1448];
const ZOOM_INICIAL = 13;

const iconoUbicacion = new L.Icon({
  iconUrl: locationIcon,
  iconSize: new L.Point(40, 47),
  iconAnchor: [20, 47],
});

/**
 * Lleva la vista al punto cuando este se fija desde fuera del mapa: los
 * metadatos de una foto, o una coordenada escrita a mano.
 *
 * Solo se mueve si el punto quedó FUERA de lo que se está viendo. Así un clic
 * o un arrastre del marcador —que caen siempre dentro de la vista— no
 * recentran el mapa bajo el cursor, que es molesto y desorienta.
 */
const SeguirPunto = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    if (map.getBounds().contains([lat, lon])) return;
    map.setView([lat, lon], Math.max(map.getZoom(), 17));
  }, [map, lat, lon]);

  return null;
};

const ClicEnElMapa = ({ onElegir }) => {
  useMapEvents({
    click(e) {
      onElegir(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const SelectorUbicacion = ({ latitud, longitud, onCambiar, errores = {} }) => {
  const arrastre = useRef(null);

  const lat = Number(String(latitud).replace(",", "."));
  const lon = Number(String(longitud).replace(",", "."));
  const hayPunto = Number.isFinite(lat) && Number.isFinite(lon) && !(lat === 0 && lon === 0);

  const municipio = useMemo(
    () => (hayPunto ? municipioDeCoordenada(lat, lon) : null),
    [hayPunto, lat, lon]
  );

  // Cinco decimales son ~1 m: más precisión es ruido y ensucia el diff.
  const elegir = (nuevaLat, nuevaLon) => {
    onCambiar({
      latitud: nuevaLat.toFixed(5),
      longitud: nuevaLon.toFixed(5),
    });
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={6}>
          <TextField
            label="Latitud"
            value={latitud}
            onChange={(e) => onCambiar({ latitud: e.target.value })}
            error={Boolean(errores.latitud)}
            helperText={errores.latitud}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Longitud"
            value={longitud}
            onChange={(e) => onCambiar({ longitud: e.target.value })}
            error={Boolean(errores.longitud)}
            helperText={errores.longitud}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary">
        Hacé clic en el mapa o arrastrá el marcador para fijar la ubicación.
      </Typography>

      <Box sx={{ height: 320, mt: 1, borderRadius: 1, overflow: "hidden" }}>
        <MapContainer
          center={hayPunto ? [lat, lon] : CENTRO_COCHABAMBA}
          zoom={hayPunto ? 17 : ZOOM_INICIAL}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url={BASEMAP_URL} attribution={BASEMAP_ATTRIBUTION} />
          <ClicEnElMapa onElegir={elegir} />
          <SeguirPunto lat={hayPunto ? lat : null} lon={hayPunto ? lon : null} />
          {hayPunto && (
            <Marker
              position={[lat, lon]}
              icon={iconoUbicacion}
              draggable
              ref={arrastre}
              eventHandlers={{
                dragend: (e) => {
                  const { lat: nl, lng: nn } = e.target.getLatLng();
                  elegir(nl, nn);
                },
              }}
            />
          )}
        </MapContainer>
      </Box>

      {hayPunto && (
        <Alert severity={municipio ? "info" : "warning"} sx={{ mt: 1 }}>
          {municipio
            ? `El punto cae en ${municipio.nombre}.`
            : "El punto queda fuera del área metropolitana de Cochabamba. Revisá las coordenadas."}
        </Alert>
      )}
    </Box>
  );
};

export default SelectorUbicacion;
