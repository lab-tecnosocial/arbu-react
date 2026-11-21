import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useSelector } from "react-redux";
import { atribucionBasemap, urlBasemap } from "../../helpers/basemap";
import { ACCEPT_FOTOS } from "../../helpers/aportes/subirFoto";
import { actualizarVivero, guardarVivero } from "../../helpers/guardarViveroFirestore";
import { ubicacionDeVivero } from "../../helpers/viveros";
import { useTheme } from "../../context/ThemeContext";
import { especies } from "../mapa/filtro/especies";

const CENTRO_COCHABAMBA = [-17.3917, -66.1448];

const marcadorVivero = new L.Icon({
  iconUrl: "/icons/vivero.png",
  iconSize: [44, 44],
  iconAnchor: [22, 42],
});

const FORM_VACIO = {
  nombre: "",
  descripcion: "",
  contactoCorreo: "",
  contactoTelefono: "",
  especies: [],
  foto: null,
};

const correoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

const opcionesEspecies = especies.map((especie) => ({
  nombreComun: especie.nombreComun,
  nombreCientifico: especie.nombreCientifico,
}));

const formDesdeVivero = (vivero) => ({
  nombre: vivero?.nombre ?? "",
  descripcion: vivero?.descripcion ?? "",
  contactoCorreo: vivero?.contactoCorreo ?? "",
  contactoTelefono: String(vivero?.contactoTelefono ?? ""),
  especies: (vivero?.especies ?? []).map((especie) => {
    const nombreComun = typeof especie === "string" ? especie : especie.nombreComun;
    return (
      opcionesEspecies.find((opcion) => opcion.nombreComun === nombreComun) ?? {
        nombreComun,
        nombreCientifico: "",
      }
    );
  }),
  foto: null,
});

const ubicacionDesdeVivero = (vivero) => {
  const ubicacion = ubicacionDeVivero(vivero);
  return ubicacion ? L.latLng(ubicacion.latitud, ubicacion.longitud) : null;
};

const fotoGuardada = (vivero) =>
  typeof vivero?.foto === "string" && vivero.foto.length > 0 ? vivero.foto : null;

const CapturarClickMapa = ({ onPunto }) => {
  useMapEvents({
    click: (evento) => onPunto(evento.latlng),
  });

  return null;
};

const AjustarTamanoMapa = () => {
  const mapa = useMap();

  useEffect(() => {
    const temporizador = setTimeout(() => mapa.invalidateSize(), 200);
    return () => clearTimeout(temporizador);
  }, [mapa]);

  return null;
};

const RegistrarViveroDialog = ({ abierto, vivero = null, onCerrar, onGuardado }) => {
  const user = useSelector((state) => state.auth.user);
  const { resolvedTheme } = useTheme();
  const colorMarca = resolvedTheme === "dark" ? "var(--green3)" : "var(--green2)";
  const [form, setForm] = useState(() => (vivero ? formDesdeVivero(vivero) : FORM_VACIO));
  const [fotoActual, setFotoActual] = useState(() => fotoGuardada(vivero));
  const [ubicacion, setUbicacion] = useState(() => ubicacionDesdeVivero(vivero));
  const [intentado, setIntentado] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [progreso, setProgreso] = useState(0);

  const esEdicion = Boolean(vivero?.id);

  useEffect(() => {
    if (!abierto) return;
    setForm(vivero ? formDesdeVivero(vivero) : FORM_VACIO);
    setFotoActual(fotoGuardada(vivero));
    setUbicacion(ubicacionDesdeVivero(vivero));
    setIntentado(false);
    setMensaje(null);
    setGuardando(false);
    setProgreso(0);
  }, [abierto, vivero]);

  const preview = useMemo(() => {
    if (form.foto) return URL.createObjectURL(form.foto);
    return fotoActual;
  }, [form.foto, fotoActual]);

  useEffect(() => {
    if (!form.foto) return undefined;
    return () => URL.revokeObjectURL(preview);
  }, [form.foto, preview]);

  const errores = {
    nombre: form.nombre.trim() ? "" : "Ingresa el nombre del vivero.",
    contactoCorreo: correoValido(form.contactoCorreo.trim())
      ? ""
      : "Ingresa un correo válido.",
    contactoTelefono: /^\d{7,}$/.test(form.contactoTelefono)
      ? ""
      : "Ingresa solo números (mínimo 7 dígitos).",
    ubicacion: ubicacion ? "" : "Selecciona un punto en el mapa.",
  };

  const hayErrores = Object.values(errores).some(Boolean);

  const actualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setMensaje(null);
  };

  const seleccionarUbicacion = (latlng) => {
    setUbicacion(latlng);
    setMensaje(null);
  };

  const quitarImagen = () => {
    setForm((prev) => ({ ...prev, foto: null }));
    setFotoActual(null);
    setMensaje(null);
  };

  const guardar = async () => {
    setIntentado(true);
    if (hayErrores) return;

    setGuardando(true);
    setMensaje(null);
    setProgreso(0);

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      contactoCorreo: form.contactoCorreo.trim(),
      contactoTelefono: form.contactoTelefono,
      ubicacion: {
        latitud: ubicacion.lat,
        longitud: ubicacion.lng,
      },
      especies: form.especies.map((especie) => especie.nombreComun),
    };

    const resultado = esEdicion
      ? await actualizarVivero(
          vivero.id,
          { ...datos, actualizadoPor: user?.email ?? null },
          form.foto,
          setProgreso,
          { quitarFoto: !form.foto && !fotoActual }
        )
      : await guardarVivero(
          { ...datos, creadoPor: user?.email ?? null },
          form.foto,
          setProgreso
        );

    setGuardando(false);

    if (!resultado.success) {
      setMensaje({ severity: "error", texto: resultado.error });
      return;
    }

    onGuardado?.(resultado.id);
    onCerrar();
  };

  return (
    <Dialog
      open={abierto}
      onClose={onCerrar}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: "var(--color-surface)",
          backgroundImage: "none",
          color: "var(--color-text)",
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: 600, color: colorMarca }}>
        {esEdicion ? "Editar vivero" : "Registrar vivero"}
        <Typography
          variant="caption"
          sx={{ display: "block", fontFamily: "Poppins", color: "var(--color-text-muted)" }}
        >
          {esEdicion
            ? "Actualiza los datos y la ubicación del vivero."
            : "Completa los datos y marca la ubicación exacta en el mapa."}
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          borderColor: "var(--color-border)",
          "& .MuiInputBase-input, & .MuiInputLabel-root, & .MuiFormHelperText-root, & .MuiChip-label": {
            fontFamily: "Poppins",
          },
          "& .MuiInputBase-input": {
            color: "var(--color-text)",
          },
          "& .MuiInputLabel-root": {
            color: "var(--color-text-secondary)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-border-strong)",
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-text-muted)",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "var(--color-text-muted)",
            opacity: 1,
          },
          "& .MuiFormHelperText-root": {
            color: "var(--color-text-muted)",
          },
          "& .MuiChip-root": {
            backgroundColor: "var(--color-bg-muted)",
            color: "var(--color-text)",
          },
        }}
      >
        {guardando && (
          <LinearProgress
            variant={progreso > 0 && progreso < 100 ? "determinate" : "indeterminate"}
            value={progreso}
            sx={{ mb: 2, borderRadius: 1 }}
          />
        )}
        {mensaje && (
          <Alert severity={mensaje.severity} sx={{ mb: 2, fontFamily: "Poppins" }}>
            {mensaje.texto}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nombre del vivero"
                  value={form.nombre}
                  onChange={(e) => actualizar("nombre", e.target.value)}
                  error={Boolean(errores.nombre) && (intentado || Boolean(form.nombre))}
                  helperText={
                    Boolean(errores.nombre) && (intentado || Boolean(form.nombre))
                      ? errores.nombre
                      : ""
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  minRows={3}
                  label="Descripción"
                  value={form.descripcion}
                  onChange={(e) => actualizar("descripcion", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Contacto correo"
                  type="email"
                  value={form.contactoCorreo}
                  onChange={(e) => actualizar("contactoCorreo", e.target.value)}
                  error={
                    Boolean(errores.contactoCorreo) &&
                    (intentado || Boolean(form.contactoCorreo))
                  }
                  helperText={
                    Boolean(errores.contactoCorreo) &&
                    (intentado || Boolean(form.contactoCorreo))
                      ? errores.contactoCorreo
                      : ""
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Contacto teléfono"
                  inputMode="numeric"
                  value={form.contactoTelefono}
                  onChange={(e) =>
                    actualizar("contactoTelefono", e.target.value.replace(/\D/g, ""))
                  }
                  error={
                    Boolean(errores.contactoTelefono) &&
                    (intentado || Boolean(form.contactoTelefono))
                  }
                  helperText={
                    Boolean(errores.contactoTelefono) &&
                    (intentado || Boolean(form.contactoTelefono))
                      ? errores.contactoTelefono
                      : "Solo números."
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={opcionesEspecies}
                  value={form.especies}
                  onChange={(evento, valor) => actualizar("especies", valor)}
                  getOptionLabel={(opcion) =>
                    `${opcion.nombreComun} · ${opcion.nombreCientifico}`
                  }
                  isOptionEqualToValue={(opcion, valor) =>
                    opcion.nombreComun === valor.nombreComun
                  }
                  componentsProps={{
                    paper: {
                      sx: {
                        backgroundColor: "var(--color-surface-elevated)",
                        color: "var(--color-text)",
                        "& .MuiAutocomplete-option": {
                          color: "var(--color-text)",
                        },
                        "& .MuiAutocomplete-option[aria-selected='true']": {
                          backgroundColor: "var(--color-bg-muted)",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Especies del vivero"
                      placeholder="Buscar especie"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: 600, mb: 1 }}>
                  Foto o imagen
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    fontFamily: "Poppins",
                    textTransform: "none",
                    color: colorMarca,
                    borderColor: colorMarca,
                    "&:hover": {
                      borderColor: colorMarca,
                      backgroundColor: "var(--color-bg-muted)",
                    },
                  }}
                >
                  Seleccionar imagen
                  <input
                    hidden
                    type="file"
                    accept={ACCEPT_FOTOS}
                    onChange={(e) => actualizar("foto", e.target.files?.[0] ?? null)}
                  />
                </Button>
                {preview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={preview}
                      alt="Vista previa del vivero"
                      style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={quitarImagen}
                      sx={{ mt: 1, fontFamily: "Poppins", textTransform: "none" }}
                    >
                      Quitar imagen
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: 600, mb: 1 }}>
              Ubicación
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", fontFamily: "Poppins", color: "var(--color-text-muted)", mb: 1 }}
            >
              Haz clic en el mapa para marcar el punto.
            </Typography>

            <Box
              sx={{
                height: 300,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor:
                  errores.ubicacion && intentado ? "error.main" : "var(--color-border)",
              }}
            >
              <MapContainer
                center={CENTRO_COCHABAMBA}
                zoom={13}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  key={resolvedTheme}
                  attribution={atribucionBasemap()}
                  url={urlBasemap(resolvedTheme)}
                />
                <AjustarTamanoMapa />
                <CapturarClickMapa onPunto={seleccionarUbicacion} />
                {ubicacion && (
                  <Marker
                    position={ubicacion}
                    icon={marcadorVivero}
                    draggable
                    eventHandlers={{
                      dragend: (evento) => seleccionarUbicacion(evento.target.getLatLng()),
                    }}
                  />
                )}
              </MapContainer>
            </Box>

            {ubicacion ? (
              <Typography variant="body2" sx={{ mt: 1, fontFamily: "Poppins" }}>
                Latitud: {ubicacion.lat.toFixed(6)} · Longitud: {ubicacion.lng.toFixed(6)}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontFamily: "Poppins",
                  color:
                    errores.ubicacion && intentado ? "error.main" : "var(--color-text-muted)",
                }}
              >
                {errores.ubicacion && intentado
                  ? errores.ubicacion
                  : "Todavía no marcaste ningún punto."}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onCerrar}
          disabled={guardando}
          sx={{
            fontFamily: "Poppins",
            textTransform: "none",
            color: "var(--color-text-secondary)",
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={guardar}
          disabled={guardando}
          sx={{
            fontFamily: "Poppins",
            textTransform: "none",
            backgroundColor: "var(--green2)",
            "&:hover": { backgroundColor: "var(--green)" },
          }}
        >
          {guardando
            ? "Guardando…"
            : esEdicion
              ? "Guardar nuevos cambios"
              : "Guardar vivero"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegistrarViveroDialog;
