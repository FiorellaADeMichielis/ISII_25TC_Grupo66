export type EstadoUsuario = 'activo' | 'inactivo' ;

export interface Usuario {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  avatar: string;
  cargo: string;
  rol: string;
  estado: EstadoUsuario;
  ultimoLogin: string;
}

export interface TablaUsuarioProps {
  users: Usuario[];
  onView: (usuario: Usuario) => void;
  onEdit: (usuario: Usuario) => void;
  onResetPassword: (usuario: Usuario) => void;
  onToggleStatus: (usuario: Usuario, accion: 'inactivar' | 'reactivar') => void;
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
export interface ErroresFormUsuario {
  nombre?: string;
  apellido?: string;
  dni?: string;
  email?: string;
  general?: string;
}
