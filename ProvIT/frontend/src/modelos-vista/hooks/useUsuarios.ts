import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../modelos-vista/hooks/useDebounce'; 
import { UsuarioService } from '../../modelos/services/usuarioService';

import type { Usuario } from '../../modelos/types/usuarios.types';
import type { MetricasUsuario } from '../../modelos/types/metricas.types';

export const useUsuarios = () => {
  // 1. Estados de la Vista
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [metricas, setMetricas] = useState<MetricasUsuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [busquedaQuery, setBusquedaQuery] = useState<string>('');

  // =====================================================================
  // 2. USEDEBOUNCE (Antes de cualquier lógica que lo consuma)
  // =====================================================================
  const debouncedBusqueda = useDebounce<string>(busquedaQuery, 500);

  // 3. Lógica de Obtención de Datos (Dinámica y Optimizada)
  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      // Usamos Promise.all para hacer fetch concurrente de tablas y métricas[cite: 349]. 
      // Esto reduce drásticamente el tiempo total de carga a la mitad[cite: 350].
      const [datosUsuarios, datosMetricas] = await Promise.all([
        UsuarioService.obtenerUsuarios({ buscar: debouncedBusqueda }), // <-- 3. USAMOS EL VALOR DEBOUNCED
        UsuarioService.obtenerMetricas()
      ]);

      setUsuarios(datosUsuarios);
      setMetricas(datosMetricas);
    } catch (error) {
      console.error("Error al cargar los datos del módulo de usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedBusqueda]); 

  // 4. Efectos Secundarios
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // 5. Handlers de Acciones (Actions Up)
  const handleVistaUsuario = useCallback((usuario: Usuario) => {
    console.log("Abriendo modal de detalles para:", usuario.nombre);
  }, []);

  const handleEditarUsuario = useCallback((usuario: Usuario) => {
    console.log("Iniciando flujo de edición para:", usuario.nombre);
  }, []);

  const handleRestablecerContrasena = useCallback((usuario: Usuario) => {
    console.log("Enviando correo de recuperación a:", usuario.email);
  }, []);

  const handleEliminarUsuario = useCallback((usuario: Usuario) => {
    console.log("Iniciando advertencia de eliminación para:", usuario.nombre);
  }, []);

  // 6. Exposición de la API del Controlador
  return {
    usuarios,
    metricas,
    isLoading,
    busquedaQuery,
    setBusquedaQuery, // Esto sigue actualizando el input en tiempo real para no bloquear al usuario
    handleVistaUsuario,
    handleEditarUsuario,
    handleRestablecerContrasena,
    handleEliminarUsuario
  };
};