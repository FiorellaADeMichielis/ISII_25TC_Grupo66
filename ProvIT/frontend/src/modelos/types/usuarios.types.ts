export type EstadoUsuario = 'activo' | 'inactivo' ;

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatar: string;
  cargo: string;
  rol: string;
  estado: EstadoUsuario;
  ultimoLogin: string;
}

export interface TablaUsuarioProps {
  users: Usuario[];
  onEdit: (user: Usuario) => void;
  onDelete: (user: Usuario) => void;
  onResetPassword: (user: Usuario) => void;
  onView: (user: Usuario) => void;
}
export interface DatosMetricasUsuario {
  total: number;
  activos: number;
  inactivos: number;
  administradores: number;
  operadores: number;
  ultimoAcceso: string;
  tendencias: {
    total: number;
    activos: number;
  };
}