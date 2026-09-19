import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";
import { useAutorizacion } from "../../helpers/useAutorizacion";

const Cargando = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <CircularProgress />
  </Box>
);

/**
 * Guardia de las rutas de Arbu Pro.
 *
 * - `requiresAuthorization`: hay que estar en la lista de autorizados.
 * - `permiso`: además, tener esa área concedida (o ser superadmin).
 * - `requiereSuperadmin`: solo superadmin, para la gestión de accesos.
 *
 * Todo esto es cortesía: quien manda son las reglas de Firestore. Aquí se
 * evita que alguien llegue a una pantalla que luego no podría leer.
 */
const ProtectedRoute = ({
  element,
  requiresAuthorization = false,
  permiso = null,
  requiereSuperadmin = false,
}) => {
  const { user, checking } = useSelector((state) => state.auth);
  const location = useLocation();
  const acceso = useAutorizacion();

  const hayQueComprobar = requiresAuthorization || permiso || requiereSuperadmin;

  // Mientras Firebase resuelve si hay sesión no se puede decidir nada: al
  // recargar una ruta protegida el usuario todavía no está en el store.
  if (checking) return <Cargando />;

  if (!user) return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;

  if (hayQueComprobar && acceso.comprobando) return <Cargando />;

  if (hayQueComprobar && !acceso.autorizado) return <Navigate to="/no-autorizado" replace />;

  if (requiereSuperadmin && !acceso.esSuperadmin) return <Navigate to="/no-autorizado" replace />;

  if (permiso && !acceso.puedeVer(permiso)) return <Navigate to="/no-autorizado" replace />;

  return element;
};

export default ProtectedRoute;
