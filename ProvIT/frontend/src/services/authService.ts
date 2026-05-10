import { api } from './api';
import { jwtDecode } from 'jwt-decode';
import type { LoginCredentials, AuthResponse, RegisterData } from '../types/auth.types';

// INICIO DE SESIÓN
export const loginService = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post('/login/', {
      username: credentials.email,
      password: credentials.password
    });

    const { access } = response.data;
    localStorage.setItem('access_token', access);

    const decoded: any = jwtDecode(access);

    return {
      token: access,
      user: {
        id: decoded.user_id,
        nombre: decoded.nombre || 'Usuario',
        apellido: decoded.apellido || '',
        email: credentials.email,
        rol: decoded.rol || 1
      }
    };
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Credenciales inválidas. Por favor, verifica tus datos.');
    }
    throw new Error('Ocurrió un error al intentar iniciar sesión. Inténtalo más tarde.');
  }
};

// NUEVO: SERVICIO DE REGISTRO
export const registerService = async (data: RegisterData): Promise<boolean> => {
  try {
    // Patrón Adapter: Traduce el modelo de la Vista al Modelo de Datos (Django)
    // Esto oculta la estructura de la base de datos al componente de React.
    const payloadBackend = {
      nombre_usuario: data.nombre,
      apellido_usuario: data.apellido,
      dni: Number(data.dni),
      correo_usuario: data.email,
      contrasena: data.password,
    };

    // Comunicación con el Controlador de Django
    // Asumimos que Django tiene un endpoint '/registro/' o '/usuarios/' configurado.
    await api.post('/registro/', payloadBackend);

    // Si la petición es exitosa (201 Created), devolvemos true
    return true;

  } catch (error: any) {
    // 3. Captura y traducción de errores de validación (ej. Email ya existe)
    if (error.response && error.response.data) {
      // DRF suele devolver los errores así: {"correo_usuario": ["Este correo ya está en uso."]}
      const dataError = error.response.data;
      
      // Extraemos el primer mensaje de error que encontremos para mostrarlo al usuario
      const primerError = Object.values(dataError)[0];
      const mensaje = Array.isArray(primerError) ? primerError[0] : primerError;
      
      throw new Error(mensaje as string);
    }
    
    // Error genérico si se cae el servidor o hay problema de red
    throw new Error('Ocurrió un error al crear la cuenta. Por favor, intenta de nuevo.');
  }
};