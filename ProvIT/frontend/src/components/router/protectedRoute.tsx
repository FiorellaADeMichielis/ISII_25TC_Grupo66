import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import type { RolId } from "../../types/layout.types";

interface ProtectedRouteProps {
  allowedRoles: RolId[];
  // Aplicamos OCP: Permitimos inyectar la ruta de fallback, con un valor por defecto
  fallbackPath?: string; 
}

export function ProtectedRoute({ allowedRoles, fallbackPath = "/proveedores" }: ProtectedRouteProps) {
  const { user, isInitialized } = useAuthContext();

  // 1. Visibilidad del Estado del Sistema (Feedback Visual)
  // En lugar de null, mostramos un indicador de carga genérico
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {/* Un spinner CSS simple. Podés reemplazarlo por tu propio componente <Spinner /> */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Control de Autenticación (Ausencia de credenciales -> 401)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Control de Autorización RBAC (Rol insuficiente -> 403)
  if (!allowedRoles.includes(user.rol)) {
    // A futuro, lo ideal a nivel arquitectónico es que fallbackPath sea "/no-autorizado" (pantalla 403)
    // para no redirigir en bucle si un usuario pierde permisos sobre /proveedores.
    return <Navigate to={fallbackPath} replace />;
  }

  // 4. Vía libre: Renderizamos el sub-árbol de componentes
  return <Outlet />;
}