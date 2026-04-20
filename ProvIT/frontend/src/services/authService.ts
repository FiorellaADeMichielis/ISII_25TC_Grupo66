import type { LoginCredentials, AuthResponse } from '../types/auth.types';

export const loginService = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simula la llamada HTTP al backend en Django porque todavia no tenemos el backend listo.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'operador@provit.com' && credentials.password === '123456') {
        resolve({
          token: 'jwt-token-simulado-123',
          user: { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'operador@provit.com', rol: 'Operador' }
        });
      } else {
        reject(new Error('Credenciales inválidas. Por favor, intenta de nuevo.'));
      }
    }, 1500); // 1.5s de latencia de red
  });
};