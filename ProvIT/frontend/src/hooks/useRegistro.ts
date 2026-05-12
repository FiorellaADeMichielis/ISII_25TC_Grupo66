import { useState } from 'react';
import { registerService } from '../services/authService';
import type { RegisterData } from '../types/auth.types';

export const useRegistro = () => {
  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  const registrarUsuario = async (datos: RegisterData): Promise<boolean> => {
    setLoading(true);
    setErrorGlobal(null);
    try {
      // Delega al servicio el manejo de la lógica de registro y captura cualquier error formateado por el adapter
      const exito = await registerService(datos);
      return exito;
    } catch (err: any) {
      // Atrapa el error formateado por el adapter del servicio 
      setErrorGlobal(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    registrarUsuario,
    loading,
    errorGlobal
  };
};