import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element }) => {
  const user = useSelector((state) => state.auth?.user); // Asegurar que Redux contiene el usuario

  console.log("PublicRoute - User:", user); // Debug: Verifica si el usuario está presente

  return user ? <Navigate to="/dashboard" replace /> : element;
};

export default PublicRoute;