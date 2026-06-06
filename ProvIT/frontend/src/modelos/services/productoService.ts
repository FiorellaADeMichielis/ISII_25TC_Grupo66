import { api } from './api';

export const productoService = {
  // Obtenemos todos los productos
  getAll: async () => {
    try {
      const response = await api.get('/productos');
      // Retornamos directamente los datos
      return response.data;
    } catch (error) {
      console.error("Error en productoService.getAll:", error);
      throw error;
    }
  }
};