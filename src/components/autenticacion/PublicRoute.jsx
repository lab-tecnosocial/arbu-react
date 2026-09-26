import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element }) => {
  const { user, checking } = useSelector((state) => state.auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/tabla';
  // return user ? <Navigate to="/dashboard" replace /> : element;

  if (checking) {
    return null;
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return element;
};

export default PublicRoute;