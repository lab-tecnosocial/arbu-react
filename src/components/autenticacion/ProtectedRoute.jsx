import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user);

  // return user ? element : <Navigate to="/iniciar-sesion" replace />;

  const location = useLocation();
  if (!user) {
    return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
  }
  return element;
};

export default ProtectedRoute;