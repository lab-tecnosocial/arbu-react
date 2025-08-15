import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element }) => {
  const user = useSelector((state) => state.auth?.user);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  // return user ? <Navigate to="/dashboard" replace /> : element;

  if (user) {
    return <Navigate to={from} replace />;
  }

  return element;
};

export default PublicRoute;