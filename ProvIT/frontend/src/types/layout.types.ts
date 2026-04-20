export interface TopbarProps {
  pageTitle: string;
}
export type RolId = 1 | 2 | 3;

export const ROLES = {
  OPERADOR:       1,
  ADMINISTRADOR:  2,
  GERENTE:        3,
} as const;

export interface MenuItem {
  name: string;
  path: string;
  iconName: "tableros" | "proveedores" | "facturas" | "usuarios" | "configuracion";
  allowedRoles: RolId[];
}