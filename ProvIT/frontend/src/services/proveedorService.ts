import { api } from './api';
import type { Proveedor } from '../types/proveedor.types';

//Se utiliza el patrón de diseño Adapter para mapear las respuestas del backend a la estructura que espera el frontend, y viceversa.
//Esto desacopla ambos lados y facilita futuros cambios en la API sin afectar la lógica de negocio del frontend.

// === INTERFACES DE CONTRATO (Lo que el servicio espera recibir o devolver) ===
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
    try {
      const response = await api.post<RespuestaBackend<ProveedorBackend>>('/proveedores/', payloadBackend);
      return mapearProveedor(response.data.data);
    } catch (err: any) {
      const erroresBackend = err?.response?.data?.errores;
      throw erroresBackend ?? { general: 'Error al conectar con el servidor.' };
    }
  },

  actualizar: async (id: number, data: Partial<Proveedor>) => {
    const payloadBackend = mapearABackend(data);
    try {
      const response = await api.patch<RespuestaBackend<ProveedorBackend>>(`/proveedores/${id}/`, payloadBackend);
      return mapearProveedor(response.data.data);
    } catch (err: any) {
      const erroresBackend = err?.response?.data?.errores;
      throw erroresBackend ?? { general: 'Error al conectar con el servidor.' };
    }
  },

  // AÑADIDO: Manejo de errores para capturar rechazos de permisos (403) o Not Found (404)
  eliminar: async (id: number) => {
    try {
      await api.delete(`/proveedores/${id}/`);
      return id;
    } catch (err: any) {
      // DRF envía los errores de permisos genéricos en la propiedad "detail" o "errores" (según tu helper en Django)
      const errorMsg = err?.response?.data?.errores || err?.response?.data?.detail;
      throw { general: errorMsg || 'No tienes permisos para dar de baja o hubo un error de conexión.' };
    }
  },

  // AÑADIDO: Manejo de errores estructurado
  reactivar: async (id: number) => {
    try {
      const response = await api.patch<RespuestaBackend<ProveedorBackend>>(`/proveedores/${id}/reactivar/`);
      return mapearProveedor(response.data.data);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.errores || err?.response?.data?.detail;
      throw { general: errorMsg || 'No tienes permisos para reactivar o hubo un error de conexión.' };
    }
  },

};