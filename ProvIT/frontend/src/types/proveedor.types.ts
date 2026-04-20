export interface Proveedor {
  id: number;
  nombre: string;
  cuit: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
}