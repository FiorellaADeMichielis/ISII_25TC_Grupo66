// src/modelos-vista/hooks/useReportes.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Reporte, FiltrosReporte, FormatoExportacion, AutorReporte } from '../../modelos/types/reportes.types';
import { ReporteService } from '../../modelos/services/reportesService';
import { useDebounce } from './useDebounce';

export const useReportes = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosReporte>({
    busqueda: '',
    soloDestacados: false,
    autorId: '',
    rangoFecha: 'todos',
  });

  // Retrasamos la búsqueda 400ms para no saturar el renderizado al tipear
  const busquedaDebounced = useDebounce(filtros.busqueda, 400);

  // 1. Cargar datos iniciales
  const cargarReportes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ReporteService.obtenerReportes();
      setReportes(data);
    } catch (err) {
      setError('Ocurrió un error al cargar los reportes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarReportes();
  }, [cargarReportes]);

  // 2. Acciones del usuario
  const handleToggleDestacado = useCallback(async (id: string, estadoActual: boolean) => {
    // Optimistic UI update: actualizamos la vista primero para que se sienta instantáneo
    setReportes(prev => prev.map(rep => rep.id === id ? { ...rep, destacado: !estadoActual } : rep));
    
    try {
      const { exito } = await ReporteService.toggleDestacado(id, estadoActual);
      if (!exito) {
        // Si falla en el backend, revertimos (rollback)
        setReportes(prev => prev.map(rep => rep.id === id ? { ...rep, destacado: estadoActual } : rep));
      }
    } catch (error) {
      setReportes(prev => prev.map(rep => rep.id === id ? { ...rep, destacado: estadoActual } : rep));
    }
  }, []);

  const handleExportar = useCallback(async (id: string, formato: FormatoExportacion) => {
    try {
      const { exito, mensaje } = await ReporteService.exportarReporte(id, formato);
      if (exito) {
        alert(mensaje); 
      }
    } catch (error) {
      alert('Error al intentar exportar el reporte.');
    }
  }, []);

  // 3. Lógica de Filtrado Local (Motor de búsqueda)
  const reportesFiltrados = useMemo(() => {
    return reportes.filter(reporte => {
      // Búsqueda por texto (título o descripción)
      const coincideBusqueda = 
        reporte.titulo.toLowerCase().includes(busquedaDebounced.toLowerCase()) || 
        reporte.descripcion.toLowerCase().includes(busquedaDebounced.toLowerCase());
      
      // Filtro de Favoritos
      const coincideDestacado = filtros.soloDestacados ? reporte.destacado : true;
      
      // Filtro de Autor
      const coincideAutor = filtros.autorId ? reporte.autor.id === filtros.autorId : true;
      
      // Filtro de Fechas
      let coincideFecha = true;
      if (filtros.rangoFecha !== 'todos') {
        const fechaReporte = new Date(reporte.fechaCreacion).getTime();
        const diasDiff = (Date.now() - fechaReporte) / (1000 * 3600 * 24);
        
        if (filtros.rangoFecha === 'semana') coincideFecha = diasDiff <= 7;
        if (filtros.rangoFecha === 'mes') coincideFecha = diasDiff <= 30;
      }

      return coincideBusqueda && coincideDestacado && coincideAutor && coincideFecha;
    });
  }, [reportes, busquedaDebounced, filtros]);

  // 4. Generar lista única de autores para el `<select>` del filtro
  const autoresDisponibles = useMemo(() => {
    const mapa = new Map<string, AutorReporte>();
    reportes.forEach(r => mapa.set(r.autor.id, r.autor));
    return Array.from(mapa.values());
  }, [reportes]);

  return {
    reportes: reportesFiltrados,
    isLoading,
    error,
    filtros,
    setFiltros,
    handleToggleDestacado,
    handleExportar,
    autoresDisponibles,
    recargarDatos: cargarReportes
  };
};