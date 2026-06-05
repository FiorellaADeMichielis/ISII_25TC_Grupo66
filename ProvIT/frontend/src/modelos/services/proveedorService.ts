import { api } from './api';
import type { Proveedor } from '../types/proveedor.types';

// ARQUITECTURA: PATRÓN FACHADA (FACADE) + DATA MAPPER
// 1. FACHADA: 'proveedoresService' actúa como un punto de acceso unificado.
//    Oculta la complejidad del subsistema de red (Axios, endpoints, verbos HTTP
//    y manejo de excepciones) para mantener los componentes de React limpios, 
//    "tontos" (Dumb Components) y con bajo acoplamiento.
//
// 2. DATA MAPPER: Funciones traductoras que aíslan 
//    nuestro Modelo de Dominio (Frontend) de los DTOs provenientes de Django, 
//    garantizando que la nomenclatura de la base de datos no contamine la UI.

// === INTERFACES DE CONTRATO (Lo que el servicio espera recibir o devolver) ===
interface RespuestaBackend<T> {
  success: boolean;
  mensaje?: string;
  data: T;
}

// === INTERFACES DE LECTURA (DTOs: Lo que devuelve GET/POST/PATCH) ===
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

// DATA MAPPERS

// Mapper: Backend -> Frontend 
// Toma el DTO complejo de la infraestructura y lo transforma en una entidad 
// plana para la vista. Tolerancia al cambio: si el JSON de Django muta, 
// solo se modifica esta función, salvaguardando toda la lógica de React.
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

// Mapper: Frontend -> Backend 
// Ensambla el payload plano que espera ProveedorWriteSerializer en el backend.
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

// FACHADA (Facade): INTERFAZ UNIFICADA PARA EL CLIENTE
export const proveedoresService = {

  // Los clientes (Hooks/Componentes) consumen estos métodos semánticos.
  // Desconocen la existencia de Axios, los endpoints y los mapeos internos.
  
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

  // Centralización de manejo de excepciones y control de acceso (RBAC - 403 Forbidden)
  eliminar: async (id: number) => {
    try {
      await api.delete(`/proveedores/${id}/`);
      return id;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.errores || err?.response?.data?.detail;
      throw { general: errorMsg || 'No tienes permisos para dar de baja o hubo un error de conexión.' };
    }
  },

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