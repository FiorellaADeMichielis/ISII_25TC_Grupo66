import { api } from './api';
import type { Pedido } from '../types/pedido.types';

interface RespuestaBackend<T> {
  success: boolean;
  data: T;
}

export const pedidoService = {
  obtenerTodos: async (): Promise<Pedido[]> => {
    try {
      // Ajustá esta ruta si el endpoint en Django tiene otro nombre
      const response = await api.get<RespuestaBackend<Pedido[]>>('/pedidos/');
      
      // Acá puedo mapear si llegase a ser necesario transformar la estructura, pero por ahora asumo que el serializer de 
      // Django ya devuelve el formato correcto para el frontend.
      return response.data.data; 
    } catch (error) {
      throw new Error('Error al conectar con el servidor para obtener los pedidos.');
    }
  }
};