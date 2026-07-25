import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce'; 
import { UsuarioService } from '../../modelos/services/usuarioService';
import type { Usuario } from '../../modelos/types/usuarios.types';
import type { MetricasUsuario } from '../../modelos/types/metricas.types';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [metricas, setMetricas] = useState<MetricasUsuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [busquedaQuery, setBusquedaQuery] = useState<string>('');

  // Estados independientes para el Modal de Edición
  const [isModalEdicionOpen, setIsModalEdicionOpen] = useState<boolean>(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const debouncedBusqueda = useDebounce<string>(busquedaQuery, 500);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [datosUsuarios, datosMetricas] = await Promise.all([
        UsuarioService.obtenerUsuarios({ buscar: debouncedBusqueda }), 
        UsuarioService.obtenerMetricas()
      ]);
      setUsuarios(datosUsuarios);
      setMetricas(datosMetricas);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedBusqueda]); 

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Handlers de Edición
  const abrirModalEdicion = useCallback((usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setIsModalEdicionOpen(true);
  }, []);

  const cerrarModalEdicion = useCallback(() => {
    setIsModalEdicionOpen(false);
    setUsuarioEditando(null);
  }, []);

  const handleGuardarEdicion = useCallback(async (id: string, datos: any) => {
    try {
      await UsuarioService.editarUsuario(id, datos);
      await cargarDatos();
      return { exito: true };
    } catch (err: any) {
      return { 
        exito: false, 
        errores: { mensaje: err.message || 'Error al actualizar el usuario' } 
      };
    }
  }, [cargarDatos]);

  const handleVistaUsuario = useCallback((usuario: Usuario) => {
    console.log("Ver detalles:", usuario.nombre);
  }, []);

  const handleRestablecerContrasena = useCallback((usuario: Usuario) => {
    console.log("Restablecer clave:", usuario.email);
  }, []);

  const handleEliminarUsuario = useCallback((usuario: Usuario) => {
    console.log("Eliminar usuario:", usuario.nombre);
  }, []);

  return {
    usuarios,
    metricas,
    isLoading,
    busquedaQuery,
    setBusquedaQuery,
    isModalEdicionOpen,
    usuarioEditando,
    abrirModalEdicion,
    cerrarModalEdicion,
    handleGuardarEdicion,
    handleVistaUsuario,
    handleRestablecerContrasena,
    handleEliminarUsuario,
    cargarDatos
  };
};