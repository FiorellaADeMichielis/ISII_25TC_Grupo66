import { useState } from 'react';
import { loginService } from '../services/authService';
import type { LoginCredentials } from '../types/auth.types';

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await loginService(credentials);
      
      console.log('Autenticación exitosa', data.user);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
      // Eliminamos todo rastro del usuario en el navegador
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Si tuvieras un endpoint en Django para invalidar el token, 
      // la llamada a la API (ej: authService.logout()) iría aquí.
    };

    // No olvides exportar la nueva función aquí abajo
    return { handleLogin, handleLogout, loading, error };
};