export interface MetricasEntidad {
  nombre: string;
  precio: number;
  calidad: number;
  velocidad: number;
  recomendacion?: string;
}

export interface MetricasUsuario {
    nombre: string;
    total: number;
    activos: number;
    inactivos: number;
    administradores: number;
    operadores: number;
    estaCargando: boolean;
};

export interface TarjetaResultadoProps {
  datos: MetricasEntidad;
}

export interface TarjetaUsuariosProps {
  datos: MetricasUsuario;
}