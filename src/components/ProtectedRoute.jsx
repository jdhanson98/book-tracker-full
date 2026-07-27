import { Navigate, Outlet } from "react-router";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
