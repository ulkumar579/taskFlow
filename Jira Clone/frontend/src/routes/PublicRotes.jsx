import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PublicRoutes = () => {
  return isAuthenticated()
    ? <Navigate to="/home" replace />
    : <Outlet />;
};

export default PublicRoutes;
