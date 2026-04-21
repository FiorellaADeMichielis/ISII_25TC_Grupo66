export interface Direccion {
  calle: string;
  altura: number;
  fk_localidad: number;
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