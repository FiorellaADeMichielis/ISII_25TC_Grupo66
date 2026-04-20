import { api } from './api';
import type { Proveedor } from '../types/proveedor.types';

export const proveedoresService = {
  // GET: /api/proveedores/ o /api/proveedores/?todos=true
  obtenerTodos: async (incluirTodos: boolean = false) => {
    const url = incluirTodos ? '/proveedores/?todos=true' : '/proveedores/';
    const response = await api.get<Proveedor[]>(url);
    return response.data;
  },

  // POST: /api/proveedores/
  crear: async (data: Omit<Proveedor, 'id'>) => {
    const response = await api.post<Proveedor>('/proveedores/', data);
    return response.data;
  },

  // PATCH: /api/proveedores/<int:pk>/ (Usamos PATCH por si es una edición parcial)
  actualizar: async (id: number, data: Partial<Proveedor>) => {
    const response = await api.patch<Proveedor>(`/proveedores/${id}/`, data);
    return response.data;
  },

  // DELETE: /api/proveedores/<int:pk>/ (el backend hace la baja lógica)
  eliminar: async (id: number) => {
    await api.delete(`/proveedores/${id}/`);
    return id;
  },

  // PATCH: /api/proveedores/<int:pk>/reactivar/
  reactivar: async (id: number) => {
    const response = await api.patch<Proveedor>(`/proveedores/${id}/reactivar/`);
    return response.data;
  }
};