import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user);

  return user ? element : <Navigate to="/iniciar-sesion" replace />;
};

export default ProtectedRoute;