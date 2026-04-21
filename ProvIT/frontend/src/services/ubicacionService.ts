import { api } from './api';
import type { Provincia, Localidad } from '../types/ubicacion.types';

export const ubicacionService = {
  obtenerProvincias: async (): Promise<Provincia[]> => {
    const response = await api.get('/provincias/');
    return response.data.data; 
  },

  obtenerLocalidadesPorProvincia: async (idProvincia: number): Promise<Localidad[]> => {
    const response = await api.get(`/localidades/?provincia_id=${idProvincia}`);
    return response.data.data;
  }
};