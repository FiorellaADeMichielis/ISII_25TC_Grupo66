export interface Direccion {
  calle: string;
  altura: number;
  fk_localidad: number;
  id_provincia?: number;
}

export interface Proveedor {
  id: number;
  nombre: string;
  cuit: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
  direcciones: Direccion[];
}

export interface ErroresBackend {
  nombre_proveedor?: string[];
  cuit?: string[];
  correo_proveedor?: string[];
  telefono?: string[];
  general?: string;
}

// TIPOS EXCLUSIVOS DE LA INTERFAZ GRÁFICA (UI)
export interface ErroresForm {
  cuit?: string;
  telefono?: string;
  altura?: string;
  nombre?: string;
  email?: string;
  general?: string;
}