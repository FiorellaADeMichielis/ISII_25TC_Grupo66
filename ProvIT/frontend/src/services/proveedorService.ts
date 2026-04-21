import { api } from './api';
import type { Proveedor, Direccion } from '../types/proveedor.types';

interface RespuestaBackend<T> {
  success: boolean;
  mensaje?: string;
  data: T;
}

interface DireccionBackend {
  calle: string;
  altura: number;
  fk_localidad: number;
}

interface ProveedorBackend {
  id_proveedor: number;
  nombre_proveedor: string;
  cuit: string;
  correo_proveedor: string;
  telefono: string;
  estado: boolean;
  score_riesgo_actual?: number;
  direcciones: DireccionBackend[];
}

// Mapper: Backend -> Frontend
const mapearProveedor = (p: ProveedorBackend): Proveedor => ({
  id:       p.id_proveedor,
  nombre:   p.nombre_proveedor,
  cuit:     p.cuit,
  email:    p.correo_proveedor,
  telefono: p.telefono,
  estado:   p.estado ? 'Activo' : 'Inactivo',
  direcciones: p.direcciones || [],
});

// Mapper: Frontend -> Backend
const mapearABackend = (data: Partial<Proveedor>) => {
  const payload: any = {};
  if (data.nombre !== undefined) payload.nombre_proveedor = data.nombre;
  if (data.email !== undefined) payload.correo_proveedor = data.email;
  if (data.cuit !== undefined) payload.cuit = data.cuit;
  if (data.telefono !== undefined) payload.telefono = data.telefono;
  if (data.estado !== undefined) payload.estado = data.estado === 'Activo';
  if (data.direcciones !== undefined) payload.direcciones = data.direcciones;
  return payload;
};

export const proveedoresService = {

  obtenerTodos: async (incluirTodos: boolean = false) => {
    const url = incluirTodos ? '/proveedores/?todos=true' : '/proveedores/';
    const response = await api.get<RespuestaBackend<ProveedorBackend[]>>(url);
    return response.data.data.map(mapearProveedor);
  },

  crear: async (data: Omit<Proveedor, 'id'>) => {
    const payloadBackend = mapearABackend(data);
    const response = await api.post<RespuestaBackend<ProveedorBackend>>('/proveedores/', payloadBackend);
    return mapearProveedor(response.data.data);
  },

  actualizar: async (id: number, data: Partial<Proveedor>) => {
    const payloadBackend = mapearABackend(data);
    const response = await api.patch<RespuestaBackend<ProveedorBackend>>(`/proveedores/${id}/`, payloadBackend);
    return mapearProveedor(response.data.data);
  },

  eliminar: async (id: number) => {
    await api.delete(`/proveedores/${id}/`);
    return id;
  },

  reactivar: async (id: number) => {
    const response = await api.patch<RespuestaBackend<ProveedorBackend>>(`/proveedores/${id}/reactivar/`);
    return mapearProveedor(response.data.data);
  },

};