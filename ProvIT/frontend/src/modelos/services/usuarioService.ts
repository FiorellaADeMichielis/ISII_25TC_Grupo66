// src/servicios/usuarioService.ts
import { api } from '../services/api'; 
import type { APIResponse } from '../types/api.types';
import type { Usuario } from '../types/usuarios.types';
import type { MetricasUsuario } from '../types/metricas.types';
import type { ApiResponse } from '../types/pedido.types';

export const UsuarioService = {
  
  obtenerUsuarios: async (filtros?: { buscar?: string; estado?: boolean; rol_id?: number }): Promise<Usuario[]> => {
    const params = {
      busqueda: filtros?.buscar, 
      estado: filtros?.estado,
      rol_id: filtros?.rol_id
    };
    
    const respuesta = await api.get<APIResponse<any[]>>('/usuarios/', { params });
    
    const usuariosFormateados: Usuario[] = respuesta.data.data.map((userBack) => ({
      id: userBack.id_usuario.toString(),
      nombre: userBack.nombre_completo,
      email: userBack.correo_usuario,
      cargo: userBack.rol_nombre || "Sin cargo",
      rol: userBack.rol_nombre || "Sin rol",
      estado: userBack.estado ? 'activo' : 'inactivo',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userBack.nombre_completo)}&background=random`,
      ultimoLogin: "Sin registro" 
    }));

    return usuariosFormateados;
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

  eliminarUsuario: async (id: number): Promise<boolean> => {
    const respuesta = await api.patch<APIResponse<{nuevo_estado: boolean}>>(`/usuarios/${id}/eliminar/`);
    return respuesta.data.data.nuevo_estado;
  }
};