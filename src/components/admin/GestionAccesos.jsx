import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Checkbox, Chip, CircularProgress, Container, IconButton,
  MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableHead,
  TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import { cargarAccesosDeTodos, guardarAccesos } from "../../helpers/checkAuthorization";
import { PERMISOS } from "../../helpers/permisos";

const VERDE = "#268576";

const normalizar = (email) => email.trim().toLowerCase();

/**
 * Gestión de quién entra a Arbu Pro y a qué.
 *
 * Escribe el documento `usuariosAutorizados/accesoTablas` entero. Solo la ve un
 * superadmin (ruta con `requiereSuperadmin`) y solo él puede guardarla: las
 * reglas de Firestore rechazan la escritura de cualquier otro.
 */
const GestionAccesos = () => {
  const { user } = useSelector((state) => state.auth);
  const [correos, setCorreos] = useState([]);
  const [roles, setRoles] = useState({});
  const [permisos, setPermisos] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [nuevo, setNuevo] = useState("");

  useEffect(() => {
    cargarAccesosDeTodos()
      .then((datos) => {
        setCorreos(datos.correos);
        setRoles(datos.roles);
        setPermisos(datos.permisos);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const permisosDe = (email) => permisos[email] || [];

  const alternarPermiso = (email, permisoId) => {
    const actuales = permisosDe(email);
    const siguientes = actuales.includes(permisoId)
      ? actuales.filter((p) => p !== permisoId)
      : [...actuales, permisoId];
    setPermisos({ ...permisos, [email]: siguientes });
  };

  const cambiarRol = (email, rol) => setRoles({ ...roles, [email]: rol });

  const agregar = () => {
    const email = normalizar(nuevo);
    if (!email) return;
    if (!email.includes("@")) return setError("Eso no parece un correo.");
    if (correos.includes(email)) return setError("Ese correo ya está en la lista.");

    setCorreos([...correos, email]);
    setRoles({ ...roles, [email]: "admin" });
    setPermisos({ ...permisos, [email]: [] });
    setNuevo("");
    setError(null);
  };

  // Quitarse a uno mismo dejaría la pantalla sin dueño: es el único caso que
  // el formulario impide, porque nadie más podría devolver el acceso.
  const quitar = (email) => {
    if (email === user?.email) return;
    setCorreos(correos.filter((c) => c !== email));
    const { [email]: _rol, ...restoRoles } = roles;
    const { [email]: _permisos, ...restoPermisos } = permisos;
    setRoles(restoRoles);
    setPermisos(restoPermisos);
  };

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      // Solo se persisten los permisos de quien sigue en la lista.
      const limpios = Object.fromEntries(
        correos.map((email) => [email, permisosDe(email)])
      );
      const rolesLimpios = Object.fromEntries(
        correos.map((email) => [email, roles[email] || "admin"])
      );
      await guardarAccesos({ correos, roles: rolesLimpios, permisos: limpios });
      setAviso("Accesos guardados.");
    } catch (e) {
      setError(
        e.code === "permission-denied"
          ? "Firestore rechazó el cambio: solo un superadmin puede guardar accesos."
          : e.message
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress sx={{ color: VERDE }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontFamily: "Poppins", fontWeight: "bold", color: VERDE, mb: 1 }}>
        Accesos a Arbu Pro
      </Typography>
      <Typography sx={{ mb: 3, color: "text.secondary" }}>
        Quién entra al back-office y a qué secciones. Un <strong>superadmin</strong> entra
        a todo y es el único que puede cambiar esta pantalla; a los demás hay que
        darles las áreas una por una.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>Correo</TableCell>
              <TableCell sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>Rol</TableCell>
              {PERMISOS.map((p) => (
                <TableCell key={p.id} align="center" sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                  <Tooltip title={p.descripcion}><span>{p.etiqueta}</span></Tooltip>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {correos.map((email) => {
              const esSuperadmin = roles[email] === "superadmin";
              const soyYo = email === user?.email;
              return (
                <TableRow key={email} hover>
                  <TableCell>
                    {email}{" "}
                    {soyYo && <Chip size="small" label="tú" sx={{ ml: 1 }} />}
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={roles[email] || "admin"}
                      onChange={(e) => cambiarRol(email, e.target.value)}
                      disabled={soyYo}
                    >
                      <MenuItem value="admin">admin</MenuItem>
                      <MenuItem value="superadmin">superadmin</MenuItem>
                    </Select>
                  </TableCell>
                  {PERMISOS.map((p) => (
                    <TableCell key={p.id} align="center">
                      <Tooltip title={esSuperadmin ? "Un superadmin entra a todo" : ""}>
                        <span>
                          <Checkbox
                            checked={esSuperadmin || permisosDe(email).includes(p.id)}
                            disabled={esSuperadmin}
                            onChange={() => alternarPermiso(email, p.id)}
                            sx={{ color: VERDE, "&.Mui-checked": { color: VERDE } }}
                          />
                        </span>
                      </Tooltip>
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Tooltip title={soyYo ? "No puedes quitarte a ti mismo" : "Quitar acceso"}>
                      <span>
                        <IconButton onClick={() => quitar(email)} disabled={soyYo}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          label="Correo de Google"
          placeholder="persona@labtecnosocial.org"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregar()}
          sx={{ minWidth: 300 }}
        />
        <Button variant="outlined" onClick={agregar} sx={{ color: VERDE, borderColor: VERDE }}>
          Añadir persona
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          onClick={guardar}
          disabled={guardando}
          sx={{ backgroundColor: VERDE, "&:hover": { backgroundColor: "#1e6b5e" } }}
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
        El acceso entra en vigor al instante: quien esté con la sesión abierta solo
        tiene que recargar la página.
      </Typography>

      <Snackbar
        open={Boolean(aviso)}
        autoHideDuration={4000}
        onClose={() => setAviso(null)}
        message={aviso}
      />
    </Container>
  );
};

export default GestionAccesos;
