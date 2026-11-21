import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MapIcon from "@mui/icons-material/Map";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { startLoadingViveros } from "../../actions/viveros.actions";
import { eliminarVivero } from "../../helpers/guardarViveroFirestore";
import { ubicacionDeVivero } from "../../helpers/viveros";
import { useTheme } from "../../context/ThemeContext";
import MapaViveroDialog from "./MapaViveroDialog";
import RegistrarViveroDialog from "./RegistrarViveroDialog";

const coordenadas = (ubicacion) =>
  `${ubicacion.latitud.toFixed(6)}, ${ubicacion.longitud.toFixed(6)}`;

const ListaViveros = () => {
  const dispatch = useDispatch();
  const { data: viveros, loading, error } = useSelector((state) => state.viveros);
  const { resolvedTheme } = useTheme();
  const colorMarca = resolvedTheme === "dark" ? "var(--green3)" : "var(--green2)";
  const colorPeligro =
    resolvedTheme === "dark" ? "var(--persian-red-400)" : "var(--persian-red-600)";
  const colorTituloPeligro =
    resolvedTheme === "dark" ? "var(--color-text)" : "error.main";
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [viveroEditando, setViveroEditando] = useState(null);
  const [viveroEliminando, setViveroEliminando] = useState(null);
  const [viveroMapa, setViveroMapa] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);

  useEffect(() => {
    dispatch(startLoadingViveros());
  }, [dispatch]);

  const abrirEliminacion = (vivero) => {
    setErrorEliminar(null);
    setViveroEliminando(vivero);
  };

  const cerrarEliminacion = () => {
    if (eliminando) return;
    setViveroEliminando(null);
    setErrorEliminar(null);
  };

  const confirmarEliminacion = async () => {
    if (!viveroEliminando) return;

    setEliminando(true);
    setErrorEliminar(null);

    const resultado = await eliminarVivero(viveroEliminando.id);

    setEliminando(false);

    if (!resultado.success) {
      setErrorEliminar(resultado.error);
      return;
    }

    setViveroEliminando(null);
    dispatch(startLoadingViveros({ forzar: true }));
  };

  const abrirRegistro = () => {
    setViveroEditando(null);
    setDialogoAbierto(true);
  };

  const abrirEdicion = (vivero) => {
    setViveroEditando(vivero);
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "Poppins", fontWeight: 700, color: colorMarca }}>
            Viveros
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "var(--color-text-muted)" }}>
            Registro y consulta de los viveros de Cochabamba.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(startLoadingViveros({ forzar: true }))}
            disabled={loading}
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
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddBusinessIcon />}
            onClick={abrirRegistro}
            sx={{
              fontFamily: "Poppins",
              textTransform: "none",
              backgroundColor: "var(--green2)",
              "&:hover": { backgroundColor: "var(--green)" },
            }}
          >
            Registrar vivero
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontFamily: "Poppins" }}>
          No se pudieron cargar los viveros: {error}
        </Alert>
      )}

      {loading && viveros.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
          <CircularProgress sx={{ color: colorMarca }} />
        </Box>
      ) : viveros.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", backgroundColor: "var(--color-surface)" }}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, mb: 1 }}>
            Todavía no hay viveros registrados
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "var(--color-text-muted)", mb: 2 }}>
            Usa el botón “Registrar vivero” para crear el primero.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddBusinessIcon />}
            onClick={abrirRegistro}
            sx={{
              fontFamily: "Poppins",
              textTransform: "none",
              backgroundColor: "var(--green2)",
              "&:hover": { backgroundColor: "var(--green)" },
            }}
          >
            Registrar vivero
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ overflowX: "auto", backgroundColor: "var(--color-surface)" }}>
          <Table
            sx={{
              "& .MuiTableCell-root": {
                color: "var(--color-text)",
                borderBottomColor: "var(--color-border)",
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "var(--color-bg-muted)",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {["Nombre", "Contacto", "Ubicación", "Especies", "Foto"].map((encabezado) => (
                  <TableCell
                    key={encabezado}
                    sx={{ fontFamily: "Poppins", fontWeight: 700, color: colorMarca }}
                  >
                    {encabezado}
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{ fontFamily: "Poppins", fontWeight: 700, color: colorMarca }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {viveros.map((vivero) => {
                const especiesVivero = vivero.especies ?? [];
                const ubicacion = ubicacionDeVivero(vivero);

                return (
                  <TableRow key={vivero.id} hover>
                    <TableCell sx={{ fontFamily: "Poppins", minWidth: 180 }}>
                      <Typography sx={{ fontFamily: "Poppins", fontWeight: 600 }}>
                        {vivero.nombre ?? "Sin nombre"}
                      </Typography>
                      {vivero.descripcion && (
                        <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "var(--color-text-muted)" }}>
                          {vivero.descripcion}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins", minWidth: 180 }}>
                      {vivero.contactoCorreo && <div>{vivero.contactoCorreo}</div>}
                      {vivero.contactoTelefono && <div>{vivero.contactoTelefono}</div>}
                      {!vivero.contactoCorreo && !vivero.contactoTelefono && "Sin contacto"}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins", minWidth: 200 }}>
                      {ubicacion ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {coordenadas(ubicacion)}
                          <Tooltip title="Ver mapa">
                            <IconButton
                              size="small"
                              onClick={() => setViveroMapa(vivero)}
                              aria-label={`Ver mapa de ${vivero.nombre ?? "vivero"}`}
                              sx={{ color: colorMarca }}
                            >
                              <MapIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        "Sin ubicación"
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 220 }}>
                      {especiesVivero.length === 0 ? (
                        <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "var(--color-text-muted)" }}>
                          Sin especies
                        </Typography>
                      ) : (
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                          {especiesVivero.map((especie) => (
                            <Chip
                              key={typeof especie === "string" ? especie : especie.nombreComun}
                              size="small"
                              label={typeof especie === "string" ? especie : especie.nombreComun}
                              sx={{
                                fontFamily: "Poppins",
                                backgroundColor: "var(--color-bg-muted)",
                                color: "var(--color-text)",
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {typeof vivero.foto === "string" && vivero.foto.startsWith("http") ? (
                        <img
                          src={vivero.foto}
                          alt={vivero.nombre}
                          style={{ width: 72, height: 52, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "var(--color-text-muted)" }}>
                          Sin imagen
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                        <Tooltip title="Editar vivero">
                          <IconButton
                            size="small"
                            onClick={() => abrirEdicion(vivero)}
                            aria-label={`Editar ${vivero.nombre ?? "vivero"}`}
                            sx={{ color: colorMarca }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar vivero">
                          <IconButton
                            size="small"
                            onClick={() => abrirEliminacion(vivero)}
                            aria-label={`Eliminar ${vivero.nombre ?? "vivero"}`}
                            sx={{ color: colorPeligro }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      <RegistrarViveroDialog
        key={viveroEditando?.id ?? "nuevo"}
        abierto={dialogoAbierto}
        vivero={viveroEditando}
        onCerrar={cerrarDialogo}
        onGuardado={() => dispatch(startLoadingViveros({ forzar: true }))}
      />

      <MapaViveroDialog
        abierto={Boolean(viveroMapa)}
        vivero={viveroMapa}
        onCerrar={() => setViveroMapa(null)}
      />

      <Dialog
        open={Boolean(viveroEliminando)}
        onClose={cerrarEliminacion}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "var(--color-surface)",
            backgroundImage: "none",
            color: "var(--color-text)",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: 600, color: colorTituloPeligro }}>
          Eliminar vivero
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "var(--color-border)" }}>
          {errorEliminar && (
            <Alert severity="error" sx={{ mb: 2, fontFamily: "Poppins" }}>
              {errorEliminar}
            </Alert>
          )}
          <Typography sx={{ fontFamily: "Poppins" }}>
            ¿Seguro que quieres eliminar “{viveroEliminando?.nombre ?? "este vivero"}”? Esta
            acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cerrarEliminacion}
            disabled={eliminando}
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
            color="error"
            onClick={confirmarEliminacion}
            disabled={eliminando}
            sx={{ fontFamily: "Poppins", textTransform: "none" }}
          >
            {eliminando ? "Eliminando…" : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListaViveros;
