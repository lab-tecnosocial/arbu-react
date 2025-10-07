import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkUserAuthorization } from "../../helpers/checkAuthorization";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ element, requiresAuthorization = false }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(requiresAuthorization);

  useEffect(() => {
    const verifyAuthorization = async () => {
      if (user && requiresAuthorization) {
        setLoading(true);
        const authorized = await checkUserAuthorization(user.email);
        setIsAuthorized(authorized);
        setLoading(false);
      }
    };

    verifyAuthorization();
  }, [user, requiresAuthorization]);

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
  }

  // Si requiere autorización y está cargando, mostrar spinner
  if (requiresAuthorization && loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si requiere autorización y no está autorizado, redirigir a página de no autorizado
  if (requiresAuthorization && !isAuthorized) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // Si todo está bien, mostrar el componente
  return element;
};

export default ProtectedRoute;