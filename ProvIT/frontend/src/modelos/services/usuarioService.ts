import axios from 'axios';
import type { Usuario } from '../../modelos/types/usuarios.types';
import type { MetricasUsuario } from '../../modelos/types/metricas.types';

// 1. Configuración centralizada de Axios para este dominio
const apiClient = axios.create({
  // En producción, esto debería venir de tus variables de entorno (.env)
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : 'https://api.provit.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de seguridad (10 segundos)
});

// 2. Interceptor: Inyección automática del Token JWT de seguridad (SaaS Standard)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('provit_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Objeto Servicio con todos los métodos del CRUD tipados
export const UsuarioService = {
  
  /**
   * Obtiene la lista de usuarios. Soporta filtros dinámicos como búsqueda.
   */
  obtenerUsuarios: async (filtros?: { buscar?: string }): Promise<Usuario[]> => {
    // Axios inyectará automáticamente "?buscar=lo_que_escribas" en la URL
    const respuesta = await apiClient.get<Usuario[]>('/usuarios', { params: filtros });
    return respuesta.data;
  },

  /**
   * Obtiene las métricas globales para el dashboard superior.
   */
  obtenerMetricas: async (): Promise<MetricasUsuario> => {
    const respuesta = await apiClient.get<MetricasUsuario>('/usuarios/metricas');
    return respuesta.data;
  },

  /**
   * Crea un nuevo usuario en la plataforma.
   * Usamos Omit para indicar que enviamos un Usuario, pero sin el ID (lo genera el backend).
   */
  crearUsuario: async (nuevoUsuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
    const respuesta = await apiClient.post<Usuario>('/usuarios', nuevoUsuario);
    return respuesta.data;
  },

  /**
   * Actualiza los datos de un usuario existente.
   */
  editarUsuario: async (id: string, datos: Partial<Usuario>): Promise<Usuario> => {
    const respuesta = await apiClient.put<Usuario>(`/usuarios/${id}`, datos);
    return respuesta.data;
  },

  /**
   * Realiza un borrado lógico o físico del usuario.
   */
  eliminarUsuario: async (id: string): Promise<void> => {
    await apiClient.delete(`/usuarios/${id}`);
  },

  /**
   * Dispara el flujo de recuperación de contraseña para un usuario.
   */
  restablecerContrasena: async (id: string): Promise<void> => {
    await apiClient.post(`/usuarios/${id}/restablecer-contrasena`);
  }
};