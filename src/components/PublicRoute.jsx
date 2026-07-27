import { Navigate, Outlet } from "react-router";

import { useAuth } from "../context/AuthContext";

function PublicRoute() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
