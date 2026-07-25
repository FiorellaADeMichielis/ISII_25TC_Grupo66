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

// SERVICIO DE REGISTRO / AGREGAR USUARIO (Módulo Gerente)
export const registerService = async (data: RegisterData): Promise<boolean> => {
  try {
    // Patrón Adapter: Traduce el modelo de la Vista al Modelo de Datos que espera Django
    const payloadBackend = {
      nombre: data.nombre,
      apellido: data.apellido,
      dni: Number(data.dni),
      correo: data.email,       
      rol_id: Number(data.rol),
      password: data.password,
    };

    // 🚀 URL CORREGIDA: Apunta al endpoint protegido del Gerente
    await api.post('/usuarios/registrar/', payloadBackend);

    // Si la petición es exitosa (201 Created), devuelve true
    return true;

  } catch (error: any) {
    // Captura y traducción de errores de validación (ej. Email ya existe o permisos insuficientes)
    if (error.response && error.response.data) {
      const dataError = error.response.data;
      
      // Si el backend manda un mensaje general de error o un diccionario de campos
      const mensaje = dataError.errores || dataError.mensaje || Object.values(dataError)[0];
      const textoFinal = Array.isArray(mensaje) ? mensaje[0] : mensaje;
      
      throw new Error(textoFinal as string || 'Error al procesar la solicitud.');
    }
    
    // Error genérico de red o servidor caído
    throw new Error('Ocurrió un error al crear la cuenta. Por favor, intenta de nuevo.');
  }
};