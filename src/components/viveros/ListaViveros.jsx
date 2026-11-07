import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { startLoadingViveros } from "../../actions/viveros.actions";
import RegistrarViveroDialog from "./RegistrarViveroDialog";

const coordenadas = (vivero) => {
  const latitud = vivero.ubicacion?.latitud ?? vivero.latitud;
  const longitud = vivero.ubicacion?.longitud ?? vivero.longitud;

  if (typeof latitud !== "number" || typeof longitud !== "number") return "Sin ubicación";
  return `${latitud.toFixed(6)}, ${longitud.toFixed(6)}`;
};

const ListaViveros = () => {
  const dispatch = useDispatch();
  const { data: viveros, loading, error } = useSelector((state) => state.viveros);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  useEffect(() => {
    dispatch(startLoadingViveros());
  }, [dispatch]);

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
          <Typography variant="h4" sx={{ fontFamily: "Poppins", fontWeight: 700, color: "#268576" }}>
            Viveros
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#6b7a7a" }}>
            Registro y consulta de los viveros de Cochabamba.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(startLoadingViveros({ forzar: true }))}
            disabled={loading}
            sx={{ fontFamily: "Poppins", textTransform: "none" }}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddBusinessIcon />}
            onClick={() => setDialogoAbierto(true)}
            sx={{ fontFamily: "Poppins", textTransform: "none", backgroundColor: "#268576" }}
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
          <CircularProgress sx={{ color: "#268576" }} />
        </Box>
      ) : viveros.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, mb: 1 }}>
            Todavía no hay viveros registrados
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#6b7a7a", mb: 2 }}>
            Usa el botón “Registrar vivero” para crear el primero.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddBusinessIcon />}
            onClick={() => setDialogoAbierto(true)}
            sx={{ fontFamily: "Poppins", textTransform: "none", backgroundColor: "#268576" }}
          >
            Registrar vivero
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {["Nombre", "Contacto", "Ubicación", "Especies", "Foto"].map((encabezado) => (
                  <TableCell
                    key={encabezado}
                    sx={{ fontFamily: "Poppins", fontWeight: 700, color: "#268576" }}
                  >
                    {encabezado}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {viveros.map((vivero) => {
                const especiesVivero = vivero.especies ?? [];

                return (
                  <TableRow key={vivero.id} hover>
                    <TableCell sx={{ fontFamily: "Poppins", minWidth: 180 }}>
                      <Typography sx={{ fontFamily: "Poppins", fontWeight: 600 }}>
                        {vivero.nombre ?? "Sin nombre"}
                      </Typography>
                      {vivero.descripcion && (
                        <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#6b7a7a" }}>
                          {vivero.descripcion}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins", minWidth: 180 }}>
                      {vivero.contactoCorreo && <div>{vivero.contactoCorreo}</div>}
                      {vivero.contactoTelefono && <div>{vivero.contactoTelefono}</div>}
                      {!vivero.contactoCorreo && !vivero.contactoTelefono && "Sin contacto"}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins", minWidth: 160 }}>
                      {coordenadas(vivero)}
                    </TableCell>
                    <TableCell sx={{ minWidth: 220 }}>
                      {especiesVivero.length === 0 ? (
                        <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#6b7a7a" }}>
                          Sin especies
                        </Typography>
                      ) : (
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                          {especiesVivero.map((especie) => (
                            <Chip
                              key={typeof especie === "string" ? especie : especie.nombreComun}
                              size="small"
                              label={typeof especie === "string" ? especie : especie.nombreComun}
                              sx={{ fontFamily: "Poppins" }}
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
                        <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#6b7a7a" }}>
                          Sin imagen
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      <RegistrarViveroDialog
        abierto={dialogoAbierto}
        onCerrar={() => setDialogoAbierto(false)}
        onGuardado={() => dispatch(startLoadingViveros({ forzar: true }))}
      />
    </Box>
  );
};

export default ListaViveros;
