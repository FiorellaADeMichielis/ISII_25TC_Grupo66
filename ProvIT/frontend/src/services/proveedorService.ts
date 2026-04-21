import { api } from './api';
import type { Proveedor, Direccion } from '../types/proveedor.types';

interface RespuestaBackend<T> {
  success: boolean;
  mensaje?: string;
  data: T;
}

// === INTERFACES DE LECTURA (Lo que devuelve GET/POST/PATCH) ===
interface ProvinciaAnidada {
  id_provincia: number;
  nombre_provincia: string;
}

interface LocalidadAnidada {
  id_localidad: number;
  codigo_postal: number;
  nombre_localidad: string;
  provincia: ProvinciaAnidada;
}

interface DireccionBackendLectura {
  id_direccion?: number;
  calle: string;
  altura: number;
  localidad: LocalidadAnidada; 
}

interface ProveedorBackend {
  id_proveedor: number;
  nombre_proveedor: string;
  cuit: string;
  correo_proveedor: string;
  telefono: string;
  estado: boolean;
  score_riesgo_actual?: number;
  direcciones: DireccionBackendLectura[];
}

// Mapper: Backend -> Frontend (Aplana el JSON anidado de Django)
const mapearProveedor = (p: ProveedorBackend): Proveedor => ({
  id:       p.id_proveedor,
  nombre:   p.nombre_proveedor,
  cuit:     p.cuit,
  email:    p.correo_proveedor,
  telefono: p.telefono,
  estado:   p.estado ? 'Activo' : 'Inactivo',
  direcciones: p.direcciones?.map(d => ({
    calle: d.calle,
    altura: d.altura,
    fk_localidad: d.localidad.id_localidad,
    id_provincia: d.localidad.provincia.id_provincia
  })) || [],
});

// Mapper: Frontend -> Backend (Arma el payload plano que espera ProveedorWriteSerializer)
const mapearABackend = (data: Partial<Proveedor>) => {
  const payload: any = {};
  
  if (data.nombre !== undefined) payload.nombre_proveedor = data.nombre;
  if (data.email !== undefined) payload.correo_proveedor = data.email;
  if (data.cuit !== undefined) payload.cuit = data.cuit;
  if (data.telefono !== undefined) payload.telefono = data.telefono;
  if (data.estado !== undefined) payload.estado = data.estado === 'Activo';
  
  if (data.direcciones !== undefined) {
    payload.direcciones = data.direcciones.map(d => ({
      calle: d.calle,
      altura: d.altura,
      fk_localidad: d.fk_localidad
    }));
  }
  
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