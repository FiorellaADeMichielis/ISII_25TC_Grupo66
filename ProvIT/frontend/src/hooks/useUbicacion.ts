import { useState, useEffect } from 'react';
import { ubicacionService } from '../services/ubicacionService';
import type { Provincia, Localidad } from '../types/ubicacion.types';

export const useUbicaciones = (provinciaInicial?: number) => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<number | ''>(provinciaInicial || '');
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);

  // 1. Cargar provincias al montar el hook
  useEffect(() => {
    const cargarProvincias = async () => {
      setLoadingProvincias(true);
      try {
        const data = await ubicacionService.obtenerProvincias();
        setProvincias(data);
      } catch (error) {
        console.error("Error al cargar provincias", error);
      } finally {
        setLoadingProvincias(false);
      }
    };
    cargarProvincias();
  }, []);

  // 2. Cargar localidades cada vez que cambia la provincia seleccionada
  useEffect(() => {
    const cargarLocalidades = async () => {
      if (!provinciaSeleccionada) {
        setLocalidades([]);
        return;
      }
      
      setLoadingLocalidades(true);
      try {
        const data = await ubicacionService.obtenerLocalidadesPorProvincia(provinciaSeleccionada);
        setLocalidades(data);
      } catch (error) {
        console.error("Error al cargar localidades", error);
      } finally {
        setLoadingLocalidades(false);
      }
    };
    cargarLocalidades();
  }, [provinciaSeleccionada]);

  return {
    provincias,
    localidades,
    provinciaSeleccionada,
    setProvinciaSeleccionada,
    loadingProvincias,
    loadingLocalidades
  };
};