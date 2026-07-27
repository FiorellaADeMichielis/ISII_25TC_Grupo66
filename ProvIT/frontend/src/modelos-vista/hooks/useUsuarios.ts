import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce'; 
import { UsuarioService } from '../../modelos/services/usuarioService';
import type { Usuario } from '../../modelos/types/usuarios.types';
import type { MetricasUsuario } from '../../modelos/types/metricas.types';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [metricas, setMetricas] = useState<MetricasUsuario | null>(null);
  
  // Separa la carga inicial de la recarga de fondo para evitar parpadeos en la UI
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  
  // Estados para filtros y búsqueda
  const [busquedaQuery, setBusquedaQuery] = useState<string>('');
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({ estado: '', rol_id: '' });
  const debouncedBusqueda = useDebounce<string>(busquedaQuery, 500);
  
  // Estados independientes para el Modal de Edición
  const [isModalEdicionOpen, setIsModalEdicionOpen] = useState<boolean>(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  // Estados independientes para el Modal de Detalles
  const [isModalDetallesOpen, setIsModalDetallesOpen] = useState<boolean>(false);
  const [usuarioViendo, setUsuarioViendo] = useState<Usuario | null>(null);

  // Estados independientes para el Modal de Eliminación
  const [isModalEliminarOpen, setIsModalEliminarOpen] = useState<boolean>(false);
  const [usuarioEliminando, setUsuarioEliminando] = useState<Usuario | null>(null);

  const cargarDatos = useCallback(async () => {
    // Activa isFetching en lugar de isLoading para que la tabla no desaparezca al buscar
    setIsFetching(true); 
    try {
      const [datosUsuarios, datosMetricas] = await Promise.all([
        UsuarioService.obtenerUsuarios({ 
          buscar: debouncedBusqueda,
          estado: filtrosAvanzados.estado,
          rol_id: filtrosAvanzados.rol_id
        }), 
        UsuarioService.obtenerMetricas()
      ]);
      setUsuarios(datosUsuarios);
      setMetricas(datosMetricas);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setIsLoading(false); 
      setIsFetching(false); 
    }
  }, [debouncedBusqueda, filtrosAvanzados]); 

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
    console.log("Ver detalles del usuario:", usuario.nombre);
    setUsuarioViendo(usuario);         
    setIsModalDetallesOpen(true);     
  }, []);

  const handleRestablecerContrasena = useCallback((usuario: Usuario) => {
    console.log("Restablecer clave:", usuario.email);
  }, []);

  // Handlers de Vista de Detalles
  const cerrarModalDetalles = useCallback(() => {
    setIsModalDetallesOpen(false);
    setUsuarioViendo(null);
  }, []);

  // Handlers de Eliminación
  const handleEliminarUsuario = useCallback((usuario: Usuario) => {
    setUsuarioEliminando(usuario);
    setIsModalEliminarOpen(true);
  }, []);

  const cerrarModalEliminar = useCallback(() => {
    setIsModalEliminarOpen(false);
    setUsuarioEliminando(null);
  }, []);

  const confirmarEliminacion = useCallback(async () => {
    if (!usuarioEliminando) return;
    try {
      await UsuarioService.eliminarUsuario(usuarioEliminando.id); 
      await cargarDatos(); 
      cerrarModalEliminar(); 
      return { exito: true };
    } catch (error: any) {
      return { exito: false, mensaje: error.message || 'Error al eliminar el usuario' };
    }
  }, [usuarioEliminando, cargarDatos, cerrarModalEliminar]);
  return {
    usuarios,
    metricas,
    isLoading,
    isFetching,
    busquedaQuery,
    setBusquedaQuery,
    filtrosAvanzados,
    setFiltrosAvanzados,
    isModalEdicionOpen,
    usuarioEditando,
    abrirModalEdicion,
    cerrarModalEdicion,
    handleGuardarEdicion,
    handleVistaUsuario,
    handleRestablecerContrasena,
    handleEliminarUsuario,
    cargarDatos,
    isModalDetallesOpen,
    usuarioViendo,
    setUsuarioViendo,
    cerrarModalDetalles,
    isModalEliminarOpen,
    usuarioEliminando,
    cerrarModalEliminar,
    confirmarEliminacion,
  };
};