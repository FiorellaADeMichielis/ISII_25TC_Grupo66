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
