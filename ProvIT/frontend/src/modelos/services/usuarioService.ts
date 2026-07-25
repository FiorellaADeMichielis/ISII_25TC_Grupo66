// src/servicios/usuarioService.ts
import { api} from '../services/api'; 
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
  // 2. OBTENER MÉTRICAS PARA EL DASHBOARD
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
      // PATRÓN ADAPTADOR: Transforma los datos visuales al modelo estricto de Django
      const payloadBackend = {
        nombre: datosFormulario.nombre,
        apellido: datosFormulario.apellido,
        dni: Number(datosFormulario.dni),       // Convierte el string del input a Número
        correo: datosFormulario.email,          // Mapea'email' de React a 'correo' de Django
        rol_id: Number(datosFormulario.rol_id), // Toma el '1' o '2' del select y lo hace Número
      };

      await api.post('/usuarios/registrar/', payloadBackend);
      
      return true; // Si llega aquí, se creó exitosamente (200/201)

    } catch (error: any) {
      // CAPTURA INTELIGENTE DE ERRORES DE DJANGO
      if (error.response && error.response.data) {
        const dataError = error.response.data;
        // Buscamos si Django mandó {"mensaje": "..."} o {"errores": "..."}
        const mensaje = dataError.errores || dataError.mensaje || Object.values(dataError)[0];
        const textoFinal = Array.isArray(mensaje) ? mensaje[0] : mensaje;
        
        throw new Error(textoFinal as string || 'Error al procesar la solicitud.');
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