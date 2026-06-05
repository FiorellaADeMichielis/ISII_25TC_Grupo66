import { useState, useCallback } from 'react';
import { estadisticasService } from '../../modelos/services/estadisticasService';
import type { 
  DatosFiltrosUI, 
  AnalisisUI, 
  FiltrosAnalisisProveedor 
} from '../../modelos/types/analisis.types';

export const useEstadisticas = () => {
  // === ESTADOS DE LA UI ===
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<DatosFiltrosUI | null>(null);
  const [analisis, setAnalisis] = useState<AnalisisUI | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // === CASO DE USO 1: Cargar Filtros Iniciales ===
  // Usamos useCallback para que el useEffect de la Vista no lo re-dispare infinitamente
  const cargarFiltros = useCallback(async () => {
    try {
      // Llamamos a la Fachada, no a Axios directamente
      const data = await estadisticasService.obtenerFiltrosDisponibles();
      setFiltrosDisponibles(data);
    } catch (err: any) {
      console.error(err);
      setError('Error de conexión: No se pudieron cargar los filtros disponibles.');
    }
  }, []);

  // === CASO DE USO 2: Analizar un Proveedor Individual ===
  const analizarProveedor = async (filtros: FiltrosAnalisisProveedor) => {
    setLoading(true);
    setError(null);
    setAnalisis(null); // Limpiamos el análisis anterior mientras carga el nuevo
    
    try {
      const data = await estadisticasService.obtenerAnalisisProveedor(filtros);
      setAnalisis(data);
    } catch (err: any) {
      console.error(err);
      setError('No se pudo generar el análisis. Verifique los datos o intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // El ViewModel expone su API pública hacia la Vista
  return {
    filtrosDisponibles,
    analisis,
    loading,
    error,
    cargarFiltros,
    analizarProveedor
  };
};