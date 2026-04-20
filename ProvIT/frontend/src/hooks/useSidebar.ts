import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import type { MenuItem, RolId } from "../types/layout.types";
import { ROLES } from "../types/layout.types";

const MENU_ITEMS: MenuItem[] = [
  { name: "Tableros",      path: "/tableros",      iconName: "tableros",      allowedRoles: [ROLES.ADMINISTRADOR, ROLES.GERENTE] },
  { name: "Proveedores",   path: "/proveedores",   iconName: "proveedores",   allowedRoles: [ROLES.OPERADOR, ROLES.ADMINISTRADOR, ROLES.GERENTE] },
  { name: "Facturas",      path: "/facturas",      iconName: "facturas",      allowedRoles: [ROLES.OPERADOR, ROLES.ADMINISTRADOR, ROLES.GERENTE] },
  { name: "Usuarios",      path: "/usuarios",      iconName: "usuarios",      allowedRoles: [ROLES.GERENTE] },
  { name: "Configuración", path: "/configuracion", iconName: "configuracion", allowedRoles: [ROLES.OPERADOR, ROLES.ADMINISTRADOR, ROLES.GERENTE] },
];

export function useSidebar() {
  const { user, handleLogout } = useAuthContext();
  const navigate = useNavigate();

  const rolActual: RolId = user?.rol ?? ROLES.OPERADOR;

  const menuPermitido: MenuItem[] = MENU_ITEMS.filter((item) =>
    item.allowedRoles.includes(rolActual)
  );

  function cerrarSesion(): void {
    if (window.confirm("¿Estás segura de que deseas cerrar sesión?")) {
      handleLogout();
      navigate("/login", { replace: true });
    }
  }

  return { menuPermitido, cerrarSesion, user };
}