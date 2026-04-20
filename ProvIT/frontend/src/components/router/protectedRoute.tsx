import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import type { RolId } from "../../types/layout.types";

interface ProtectedRouteProps {
  allowedRoles: RolId[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isInitialized } = useAuthContext();

  // Todavía no sabemos si hay sesión — no redirigir todavía
  if (!isInitialized) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.rol)) return <Navigate to="/proveedores" replace />;

  return <Outlet />;
}