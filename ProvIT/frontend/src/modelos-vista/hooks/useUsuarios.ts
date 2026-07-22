import { useState, useEffect, useCallback } from 'react';
import type { Usuario } from '../../modelos/types/usuarios.types';
import type { MetricasUsuario } from '../../modelos/types/metricas.types';
// servicio HTTP a implementar mas adelante 
// import { UsuarioService } from '../../servicios/usuarioService';

export const useUsuarios = () => {
  // 1. Estados de la Vista
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [metricas, setMetricas] = useState<MetricasUsuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [busquedaQuery, setBusquedaQuery] = useState<string>('');

  // 2. Lógica de Obtención de Datos (Orquestación del Modelo)
  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      // Utilizo Promise.all para hacer fetch concurrente (mejora el performance)
      /* const [datosUsuarios, datosMetricas] = await Promise.all([
        UsuarioService.obtenerUsuarios({ buscar: busquedaQuery }),
        UsuarioService.obtenerMetricas()
      ]);
      */

      // Mock simulando la respuesta de la API para que el tipado no falle
      const datosUsuariosMock: Usuario[] = []; 
      const datosMetricasMock: MetricasUsuario = {
        total: 124, activos: 108, inactivos: 12, administradores: 10, operadores: 102,
        nombre: "Usuarios del Sistema",
        estaCargando: false
      };

      setUsuarios(datosUsuariosMock);
      setMetricas(datosMetricasMock);
    } catch (error) {
      console.error("Error al cargar los datos del módulo de usuarios:", error);
      // Aquí dispararías una notificación tipo Toast (ej. toast.error('Fallo de conexión'))
    } finally {
      setIsLoading(false);
    }
  }, [busquedaQuery]);

  // 3. Efectos Secundarios
  useEffect(() => {
    // NOTA ARQUITECTÓNICA: En producción, es ideal envolver 'busquedaQuery' en un 
    // hook 'useDebounce' para evitar saturar el backend con llamadas por cada tecla presionada.
    cargarDatos();
  }, [cargarDatos]);

  // 4. Handlers de Acciones (Actions Up)
  // Utilizamos useCallback para evitar re-renders innecesarios en la tabla hija
  const handleVistaUsuario = useCallback((usuario: Usuario) => {
    console.log("Abriendo modal de detalles para:", usuario.nombre);
    // Lógica para abrir Drawer/Modal de solo lectura
  }, []);

  const handleEditarUsuario = useCallback((usuario: Usuario) => {
    console.log("Iniciando flujo de edición para:", usuario.nombre);
    // Lógica para cargar los datos en el formulario y abrir modal
  }, []);

  const handleRestablecerContrasena = useCallback((usuario: Usuario) => {
    console.log("Enviando correo de recuperación a:", usuario.email);
    // Lógica de confirmación (SweetAlert/Dialog) y llamada al servicio
  }, []);

  const handleEliminarUsuario = useCallback((usuario: Usuario) => {
    console.log("Iniciando advertencia de eliminación para:", usuario.nombre);
    // Lógica de confirmación destructiva (Modal rojo) y borrado lógico
  }, []);

  // 5. Exposición de la API del Controlador
  return {
    usuarios,
    metricas,
    isLoading,
    busquedaQuery,
    setBusquedaQuery,
    handleVistaUsuario,
    handleEditarUsuario,
    handleRestablecerContrasena,
    handleEliminarUsuario
  };
};