import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { atribucionBasemap, urlBasemap } from "../../helpers/basemap";
import { ubicacionDeVivero } from "../../helpers/viveros";
import { useTheme } from "../../context/ThemeContext";

const marcadorVivero = new L.Icon({
  iconUrl: "/icons/vivero.png",
  iconSize: [44, 44],
  iconAnchor: [22, 42],
});

const AjustarTamanoMapa = () => {
  const mapa = useMap();

  useEffect(() => {
    const temporizador = setTimeout(() => mapa.invalidateSize(), 200);
    return () => clearTimeout(temporizador);
  }, [mapa]);

  return null;
};

const MapaViveroDialog = ({ abierto, vivero, onCerrar }) => {
  const { resolvedTheme } = useTheme();
  const ubicacion = ubicacionDeVivero(vivero);
  const centro = ubicacion ? [ubicacion.latitud, ubicacion.longitud] : null;
  const colorMarca = resolvedTheme === "dark" ? "var(--green3)" : "var(--green2)";

  return (
    <Dialog
      open={abierto}
      onClose={onCerrar}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "var(--color-surface)",
          backgroundImage: "none",
          color: "var(--color-text)",
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: 600, color: colorMarca }}>
        {vivero?.nombre ?? "Vivero"}
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: "var(--color-border)" }}>
        {centro ? (
          <>
            <Box
              sx={{
                height: 360,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "var(--color-border)",
              }}
            >
              <MapContainer
                center={centro}
                zoom={16}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  key={resolvedTheme}
                  attribution={atribucionBasemap()}
                  url={urlBasemap(resolvedTheme)}
                />
                <AjustarTamanoMapa />
                <Marker position={centro} icon={marcadorVivero} />
              </MapContainer>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, fontFamily: "Poppins" }}>
              Latitud: {ubicacion.latitud.toFixed(6)} · Longitud: {ubicacion.longitud.toFixed(6)}
            </Typography>
          </>
        ) : (
          <Typography sx={{ fontFamily: "Poppins", color: "var(--color-text-muted)" }}>
            Este vivero no tiene ubicación registrada.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCerrar}
          sx={{
            fontFamily: "Poppins",
            textTransform: "none",
            color: "var(--color-text-secondary)",
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapaViveroDialog;
