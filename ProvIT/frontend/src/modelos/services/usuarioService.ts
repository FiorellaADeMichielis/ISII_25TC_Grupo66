// src/servicios/usuarioService.ts
import { api } from '../services/api'; 
import type { APIResponse } from '../types/api.types';
import type { Usuario } from '../types/usuarios.types';
import type { MetricasUsuario } from '../types/metricas.types';
import type { ApiResponse } from '../types/pedido.types';

export const UsuarioService = {
  
  obtenerUsuarios: async (filtros?: { buscar?: string; estado?: string; rol_id?: string }): Promise<Usuario[]> => {
    try {
      const response = await api.get('/usuarios/', { params: filtros });
      let datosCrudos = [];
      if (Array.isArray(response.data)) {
        datosCrudos = response.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        datosCrudos = response.data.results; // Caso paginación de DRF
      } else if (response.data && Array.isArray(response.data.data)) {
        datosCrudos = response.data.data;    // Caso respuesta envuelta en { data: [...] }
      }

      // Mapeo seguro al contrato de React
      return datosCrudos.map((item: any) => ({
        id: item.id_usuario ? item.id_usuario.toString() : '',
        nombre: `${item.nombre_usuario || ''} ${item.apellido_usuario || ''}`.trim(),
        dni: item.dni ? item.dni.toString() : '',
        email: item.correo_usuario || '',
        avatar: item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.correo_usuario || 'default'}`,
        cargo: item.cargo || 'Sin cargo',
        rol: item.fk_rol?.nombre_rol || (item.fk_rol === 2 ? 'Administrador' : 'Operador'),
        estado: item.estado ? 'activo' : 'inactivo',
        ultimoLogin: item.ultimo_login || 'Nunca'
      }));
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return []; // Retorna vacío si falla para evitar que rompa la UI
    }
  },

  obtenerMetricas: async (): Promise<MetricasUsuario | null> => {
    try {
      const { data } = await api.get<ApiResponse<MetricasUsuario>>('usuarios/metricas/');
      return data.success && data.data ? data.data : null;
    } catch (error) {
      console.error('Error al obtener métricas:', error);
      return null;
    }
  },

  crearUsuario: async (datosFormulario: { nombre: string; apellido: string; dni: string; email: string; rol_id: string }): Promise<boolean> => {
    try {
      const payloadBackend = {
        nombre: datosFormulario.nombre,
        apellido: datosFormulario.apellido,
        dni: Number(datosFormulario.dni),         
        correo: datosFormulario.email,           
        rol_id: Number(datosFormulario.rol_id), 
      };

      await api.post('/usuarios/registrar/', payloadBackend);
      return true; 
    } catch (error: any) {
      if (error.response && error.response.data) {
        const dataError = error.response.data;
        const mensaje = dataError.errores || dataError.mensaje || Object.values(dataError)[0];
        const textoFinal = Array.isArray(mensaje) ? mensaje[0] : mensaje;
        throw new Error(textoFinal as string || 'Error al procesar la solicitud.');
      }
      throw new Error('Ocurrió un error al conectar con el servidor.');
    }
  },

  // Edición completa aplicando el Adaptador y Manejo de Errores
  editarUsuario: async (id: number | string, datosFormulario: { nombre: string; apellido: string; dni: string; email: string; rol_id: string }): Promise<boolean> => {
    try {
      const payloadBackend = {
        nombre: datosFormulario.nombre,
        apellido: datosFormulario.apellido,
        dni: Number(datosFormulario.dni),
        correo: datosFormulario.email,
        rol_id: Number(datosFormulario.rol_id),
      };

      await api.put(`/usuarios/${id}/`, payloadBackend);
      return true;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const dataError = error.response.data;
        const mensaje = dataError.errores || dataError.mensaje || Object.values(dataError)[0];
        const textoFinal = Array.isArray(mensaje) ? mensaje[0] : mensaje;
        throw new Error(textoFinal as string || 'Error al actualizar el usuario.');
      }
      throw new Error('Ocurrió un error al conectar con el servidor.');
    }
  },

  editarRolUsuario: async (id: number, nuevoRolId: number): Promise<string> => {
    const respuesta = await api.patch<APIResponse<{nuevo_rol: string}>>(`/usuarios/${id}/editar-rol/`, {
      nuevo_rol_id: nuevoRolId
    });
    return respuesta.data.data.nuevo_rol;
  },

  eliminarUsuario: async (id: string): Promise<void> => {
    try {
      // Como es una baja lógica (cambio de estado), usa PATCH
      await api.patch(`/usuarios/${id}/eliminar/`);
      
    } catch (error: any) {
      if (error.response && error.response.data) {
        const dataError = error.response.data;
        const mensaje = dataError.errores || dataError.mensaje || Object.values(dataError)[0];
        const textoFinal = Array.isArray(mensaje) ? mensaje[0] : mensaje;
        throw new Error(textoFinal as string || 'Error al procesar la baja del usuario.');
      }
      throw new Error('Ocurrió un error al conectar con el servidor.');
    }
  },

  reactivarUsuario: async (id: string): Promise<void> => {
    try {
      await api.patch(`/usuarios/${id}/reactivar/`);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const dataError = error.response.data;
        const mensaje = dataError.errores || dataError.mensaje || Object.values(dataError)[0];
        const textoFinal = Array.isArray(mensaje) ? mensaje[0] : mensaje;
        throw new Error(textoFinal as string || 'Error al reactivar el usuario.');
      }
      throw new Error('Ocurrió un error al conectar con el servidor.');
    }
  },
};