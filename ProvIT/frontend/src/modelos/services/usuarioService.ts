// src/servicios/usuarioService.ts
import { api} from '../services/api'; 
import type { APIResponse } from '../types/api.types';
import type { Usuario } from '../types/usuarios.types';
import type { MetricasUsuario } from '../types/metricas.types';

export const UsuarioService = {
  
  obtenerUsuarios: async (filtros?: { buscar?: string; estado?: boolean; rol_id?: number }): Promise<Usuario[]> => {
    const params = {
      busqueda: filtros?.buscar, 
      estado: filtros?.estado,
      rol_id: filtros?.rol_id
    };
    
    // 1. Recibimos la respuesta de Django (podemos usar 'any[]' o crear una interfaz temporal para el backend)
    const respuesta = await api.get<APIResponse<any[]>>('/usuarios/', { params });
    
    // 2. PATRÓN ADAPTADOR: Transformamos las llaves de Django a lo que espera React
    const usuariosFormateados: Usuario[] = respuesta.data.data.map((userBack) => ({
      // Mapeo de IDs y textos
      id: userBack.id_usuario.toString(),
      nombre: userBack.nombre_completo,
      email: userBack.correo_usuario,
      
      // En tu backend no hay "cargo" distinto al "rol", así que duplicamos el rol para la UI
      cargo: userBack.rol_nombre || "Sin cargo",
      rol: userBack.rol_nombre || "Sin rol",
      
      // Transformación crítica: Booleano de Django (True/False) a String de React ('activo'/'inactivo')
      estado: userBack.estado ? 'activo' : 'inactivo',
      
      // Datos visuales (Placeholders) que tu interfaz necesita pero el backend aún no provee
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userBack.nombre_completo)}&background=random`,
      ultimoLogin: "Sin registro" 
    }));

    // 3. Retornamos el array ya traducido. El resto de React ni se enterará del cambio.
    return usuariosFormateados;
  },
  obtenerMetricas: async (): Promise<MetricasUsuario> => {
    const respuesta = await api.get<APIResponse<MetricasUsuario>>('/usuarios/metricas/');
    return respuesta.data.data;
  },

  crearUsuario: async (nuevoUsuario: Omit<Usuario, 'id_usuario'>): Promise<{id_usuario: number, mensaje: string}> => {
    const respuesta = await api.post<APIResponse<{id_usuario: number}>>('/usuarios/agregar/', nuevoUsuario);
    return {
      id_usuario: respuesta.data.data.id_usuario,
      mensaje: respuesta.data.mensaje || 'Usuario creado'
    };
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